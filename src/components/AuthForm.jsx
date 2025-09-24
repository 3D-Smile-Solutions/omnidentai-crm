// src/components/AuthForm.jsx
import React from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const AuthForm = ({
  title,
  fields,
  error,
  success,
  onSubmit,
  submitLabel,
  submitting,
  redirectText,
  redirectPath,
}) => {
  const navigate = useNavigate();

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            padding: 4,
            width: "100%",
            background: "linear-gradient(135deg, #ffffff 0%, #f8fffe 100%)",
            border: "2px solid rgba(62, 228, 200, 0.2)",
            boxShadow: "0 8px 32px rgba(11, 25, 41, 0.12)",
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: "#0B1929",
              mb: 3,
            }}
          >
            {title}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={onSubmit} sx={{ mt: 1 }}>
            {fields.map((field) => (
              <TextField
                key={field.name}
                margin="normal"
                required={field.required}
                fullWidth
                type={field.type || "text"}
                label={field.label}
                name={field.name}
                value={field.value}
                onChange={field.onChange}
              />
            ))}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={submitting}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                background: "linear-gradient(135deg, #3EE4C8 0%, #2BC4A8 100%)",
                color: "#0B1929",
                fontWeight: 600,
                fontSize: "1rem",
                boxShadow: "0 4px 15px rgba(62, 228, 200, 0.3)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #2BC4A8 0%, #22A890 100%)",
                  boxShadow: "0 6px 20px rgba(62, 228, 200, 0.4)",
                },
              }}
            >
              {submitting ? "Please wait..." : submitLabel}
            </Button>

            {redirectText && redirectPath && (
              <Box textAlign="center">
                <Link
                  component="button"
                  variant="body2"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(redirectPath);
                  }}
                  sx={{
                    color: "#3EE4C8",
                    textDecoration: "none",
                    fontWeight: 500,
                    "&:hover": {
                      color: "#2BC4A8",
                      textDecoration: "underline",
                    },
                  }}
                >
                  {redirectText}
                </Link>
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default AuthForm;
