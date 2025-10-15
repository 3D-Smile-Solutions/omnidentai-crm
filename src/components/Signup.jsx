// frontend/src/components/Signup.jsx - UPDATED

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "./AuthForm";
import { toast } from "react-toastify";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      console.log('📤 Sending signup request to n8n...');
      
      const response = await axios.post(
        'https://n8n.3dsmilesolutions.ai/webhook/client-form-submit',
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          source: 'dental_crm_signup',
          userType: 'dentist'
        },
        {
          timeout: 10000 // 10 second timeout
        }
      );

      console.log('✅ n8n response:', response.data);

      // ✅ CHECK if response indicates success
      if (response.data?.success || response.status === 200) {
        toast.success("Account created! Check your email to set password.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        throw new Error(response.data?.message || 'Signup failed');
      }

    } catch (err) {
      console.error('❌ Signup error:', err);
      
      let errorMessage = "Signup failed. Please try again.";
      
      if (err.response) {
        // n8n returned an error
        errorMessage = err.response.data?.error || err.response.data?.message || errorMessage;
      } else if (err.request) {
        // n8n didn't respond
        errorMessage = "Unable to reach signup service. Please try again later.";
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthForm
      title="Create Account"
      fields={[
        { 
          name: "firstName", 
          label: "First Name", 
          value: formData.firstName, 
          onChange: handleChange, 
          required: true 
        },
        { 
          name: "lastName", 
          label: "Last Name", 
          value: formData.lastName, 
          onChange: handleChange, 
          required: true 
        },
        { 
          name: "email", 
          label: "Email Address", 
          type: "email", 
          value: formData.email, 
          onChange: handleChange, 
          required: true 
        },
      ]}
      error={error}
      onSubmit={handleSubmit}
      submitLabel="Sign Up"
      submitting={submitting}
      redirectText="Already have an account? Sign In"
      redirectPath="/login"
    />
  );
};

export default Signup;