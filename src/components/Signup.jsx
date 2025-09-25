import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signup } from "../redux/slices/authSlice";
import AuthForm from "./AuthForm";
import { toast } from "react-toastify";

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

  useEffect(() => {
    if (status === "succeeded") {
      toast.success("Account created! Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    }
    if (status === "failed" && error) {
      toast.error(error);
    }
  }, [status, error, navigate]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    dispatch(
      signup({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      })
    );
  };

  return (
    <AuthForm
      title="Create Account"
      fields={[
        { name: "firstName", label: "First Name", value: formData.firstName, onChange: handleChange, required: true },
        { name: "lastName", label: "Last Name", value: formData.lastName, onChange: handleChange, required: true },
        { name: "email", label: "Email Address", type: "email", value: formData.email, onChange: handleChange, required: true },
        { name: "password", label: "Password", type: "password", value: formData.password, onChange: handleChange, required: true },
        { name: "confirmPassword", label: "Confirm Password", type: "password", value: formData.confirmPassword, onChange: handleChange, required: true },
      ]}
      error={error}
      onSubmit={handleSubmit}
      submitLabel="Sign Up"
      submitting={status === "loading"}
      redirectText="Already have an account? Sign In"
      redirectPath="/login"
    />
  );
};

export default Signup;
