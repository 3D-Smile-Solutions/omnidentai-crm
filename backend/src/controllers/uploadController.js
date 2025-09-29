// backend/src/controllers/uploadController.js
import supabase from "../utils/supabaseClient.js";
import { v4 as uuidv4 } from 'uuid';

/**
 * Upload file to Supabase Storage and return URL
 * POST /upload
 */
export async function uploadFile(req, res) {
  try {
    const dentistId = req.user?.id;
    if (!dentistId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Check if file exists in request
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const { patientId } = req.body;
    if (!patientId) {
      return res.status(400).json({ error: "Patient ID required" });
    }

    const file = req.file;
    console.log('📁 Uploading file:', {
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      patientId
    });

    // Validate file size (50MB max)
    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes
    if (file.size > MAX_FILE_SIZE) {
      return res.status(400).json({ error: "File size exceeds 50MB limit" });
    }

    // Validate file type
    const allowedMimeTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return res.status(400).json({ 
        error: "Invalid file type. Allowed: images, PDF, Word, Excel" 
      });
    }

    // Generate unique filename
    const fileExtension = file.originalname.split('.').pop();
    const uniqueFilename = `${dentistId}/${patientId}/${uuidv4()}.${fileExtension}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('chat-attachments')
      .upload(uniqueFilename, file.buffer, {
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

    // Get public URL (even though bucket is private, we'll use signed URLs)
    const { data: urlData } = supabase.storage
      .from('chat-attachments')
      .getPublicUrl(uniqueFilename);

    // Generate signed URL (valid for 1 hour)
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from('chat-attachments')
      .createSignedUrl(uniqueFilename, 3600); // 1 hour expiry

    if (signedUrlError) {
      console.error('❌ Error creating signed URL:', signedUrlError);
    }

    // Return file metadata
    res.json({
      success: true,
      file: {
        id: uuidv4(),
        filename: file.originalname,
        path: uniqueFilename,
        url: signedUrlData?.signedUrl || urlData.publicUrl,
        mimeType: file.mimetype,
        size: file.size,
        uploadedBy: dentistId,
        uploadedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({ 
      error: "Failed to upload file",
      details: error.message 
    });
  }
}
/**
 * Get signed URL for a file
 * GET /upload/signed-url/:filepath
 */
export async function getSignedUrl(req, res) {
  try {
    const dentistId = req.user?.id;
    if (!dentistId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Get filepath from regex capture group
    const filepath = req.params[0];
    
    if (!filepath) {
      return res.status(400).json({ error: "Filepath is required" });
    }

    const { expiresIn = 3600 } = req.query;

    // Verify user has access to this file
    if (!filepath.startsWith(dentistId)) {
      return res.status(403).json({ error: "Access denied" });
    }

    const { data, error } = await supabase.storage
      .from('chat-attachments')
      .createSignedUrl(filepath, parseInt(expiresIn));

    if (error) {
      console.error('❌ Error creating signed URL:', error);
      return res.status(500).json({ error: "Failed to generate signed URL" });
    }

    res.json({
      signedUrl: data.signedUrl,
      expiresAt: new Date(Date.now() + parseInt(expiresIn) * 1000).toISOString()
    });

  } catch (error) {
    console.error('❌ Signed URL error:', error);
    res.status(500).json({ error: "Failed to generate signed URL" });
  }
}

/**
 * Delete a file
 * DELETE /upload/:filepath
 */
export async function deleteFile(req, res) {
  try {
    const dentistId = req.user?.id;
    if (!dentistId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Get filepath from regex capture group
    const filepath = req.params[0];
    
    if (!filepath) {
      return res.status(400).json({ error: "Filepath is required" });
    }

    // Verify user has access to this file
    if (!filepath.startsWith(dentistId)) {
      return res.status(403).json({ error: "Access denied" });
    }

    const { data, error } = await supabase.storage
      .from('chat-attachments')
      .remove([filepath]);

    if (error) {
      console.error('❌ Error deleting file:', error);
      return res.status(500).json({ error: "Failed to delete file" });
    }

    console.log('🗑️ File deleted:', filepath);
    res.json({ success: true, message: "File deleted successfully" });

  } catch (error) {
    console.error('❌ Delete error:', error);
    res.status(500).json({ error: "Failed to delete file" });
  }
}