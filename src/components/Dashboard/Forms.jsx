import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import FormsIcon from '@mui/icons-material/Description';

const formItems = [
  { title: 'Patient Intake', desc: 'New patient information form' },
  { title: 'Medical History', desc: 'Comprehensive health questionnaire' },
  { title: 'Consent Forms', desc: 'Treatment consent documents' },
  { title: 'Insurance Forms', desc: 'Insurance verification docs' },
];

const DashboardForms = () => (
  <>
    <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>Digital Forms</Typography>
    <Typography paragraph color="text.secondary">Create, manage, and track digital forms for patient intake, consent, and medical history.</Typography>
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 3, mt: 3 }}>
      {formItems.map(item => (
        <Paper key={item.title} elevation={0} sx={{ p: 3, cursor: 'pointer', background: 'linear-gradient(135deg, #ffffff 0%, #f8fffe 100%)', border: '1px solid rgba(62, 228, 200, 0.2)', transition: 'transform 0.15s ease, box-shadow 0.15s ease', '&:hover': { boxShadow: '0 6px 24px rgba(62, 228, 200, 0.2)', transform: 'translateY(-4px)', borderColor: '#3EE4C8' } }}>
          <FormsIcon sx={{ color: '#3EE4C8', fontSize: 40, mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#0B1929' }}>{item.title}</Typography>
          <Typography variant="body2" sx={{ color: 'rgba(11, 25, 41, 0.6)', mt: 1 }}>{item.desc}</Typography>
        </Paper>
      ))}
    </Box>
  </>
);

export default DashboardForms;
