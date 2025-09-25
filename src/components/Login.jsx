import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../redux/slices/authSlice";
import AuthForm from "./AuthForm";
import { toast } from "react-toastify";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loginStatus, error, user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  useEffect(() => {
    if (loginStatus === "succeeded" && user) {
      toast.success("Login successful!");
      navigate("/dashboard");
    }
    if (loginStatus === "failed" && error) {
      toast.error(error);
    }
  }, [loginStatus, error, user, navigate]);

  return (
    <AuthForm
      title="Sign In"
      fields={[
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
      ]}
      error={error}
      onSubmit={handleSubmit}
      submitLabel="Sign In"
      submitting={loginStatus === "loading"}
      redirectText="Don't have an account? Sign Up"
      redirectPath="/signup"
    />
  );
};

export default Login;
