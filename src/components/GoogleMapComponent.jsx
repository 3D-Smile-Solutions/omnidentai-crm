import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Box, Paper, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

// Global flag to track script loading
let isScriptLoading = false;
let isScriptLoaded = false;

const GoogleMapComponent = ({ isMobile }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState(null);
  const [mapData, setMapData] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  
  // Google Maps API key from environment variable
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  // ✅ FETCH REAL DATA FROM BACKEND
  useEffect(() => {
    fetchMapData();
  }, []);

  const fetchMapData = async () => {
    try {
      setDataLoading(true);
      console.log('🗺️ Fetching patient map data...');
      
      const response = await axios.get(`${API_URL}/api/metrics/patient-map`, {
        withCredentials: true
      });

      console.log('✅ Map data received:', response.data);
      setMapData(response.data);
      setDataLoading(false);
    } catch (err) {
      console.error('❌ Error fetching map data:', err);
      setMapError(err.response?.data?.error || 'Failed to load map data');
      setDataLoading(false);
    }
  };

  const initializeMap = useCallback(async () => {
    try {
      if (!mapContainerRef.current || mapInstanceRef.current) {
        return;
      }

      // Check if API key is configured
      if (!API_KEY) {
        setMapError('Google Maps API key not configured');
        setIsLoading(false);
        return;
      }

      // Wait for map data to be loaded
      if (!mapData) {
        return;
      }

      // Wait for Google Maps to be available
      if (!window.google?.maps) {
        return;
      }

      // Wait for importLibrary to be available
      if (!window.google.maps.importLibrary) {
        setTimeout(() => initializeMap(), 100);
        return;
      }

      // Import required libraries
      const { Map } = await google.maps.importLibrary("maps");
      const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");

      // ✅ Use center from backend data or default to US center
      const mapCenter = mapData.center || { lat: 39.8283, lng: -98.5795 };
      const mapZoom = mapData.zoom || (isMobile ? 2.8 : 3.7);

      // Create the map
      const map = new Map(mapContainerRef.current, {
        center: mapCenter,
        zoom: mapZoom,
        mapId: 'DEMO_MAP_ID', // Required for Advanced Markers
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: !isMobile,
      });

      mapInstanceRef.current = map;

      // ✅ Add markers from REAL backend data
      mapData.locations.forEach((location) => {
        // Create a pin element with custom color
        const pinElement = new PinElement({
          background: getProcedureColor(location.top_procedure),
          borderColor: '#FFFFFF',
          glyphColor: '#FFFFFF',
          glyph: location.patient_count.toString(),
          scale: isMobile ? 0.85 : 1.0
        });

        // Create the advanced marker
        const marker = new AdvancedMarkerElement({
          map: map,
          position: { lat: location.lat, lng: location.lng },
          title: `${location.city || 'Location'}, ${location.state || ''} - ${location.zip_code}`,
          content: pinElement.element,
        });

        // Create info window for this marker
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 10px; min-width: 180px;">
              <h4 style="margin: 0 0 8px 0; color: #0B1929;">
                ${location.city || 'Location'}, ${location.state || ''}
              </h4>
              <p style="margin: 4px 0; color: #333; font-weight: 600;">ZIP: ${location.zip_code}</p>
              <p style="margin: 4px 0; color: #666;">Top Procedure: ${location.top_procedure}</p>
              <p style="margin: 4px 0; color: #666;">Patients: ${location.patient_count}</p>
            </div>
          `
        });

        // Add hover listeners for info window
        marker.element.addEventListener('mouseenter', () => {
          infoWindow.open(map, marker);
        });

        marker.element.addEventListener('mouseleave', () => {
          infoWindow.close();
        });

        // Keep click functionality for mobile/touch devices
        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });
      });

      setIsLoading(false);
    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError(error.message);
      setIsLoading(false);
    }
  }, [isMobile, mapData]);

  // ✅ Helper function to get procedure colors
  const getProcedureColor = (procedure) => {
    const colorMap = {
      'Cleanings': '#3EE4C8',
      'Fillings': '#45B7D1',
      'Crowns': '#FFA726',
      'Root Canals': '#FF7043',
      'Implants': '#9C27B0',
      'Whitening': '#34d399',
      'Orthodontics': '#f472b6',
      'Extractions': '#fb923c',
      'Dentures': '#94a3b8',
      'Other': '#64748b'
    };
    return colorMap[procedure] || '#64748b';
  };

  const loadGoogleMapsScript = useCallback(() => {
    // Check if API key is configured
    if (!API_KEY) {
      setMapError('Google Maps API key not configured. Please set VITE_GOOGLE_MAPS_API_KEY in environment variables.');
      setIsLoading(false);
      return;
    }

    // Check if script is already loaded or loading
    if (isScriptLoaded) {
      initializeMap();
      return;
    }

    if (isScriptLoading) {
      // Wait for script to load
      const checkInterval = setInterval(() => {
        if (window.google?.maps) {
          clearInterval(checkInterval);
          isScriptLoaded = true;
          initializeMap();
        }
      }, 100);
      return;
    }

    // Check if Google Maps is already available
    if (window.google?.maps) {
      isScriptLoaded = true;
      // Give the API a moment to ensure importLibrary is ready
      setTimeout(() => initializeMap(), 100);
      return;
    }

    // Load the script
    isScriptLoading = true;
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=maps,marker&v=beta&loading=async`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      isScriptLoaded = true;
      isScriptLoading = false;
      // Give the API a moment to fully initialize
      setTimeout(() => initializeMap(), 100);
    };
    
    script.onerror = () => {
      setMapError('Failed to load Google Maps');
      setIsLoading(false);
      isScriptLoading = false;
    };
    
    document.head.appendChild(script);
  }, [initializeMap]);

  useEffect(() => {
    if (mapData && !dataLoading) {
      loadGoogleMapsScript();
    }
  }, [loadGoogleMapsScript, mapData, dataLoading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mapInstanceRef.current = null;
    };
  }, []);

  // Show loading while fetching data
  if (dataLoading) {
    return (
      <Paper elevation={0} sx={{ 
        p: 3,
        mt: 3,
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fffe 100%)',
        border: '1px solid rgba(62, 228, 200, 0.2)'
      }}>
        <Box sx={{ 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 400
        }}>
          <CircularProgress sx={{ color: '#3EE4C8' }} />
        </Box>
      </Paper>
    );
  }

  // Show message if no data
  if (!mapData || mapData.locations.length === 0) {
    return (
      <Paper elevation={0} sx={{ 
        p: 3,
        mt: 3,
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fffe 100%)',
        border: '1px solid rgba(62, 228, 200, 0.2)',
        textAlign: 'center'
      }}>
        <Typography variant="h6" sx={{ mb: 1, color: 'rgba(11, 25, 41, 0.4)' }}>
          No Patient Location Data
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(11, 25, 41, 0.3)' }}>
          Patient locations will appear here once latitude/longitude data is available
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={0} sx={{ 
      p: 3,
      mt: 3,
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fffe 100%)',
      border: '1px solid rgba(62, 228, 200, 0.2)'
    }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#0B1929' }}>
        Patient Distribution Map
      </Typography>
      
      <Typography variant="caption" sx={{ color: 'rgba(11, 25, 41, 0.6)', display: 'block', mb: 2 }}>
        Click on markers to see patient details
      </Typography>
      
      {/* ✅ DYNAMIC Legend from real data */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        {mapData.procedure_summary.map((proc) => (
          <Box key={proc.procedure} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ 
              width: 12, 
              height: 12, 
              borderRadius: '50%', 
              bgcolor: getProcedureColor(proc.procedure) 
            }} />
            <Typography variant="caption" component="span">
              {proc.procedure} ({proc.count})
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Map Container */}
      <Box 
        sx={{ 
          width: '100%', 
          height: isMobile ? 300 : 400,
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid rgba(62, 228, 200, 0.2)',
          bgcolor: '#f0f0f0',
          position: 'relative'
        }} 
      >
        <Box
          ref={mapContainerRef}
          sx={{
            width: '100%',
            height: '100%',
            display: isLoading ? 'none' : 'block'
          }}
        />
        
        {isLoading && !mapError && (
          <Box sx={{ 
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2
          }}>
            <CircularProgress sx={{ color: '#3EE4C8' }} />
            <Typography variant="body2" color="text.secondary">
              Loading map...
            </Typography>
          </Box>
        )}
        
        {mapError && (
          <Box sx={{ 
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            p: 2
          }}>
            <Typography variant="body2" color="error" sx={{ mb: 1 }}>
              {mapError}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Make sure VITE_GOOGLE_MAPS_API_KEY is set in your .env file
            </Typography>
          </Box>
        )}
      </Box>

      {/* ✅ DYNAMIC Summary Stats from real data */}
      <Box sx={{ 
        mt: 3, 
        p: 2, 
        bgcolor: 'rgba(62, 228, 200, 0.05)',
        borderRadius: 2,
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
        gap: 2
      }}>
        <Box>
          <Typography variant="caption" component="div" sx={{ color: 'rgba(11, 25, 41, 0.6)' }}>
            Total States
          </Typography>
          <Typography variant="h6" sx={{ color: '#0B1929', fontWeight: 600 }}>
            {mapData.total_states}
          </Typography>
          <Typography variant="caption" component="div" sx={{ color: '#3EE4C8' }}>
            Active states
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" component="div" sx={{ color: 'rgba(11, 25, 41, 0.6)' }}>
            Total Patients
          </Typography>
          <Typography variant="h6" sx={{ color: '#0B1929', fontWeight: 600 }}>
            {mapData.total_patients.toLocaleString()}
          </Typography>
          <Typography variant="caption" component="div" sx={{ color: '#3EE4C8' }}>
            Nationwide
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" component="div" sx={{ color: 'rgba(11, 25, 41, 0.6)' }}>
            Coverage
          </Typography>
          <Typography variant="h6" sx={{ color: '#0B1929', fontWeight: 600 }}>
            United States
          </Typography>
          <Typography variant="caption" component="div" sx={{ color: '#3EE4C8' }}>
            {mapData.locations.length} locations
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default GoogleMapComponent;