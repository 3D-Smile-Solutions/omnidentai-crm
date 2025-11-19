// frontend/src/redux/slices/uploadsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://omnidentai-crm.onrender.com';

/**
 * Upload any document (chat, form, report)
 */
export const uploadDocument = createAsyncThunk(
  'uploads/uploadDocument',
  async (uploadData, { rejectWithValue }) => {
    try {
      const { file, documentType, category, patientId, description, onProgress } = uploadData;
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', documentType);
      formData.append('category', category);
      if (description) formData.append('description', description);
      if (patientId) formData.append('patientId', patientId);

      //  FIX: Use withCredentials for cookie-based auth
      const response = await axios.post(
        `${API_URL}/practice-documents/upload`,
        formData,
        {
          withCredentials: true, //  This sends cookies automatically
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            if (onProgress) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              onProgress(percentCompleted);
            }
          }
        }
      );

      return response.data.document;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || error.message || 'Upload failed'
      );
    }
  }
);

/**
 * Fetch documents by filters
 */
export const fetchDocuments = createAsyncThunk(
  'uploads/fetchDocuments',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const { type, category, patientId } = filters;

      const params = new URLSearchParams();
      if (type) params.append('type', type);
      if (category) params.append('category', category);
      if (patientId) params.append('patientId', patientId);

      //  FIX: Use withCredentials for cookie-based auth
      const response = await axios.get(
        `${API_URL}/practice-documents?${params.toString()}`,
        {
          withCredentials: true //  This sends cookies automatically
        }
      );

      return { filters, documents: response.data.documents };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || error.message || 'Failed to fetch documents'
      );
    }
  }
);

/**
 * Delete document
 */
export const deleteDocument = createAsyncThunk(
  'uploads/deleteDocument',
  async (documentId, { rejectWithValue }) => {
    try {
      //  FIX: Use withCredentials for cookie-based auth
      await axios.delete(
        `${API_URL}/practice-documents/${documentId}`,
        {
          withCredentials: true //  This sends cookies automatically
        }
      );

      return documentId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || error.message || 'Failed to delete document'
      );
    }
  }
);

const uploadsSlice = createSlice({
  name: 'uploads',
  initialState: {
    documentsByFilter: {},
    uploading: false,
    uploadProgress: 0,
    uploadError: null,
    loading: false,
    error: null
  },
  reducers: {
    clearUploadError: (state) => {
      state.uploadError = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetUploadState: (state) => {
      state.uploading = false;
      state.uploadProgress = 0;
      state.uploadError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadDocument.pending, (state) => {
        state.uploading = true;
        state.uploadError = null;
        state.uploadProgress = 0;
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.uploading = false;
        state.uploadProgress = 100;
        const doc = action.payload;
        const filterKey = `${doc.document_type}-${doc.category}`;
        if (state.documentsByFilter[filterKey]) {
          state.documentsByFilter[filterKey].unshift(doc);
        }
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.uploading = false;
        state.uploadProgress = 0;
        state.uploadError = action.payload;
      })
      .addCase(fetchDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.loading = false;
        const { filters, documents } = action.payload;
        const filterKey = `${filters.type || 'all'}-${filters.category || 'all'}`;
        state.documentsByFilter[filterKey] = documents;
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteDocument.fulfilled, (state, action) => {
        const documentId = action.payload;
        Object.keys(state.documentsByFilter).forEach(filterKey => {
          state.documentsByFilter[filterKey] = state.documentsByFilter[filterKey].filter(
            doc => doc.id !== documentId
          );
        });
      });
  }
});

export const { clearUploadError, clearError, resetUploadState } = uploadsSlice.actions;
export default uploadsSlice.reducer;