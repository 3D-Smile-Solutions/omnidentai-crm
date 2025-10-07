import React from 'react';
import { Box } from '@mui/material';
import { useTheme } from '../../context/ThemeContext';
import LightRays from '../Effects/LightRays';
import GradientBlinds from '../Effects/GradientBlinds';
import Threads from '../Effects/Threads';
import Orb from '../Effects/Orb';

const BackgroundWrapper = ({ children }) => {
  const { backgroundTheme, isDarkMode } = useTheme();

  const renderBackground = () => {
    switch (backgroundTheme) {
      case 'lightRays':
        return (
          <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
            <LightRays
              raysOrigin="top-center"
              raysColor={isDarkMode ? '#00ffff' : '#3EE4C8'}
              raysSpeed={1.5}
              lightSpread={0.8}
              rayLength={1.2}
              followMouse={true}
              mouseInfluence={0.1}
              noiseAmount={0.1}
              distortion={0.05}
            />
          </Box>
        );
      case 'gradientBlinds':
        return (
          <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
            <GradientBlinds
              gradientColors={isDarkMode ? ['#FF9FFC', '#5227FF'] : ['#3EE4C8', '#0B1929']}
              angle={0}
              noise={0.3}
              blindCount={12}
              blindMinWidth={50}
              spotlightRadius={0.5}
              spotlightSoftness={1}
              spotlightOpacity={1}
              mouseDampening={0.15}
              distortAmount={0}
              shineDirection="left"
              mixBlendMode="lighten"
            />
          </Box>
        );
      case 'threads':
        return (
          <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
            <Threads
              color={isDarkMode ? [1, 1, 1] : [0.043, 0.098, 0.16]}
              amplitude={1}
              distance={0}
              enableMouseInteraction={true}
            />
          </Box>
        );
      case 'orb':
        return (
          <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
            <Orb
              hoverIntensity={0.5}
              rotateOnHover={true}
              hue={isDarkMode ? 280 : 170}
              forceHoverState={false}
            />
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      {renderBackground()}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {children}
      </Box>
    </Box>
  );
};

export default BackgroundWrapper;