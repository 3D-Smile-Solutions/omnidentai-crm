import React from 'react';
import { styled } from '@mui/material/styles';

const CheckboxContainer = styled('label')({
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  userSelect: 'none',
  '& input': {
    display: 'none',
  },
  '& svg': {
    overflow: 'visible',
  },
  '& .path': {
    fill: 'none',
    stroke: '#3EE4C8',
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
});

const CustomCheckbox = ({ checked, onChange, label }) => {
  return (
    <CheckboxContainer>
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
          color: '#0B1929',
          fontWeight: 500
        }}>
          {label}
        </span>
      )}
    </CheckboxContainer>
  );
};

export default CustomCheckbox;