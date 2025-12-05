// src/components/CustomCheckbox.jsx
import React from 'react';
import { styled } from '@mui/material/styles';

const CheckboxContainer = styled('label')(({ isDarkMode }) => ({
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  userSelect: 'none',
  padding: '4px 8px',
  borderRadius: '6px',
  transition: 'background-color 0.2s ease',
  '&:hover': {
    backgroundColor: isDarkMode 
      ? 'rgba(100, 255, 218, 0.08)' 
      : 'rgba(62, 228, 200, 0.1)',
  },
  '& input': {
    display: 'none',
  },
  '& svg': {
    overflow: 'visible',
  },
  '& .path': {
    fill: 'none',
    stroke: isDarkMode ? '#64ffda' : '#3EE4C8',
    strokeWidth: 6,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    transition: 'stroke-dasharray 0.5s ease, stroke-dashoffset 0.5s ease',
    strokeDasharray: '241 9999999',
    strokeDashoffset: 0,
  },
  '& input:checked ~ svg .path': {
    strokeDasharray: '70.5096664428711 9999999',
    strokeDashoffset: '-262.2723388671875',
  },
}));

const CustomCheckbox = ({ checked, onChange, label, isDarkMode = false }) => {
  return (
    <CheckboxContainer isDarkMode={isDarkMode}>
      <input 
        type="checkbox" 
        checked={checked}
        onChange={onChange}
      />
      <svg viewBox="0 0 64 64" height="1.5em" width="1.5em">
        <path 
          d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16" 
          pathLength="575.0541381835938" 
          className="path"
        />
      </svg>
      {label && (
        <span style={{ 
          marginLeft: '8px', 
          fontSize: '0.875rem',
          color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : '#0B1929',
          fontWeight: 500,
          transition: 'color 0.2s ease',
        }}>
          {label}
        </span>
      )}
    </CheckboxContainer>
  );
};

export default CustomCheckbox;