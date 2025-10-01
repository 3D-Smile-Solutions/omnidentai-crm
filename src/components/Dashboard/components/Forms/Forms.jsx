// frontend/src/components/Dashboard/components/Forms/Forms.jsx
import React, { useState } from 'react';
import { Typography, Box, Paper, IconButton, Tooltip } from '@mui/material';
import { Description as FormsIcon, CloudUpload as UploadIcon } from '@mui/icons-material';
import GenericDocumentUploadModal from '../uploadModal/GenericDocumentUploadModal';

const FormCard = ({ title, description, category, onUpload }) => {
  const [uploadOpen, setUploadOpen] = useState(false);

  return (
    <>
      <Paper elevation={0} sx={{ 
        p: 3, 
        position: 'relative',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fffe 100%)',
        border: '1px solid rgba(62, 228, 200, 0.2)',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        '&:hover': { 
          boxShadow: '0 6px 24px rgba(62, 228, 200, 0.2)',
          transform: 'translateY(-4px)',
          borderColor: '#3EE4C8'
        } 
      }}>
        <Tooltip title="Upload Form">
          <IconButton
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'rgba(62, 228, 200, 0.1)',
              '&:hover': {
                backgroundColor: '#3EE4C8',
                color: '#fff'
              }
            }}
            onClick={() => setUploadOpen(true)}
          >
            <UploadIcon />
          </IconButton>
        </Tooltip>

        <FormsIcon sx={{ color: '#3EE4C8', fontSize: 40, mb: 2 }} />
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#0B1929', pr: 5 }}>{title}</Typography>
        <Typography variant="body2" sx={{ color: 'rgba(11, 25, 41, 0.6)', mt: 1 }}>{description}</Typography>
      </Paper>

      <GenericDocumentUploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUploadComplete={(doc) => {
          console.log('Form uploaded:', doc);
          if (onUpload) onUpload(doc);
        }}
        documentType="form"
        category={category}
        title={`Upload ${title}`}
        allowedTypes="documents"
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
    // Refresh forms list or show success message
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