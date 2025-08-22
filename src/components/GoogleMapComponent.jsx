import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Box, Paper, Typography, CircularProgress } from '@mui/material';

// Global flag to track script loading
let isScriptLoading = false;
let isScriptLoaded = false;

const GoogleMapComponent = ({ isMobile }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState(null);
  
  // Google Maps API key from environment variable
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  // Sample patient locations across US states with zipcodes
  const locations = [
    // California
    { 
      position: { lat: 34.0522, lng: -118.2437 }, 
      title: 'Los Angeles',
      state: 'CA',
      zipcode: '90012',
      patients: 145,
      type: 'Cleanings',
      color: '#3EE4C8'
    },
    { 
      position: { lat: 37.7749, lng: -122.4194 }, 
      title: 'San Francisco',
      state: 'CA',
      zipcode: '94102',
      patients: 98,
      type: 'Implants',
      color: '#9C27B0'
    },
    // New York
    { 
      position: { lat: 40.7128, lng: -74.0060 }, 
      title: 'New York City',
      state: 'NY',
      zipcode: '10001',
      patients: 225,
      type: 'Cleanings',
      color: '#3EE4C8'
    },
    { 
      position: { lat: 42.8864, lng: -78.8784 }, 
      title: 'Buffalo',
      state: 'NY',
      zipcode: '14201',
      patients: 67,
      type: 'Crowns',
      color: '#FFA726'
    },
    // Texas
    { 
      position: { lat: 29.7604, lng: -95.3698 }, 
      title: 'Houston',
      state: 'TX',
      zipcode: '77002',
      patients: 189,
      type: 'Fillings',
      color: '#45B7D1'
    },
    { 
      position: { lat: 32.7767, lng: -96.7970 }, 
      title: 'Dallas',
      state: 'TX',
      zipcode: '75201',
      patients: 156,
      type: 'Root Canals',
      color: '#FF7043'
    },
    // Florida
    { 
      position: { lat: 25.7617, lng: -80.1918 }, 
      title: 'Miami',
      state: 'FL',
      zipcode: '33101',
      patients: 134,
      type: 'Cleanings',
      color: '#3EE4C8'
    },
    { 
      position: { lat: 28.5383, lng: -81.3792 }, 
      title: 'Orlando',
      state: 'FL',
      zipcode: '32801',
      patients: 92,
      type: 'Crowns',
      color: '#FFA726'
    },
    // Illinois
    { 
      position: { lat: 41.8781, lng: -87.6298 }, 
      title: 'Chicago',
      state: 'IL',
      zipcode: '60601',
      patients: 178,
      type: 'Implants',
      color: '#9C27B0'
    },
    // Washington
    { 
      position: { lat: 47.6062, lng: -122.3321 }, 
      title: 'Seattle',
      state: 'WA',
      zipcode: '98101',
      patients: 112,
      type: 'Fillings',
      color: '#45B7D1'
    },
    // Arizona
    { 
      position: { lat: 33.4484, lng: -112.0740 }, 
      title: 'Phoenix',
      state: 'AZ',
      zipcode: '85001',
      patients: 145,
      type: 'Root Canals',
      color: '#FF7043'
    },
    // Colorado
    { 
      position: { lat: 39.7392, lng: -104.9903 }, 
      title: 'Denver',
      state: 'CO',
      zipcode: '80202',
      patients: 87,
      type: 'Cleanings',
      color: '#3EE4C8'
    },
    // Georgia
    { 
      position: { lat: 33.7490, lng: -84.3880 }, 
      title: 'Atlanta',
      state: 'GA',
      zipcode: '30303',
      patients: 167,
      type: 'Crowns',
      color: '#FFA726'
    },
    // Massachusetts
    { 
      position: { lat: 42.3601, lng: -71.0589 }, 
      title: 'Boston',
      state: 'MA',
      zipcode: '02108',
      patients: 103,
      type: 'Implants',
      color: '#9C27B0'
    },
    // Nevada
    { 
      position: { lat: 36.1699, lng: -115.1398 }, 
      title: 'Las Vegas',
      state: 'NV',
      zipcode: '89101',
      patients: 121,
      type: 'Fillings',
      color: '#45B7D1'
    }
  ];

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

      // Create the map - centered on US
      const map = new Map(mapContainerRef.current, {
        center: { lat: 39.8283, lng: -98.5795 }, // Center of US
        zoom: isMobile ? 2.8 : 3.7, // Zoom out to see entire US
        mapId: 'DEMO_MAP_ID', // Required for Advanced Markers
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: !isMobile,
      });

      mapInstanceRef.current = map;

      // Add markers to the map
      locations.forEach((location) => {
        // Create a pin element with custom color
        const pinElement = new PinElement({
          background: location.color,
          borderColor: '#FFFFFF',
          glyphColor: '#FFFFFF',
          glyph: location.patients.toString(),
          scale: isMobile ? 0.85 : 1.0
        });

        // Create the advanced marker
        const marker = new AdvancedMarkerElement({
          map: map,
          position: location.position,
          title: `${location.title}, ${location.state} - ${location.zipcode}`,
          content: pinElement.element,
        });

        // Create info window for this marker
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 10px; min-width: 180px;">
              <h4 style="margin: 0 0 8px 0; color: #0B1929;">${location.title}, ${location.state}</h4>
              <p style="margin: 4px 0; color: #333; font-weight: 600;">ZIP: ${location.zipcode}</p>
              <p style="margin: 4px 0; color: #666;">Procedure: ${location.type}</p>
              <p style="margin: 4px 0; color: #666;">Patients: ${location.patients}</p>
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
  }, [isMobile]);

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
    loadGoogleMapsScript();
  }, [loadGoogleMapsScript]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mapInstanceRef.current = null;
    };
  }, []);

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
      
      {/* Legend */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#3EE4C8' }} />
          <Typography variant="caption" component="span">Cleanings</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#45B7D1' }} />
          <Typography variant="caption" component="span">Fillings</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#FFA726' }} />
          <Typography variant="caption" component="span">Crowns</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#FF7043' }} />
          <Typography variant="caption" component="span">Root Canals</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#9C27B0' }} />
          <Typography variant="caption" component="span">Implants</Typography>
        </Box>
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
            textAlign: 'center'
          }}>
            <Typography variant="body2" color="error">
              {mapError}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Summary Stats */}
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
            12
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
            1,897
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
            15 locations
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default GoogleMapComponent;