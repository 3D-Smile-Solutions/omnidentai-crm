// src/components/GoogleMapComponent.jsx
import React, { useEffect, useRef, useCallback } from 'react';
import { Box, Paper, Typography, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPatientMapData } from '../redux/slices/mapSlice';

// Global flag to track script loading
let isScriptLoading = false;
let isScriptLoaded = false;

const GoogleMapComponent = ({ isMobile }) => {
  const dispatch = useDispatch();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  
  // ✅ Get map data from Redux store
  const { 
    locations, 
    procedureSummary, 
    totalPatients, 
    totalStates, 
    center, 
    zoom, 
    loading, 
    error 
  } = useSelector((state) => state.map);
  
  // Google Maps API key from environment variable
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  // ✅ Fetch data on component mount
  useEffect(() => {
    console.log('🗺️ GoogleMapComponent mounted - fetching data');
    dispatch(fetchPatientMapData());
  }, [dispatch]);

  // ✅ Helper function to get procedure colors
  const getProcedureColor = useCallback((procedure) => {
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
  }, []);

  // ✅ Initialize map once data is loaded
  const initializeMap = useCallback(async () => {
    try {
      if (!mapContainerRef.current || mapInstanceRef.current) {
        return;
      }

      // Check if API key is configured
      if (!API_KEY) {
        console.error('❌ Google Maps API key not configured');
        return;
      }

      // Wait for map data to be loaded
      if (!locations || locations.length === 0) {
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

      // Create the map with center from backend
      const map = new Map(mapContainerRef.current, {
        center: center,
        zoom: isMobile ? zoom - 1 : zoom,
        mapId: 'DEMO_MAP_ID',
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: !isMobile,
      });

      mapInstanceRef.current = map;

      // ✅ Add markers from backend data
      locations.forEach((location) => {
        const pinElement = new PinElement({
          background: getProcedureColor(location.top_procedure),
          borderColor: '#FFFFFF',
          glyphColor: '#FFFFFF',
          glyph: location.patient_count.toString(),
          scale: isMobile ? 0.85 : 1.0
        });

        const marker = new AdvancedMarkerElement({
          map: map,
          position: { lat: location.lat, lng: location.lng },
          title: `${location.city}, ${location.state} - ${location.zip_code}`,
          content: pinElement.element,
        });

        // Create info window
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 10px; min-width: 180px;">
              <h4 style="margin: 0 0 8px 0; color: #0B1929;">
                ${location.city}, ${location.state}
              </h4>
              <p style="margin: 4px 0; color: #333; font-weight: 600;">
                ZIP: ${location.zip_code}
              </p>
              <p style="margin: 4px 0; color: #666;">
                Top Procedure: ${location.top_procedure}
              </p>
              <p style="margin: 4px 0; color: #666;">
                Patients: ${location.patient_count}
              </p>
            </div>
          `
        });

        // Hover listeners
        marker.element.addEventListener('mouseenter', () => {
          infoWindow.open(map, marker);
        });

        marker.element.addEventListener('mouseleave', () => {
          infoWindow.close();
        });

        // Click for mobile
        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });
      });

      console.log('✅ Map initialized with', locations.length, 'markers');
    } catch (error) {
      console.error('❌ Error initializing map:', error);
    }
  }, [locations, center, zoom, isMobile, API_KEY, getProcedureColor]);

  // ✅ Load Google Maps script
  const loadGoogleMapsScript = useCallback(() => {
    if (!API_KEY) {
      console.error('❌ Google Maps API key not configured');
      return;
    }

    if (isScriptLoaded) {
      initializeMap();
      return;
    }

    if (isScriptLoading) {
      const checkInterval = setInterval(() => {
        if (window.google?.maps) {
          clearInterval(checkInterval);
          isScriptLoaded = true;
          initializeMap();
        }
      }, 100);
      return;
    }

    if (window.google?.maps) {
      isScriptLoaded = true;
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
      setTimeout(() => initializeMap(), 100);
    };
    
    script.onerror = () => {
      console.error('❌ Failed to load Google Maps');
      isScriptLoading = false;
    };
    
    document.head.appendChild(script);
  }, [initializeMap, API_KEY]);

  // ✅ Load script when data is ready
  useEffect(() => {
    if (!loading && locations && locations.length > 0) {
      loadGoogleMapsScript();
    }
  }, [loadGoogleMapsScript, loading, locations]);

  // ✅ Cleanup on unmount
  useEffect(() => {
    return () => {
      mapInstanceRef.current = null;
    };
  }, []);

  // ✅ Show loading spinner
  if (loading) {
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

  // ✅ Show error message
  if (error) {
    return (
      <Paper elevation={0} sx={{ 
        p: 3,
        mt: 3,
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fffe 100%)',
        border: '1px solid rgba(62, 228, 200, 0.2)',
        textAlign: 'center'
      }}>
        <Typography variant="h6" color="error" sx={{ mb: 1 }}>
          {error}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please check your configuration and try again
        </Typography>
      </Paper>
    );
  }

  // ✅ Show empty state
  if (!locations || locations.length === 0) {
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

  // ✅ Render map
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
        Hover over markers to see patient details
      </Typography>
      
      {/* ✅ Dynamic legend from backend data */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        {procedureSummary.map((proc) => (
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

      {/* Map container */}
      <Box 
        sx={{ 
          width: '100%', 
          height: isMobile ? 300 : 400,
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid rgba(62, 228, 200, 0.2)',
          bgcolor: '#f0f0f0',
        }} 
      >
        <Box
          ref={mapContainerRef}
          sx={{
            width: '100%',
            height: '100%',
          }}
        />
      </Box>

      {/* ✅ Summary stats from backend */}
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
            {totalStates}
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
            {totalPatients.toLocaleString()}
          </Typography>
          <Typography variant="caption" component="div" sx={{ color: '#3EE4C8' }}>
            Nationwide
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" component="div" sx={{ color: 'rgba(11, 25, 41, 0.6)' }}>
            Locations
          </Typography>
          <Typography variant="h6" sx={{ color: '#0B1929', fontWeight: 600 }}>
            {locations.length}
          </Typography>
          <Typography variant="caption" component="div" sx={{ color: '#3EE4C8' }}>
            Clustered markers
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default GoogleMapComponent;