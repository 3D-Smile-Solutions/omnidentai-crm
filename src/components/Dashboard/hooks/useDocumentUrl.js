// frontend/src/hooks/useDocumentUrl.js
import { useState, useCallback } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

/**
 * Hook to refresh a single document's URL
 * Returns a function to refresh the URL when image fails to load
 */
export const useRefreshDocumentUrl = () => {
  const [refreshing, setRefreshing] = useState({});

  const refreshUrl = useCallback(async (documentId) => {
    if (refreshing[documentId]) return null; // Prevent multiple refreshes
    
    setRefreshing(prev => ({ ...prev, [documentId]: true }));
    
    try {
      const response = await axios.get(
        `${API_URL}/practice-documents/${documentId}`,
        { withCredentials: true }
      );

      setRefreshing(prev => ({ ...prev, [documentId]: false }));
      return response.data.document.url;
    } catch (error) {
      console.error('Failed to refresh document URL:', error);
      setRefreshing(prev => ({ ...prev, [documentId]: false }));
      return null;
    }
  }, [refreshing]);

  return { refreshUrl, refreshing };
};

export default useRefreshDocumentUrl;