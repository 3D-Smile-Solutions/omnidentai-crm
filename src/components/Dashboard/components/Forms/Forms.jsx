// frontend/src/components/Dashboard/components/Forms/Forms.jsx
import React, { useState } from 'react';
import { Typography, Box, Paper } from '@mui/material';
import { Description as FormsIcon } from '@mui/icons-material';
import DocumentViewer from '../DocumentViewer/DocumentViewer';

const FormCard = ({ title, description, category, onUpload }) => {
  const [viewerOpen, setViewerOpen] = useState(false);

  return (
    <>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          position: 'relative',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fffe 100%)',
          border: '1px solid rgba(62, 228, 200, 0.2)',
          cursor: 'pointer',
          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          '&:hover': { 
            boxShadow: '0 6px 24px rgba(62, 228, 200, 0.2)',
            transform: 'translateY(-4px)',
            borderColor: '#3EE4C8'
          } 
        }}
        onClick={() => setViewerOpen(true)}
      >
        <FormsIcon sx={{ color: '#3EE4C8', fontSize: 40, mb: 2 }} />
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#0B1929', pr: 5 }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(11, 25, 41, 0.6)', mt: 1 }}>
          {description}
        </Typography>
      </Paper>

      <DocumentViewer
        open={viewerOpen}
        onClose={() => setViewerOpen(false)}
        category={category}
        title={title}
        documentType="form"
        onUpload={onUpload}
      />
    </>
  );
};

const Forms = () => {
  const formTypes = [
    { title: 'Patient Intake', description: 'New patient information form', category: 'patient_intake' },
    { title: 'Medical History', description: 'Comprehensive health questionnaire', category: 'medical_history' },
    { title: 'Consent Forms', description: 'Treatment consent documents', category: 'consent_forms' },
    { title: 'Insurance Forms', description: 'Insurance verification docs', category: 'insurance_forms' }
  ];

  const handleFormUpload = (document) => {
    console.log('New form uploaded:', document);
  };

  return (
    <>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        Digital Forms
      </Typography>
      <Typography paragraph color="text.secondary">
        Create, manage, and track digital forms for patient intake, consent, and medical history.
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 3, mt: 3 }}>
        {formTypes.map((form, index) => (
          <FormCard 
            key={index}
            title={form.title}
            description={form.description}
            category={form.category}
            onUpload={handleFormUpload}
          />
        ))}
      </Box>
    </>
  );
};

export default Forms;