import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signup } from "../redux/slices/authSlice";
import AuthForm from "./AuthForm";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [success, setSuccess] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      return;
    }

    try {
      const result = await dispatch(
        signup({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
        })
      ).unwrap();

      if (result.message) {
        setSuccess("Account created successfully! Redirecting...");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      console.error("Signup failed:", err);
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
          required: true,
        },
        {
          name: "lastName",
          label: "Last Name",
          value: formData.lastName,
          onChange: handleChange,
          required: true,
        },
        {
          name: "email",
          label: "Email Address",
          type: "email",
          value: formData.email,
          onChange: handleChange,
          required: true,
        },
        {
          name: "password",
          label: "Password",
          type: "password",
          value: formData.password,
          onChange: handleChange,
          required: true,
        },
        {
          name: "confirmPassword",
          label: "Confirm Password",
          type: "password",
          value: formData.confirmPassword,
          onChange: handleChange,
          required: true,
        },
      ]}
      error={error}
      success={success}
      onSubmit={handleSubmit}
      submitLabel="Sign Up"
      submitting={status === "loading"}
      redirectText="Already have an account? Sign In"
      redirectPath="/login"
    />
  );
};

export default Signup;
