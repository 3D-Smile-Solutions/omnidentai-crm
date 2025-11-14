// backend/src/controllers/practiceDocumentController.js
import supabase from "../utils/supabaseClient.js";
import { v4 as uuidv4 } from 'uuid';

/**
 * Get the appropriate storage bucket based on document type
 */
const getStorageBucket = (documentType) => {
  switch (documentType) {
    case 'form':
      return 'practice-forms';
    case 'report':
      return 'practice-reports';
    case 'chat_attachment':
      return 'chat-attachments';
    default:
      throw new Error('Invalid document type');
  }
};

/**
 * Build file path based on document type
 */
const buildFilePath = (documentType, dentistId, category, patientId, filename) => {
  const fileExtension = filename.split('.').pop();
  const uniqueFilename = `${uuidv4()}.${fileExtension}`;
  
  if (documentType === 'chat_attachment' && patientId) {
    // chat-attachments/{dentist_id}/{patient_id}/{uuid}.{ext}
    return `${dentistId}/${patientId}/${uniqueFilename}`;
  } else {
    // practice-forms/{dentist_id}/{category}/{uuid}.{ext}
    // practice-reports/{dentist_id}/{category}/{uuid}.{ext}
    return `${dentistId}/${category}/${uniqueFilename}`;
  }
};

/**
 * Generate a fresh signed URL for a document
 * @param {string} bucket - Storage bucket name
 * @param {string} filePath - File path in storage
 * @param {number} expiresIn - Expiration time in seconds (default: 7 days)
 */
const generateSignedUrl = async (bucket, filePath, expiresIn = 604800) => {
  try {
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from(bucket)
      .createSignedUrl(filePath, expiresIn); // 7 days = 604800 seconds

    if (signedUrlError) {
      console.error('❌ Error creating signed URL:', signedUrlError);
      return null;
    }

    return signedUrlData?.signedUrl;
  } catch (error) {
    console.error('❌ Exception creating signed URL:', error);
    return null;
  }
};

/**
 * Upload practice document
 * POST /practice-documents/upload
 */
export async function uploadPracticeDocument(req, res) {
  try {
    const dentistId = req.user?.id;
    if (!dentistId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const { documentType, category, description, patientId } = req.body;

    if (!documentType || !category) {
      return res.status(400).json({ error: "Document type and category are required" });
    }

    const validTypes = ['form', 'report', 'chat_attachment'];
    if (!validTypes.includes(documentType)) {
      return res.status(400).json({ error: "Invalid document type" });
    }

    const file = req.file;
    console.log('📁 Uploading practice document:', {
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      documentType,
      category,
      patientId
    });

    const MAX_FILE_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      return res.status(400).json({ error: "File size exceeds 50MB limit" });
    }

    const storageBucket = getStorageBucket(documentType);
    const filePath = buildFilePath(documentType, dentistId, category, patientId, file.originalname);

    console.log('📂 Storage details:', { storageBucket, filePath });

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(storageBucket)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('❌ Supabase upload error:', uploadError);
      return res.status(500).json({ 
        error: "Failed to upload file",
        details: uploadError.message 
      });
    }

    console.log('✅ File uploaded to Supabase:', uploadData.path);

    // Generate signed URL (7 days expiration)
    const signedUrl = await generateSignedUrl(storageBucket, filePath);

    // Save to practice_documents table
    const { data: document, error: dbError } = await supabase
      .from('practice_documents')
      .insert([{
        dentist_id: dentistId,
        document_type: documentType,
        category: category,
        filename: file.originalname,
        file_path: filePath,
        storage_bucket: storageBucket,
        mime_type: file.mimetype,
        file_size: file.size,
        patient_id: patientId || null,
        description: description || null
      }])
      .select()
      .single();

    if (dbError) {
      console.error('❌ Database error:', dbError);
      await supabase.storage.from(storageBucket).remove([filePath]);
      return res.status(500).json({ 
        error: "Failed to save document metadata",
        details: dbError.message 
      });
    }

    console.log('✅ Practice document metadata saved');

    res.json({
      success: true,
      document: {
        ...document,
        url: signedUrl
      }
    });

  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({ 
      error: "Failed to upload document",
      details: error.message 
    });
  }
}

/**
 * Get practice documents with fresh signed URLs
 * GET /practice-documents?type=form&category=patient_intake
 */
export async function getPracticeDocuments(req, res) {
  try {
    const dentistId = req.user?.id;
    if (!dentistId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { type, category, patientId } = req.query;

    let query = supabase
      .from('practice_documents')
      .select('*')
      .eq('dentist_id', dentistId)
      .order('created_at', { ascending: false });

    if (type) query = query.eq('document_type', type);
    if (category) query = query.eq('category', category);
    if (patientId) query = query.eq('patient_id', patientId);

    const { data: documents, error } = await query;

    if (error) {
      console.error('❌ Error fetching documents:', error);
      return res.status(500).json({ error: "Failed to fetch documents" });
    }

    // Generate fresh signed URLs (7 days expiration)
    const documentsWithUrls = await Promise.all(
      documents.map(async (doc) => {
        const signedUrl = await generateSignedUrl(doc.storage_bucket, doc.file_path);
        return {
          ...doc,
          url: signedUrl
        };
      })
    );

    res.json({ documents: documentsWithUrls });

  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: "Failed to fetch documents" });
  }
}

/**
 * Get a single document with fresh signed URL
 * GET /practice-documents/:documentId
 */
export async function getDocumentById(req, res) {
  try {
    const dentistId = req.user?.id;
    if (!dentistId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { documentId } = req.params;

    const { data: document, error: fetchError } = await supabase
      .from('practice_documents')
      .select('*')
      .eq('id', documentId)
      .eq('dentist_id', dentistId)
      .single();

    if (fetchError || !document) {
      return res.status(404).json({ error: "Document not found" });
    }

    // Generate fresh signed URL
    const signedUrl = await generateSignedUrl(document.storage_bucket, document.file_path);

    res.json({
      document: {
        ...document,
        url: signedUrl
      }
    });

  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: "Failed to fetch document" });
  }
}

/**
 * Delete practice document
 * DELETE /practice-documents/:documentId
 */
export async function deletePracticeDocument(req, res) {
  try {
    const dentistId = req.user?.id;
    if (!dentistId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { documentId } = req.params;

    const { data: document, error: fetchError } = await supabase
      .from('practice_documents')
      .select('*')
      .eq('id', documentId)
      .eq('dentist_id', dentistId)
      .single();

    if (fetchError || !document) {
      return res.status(404).json({ error: "Document not found" });
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from(document.storage_bucket)
      .remove([document.file_path]);

    if (storageError) {
      console.error('❌ Storage deletion error:', storageError);
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('practice_documents')
      .delete()
      .eq('id', documentId);

    if (dbError) {
      console.error('❌ Database deletion error:', dbError);
      return res.status(500).json({ error: "Failed to delete document" });
    }

    console.log('🗑️ Practice document deleted:', documentId);
    res.json({ success: true, message: "Document deleted successfully" });

  } catch (error) {
    console.error('❌ Delete error:', error);
    res.status(500).json({ error: "Failed to delete document" });
  }
}