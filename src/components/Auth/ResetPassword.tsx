import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Alert,
  Card,
  CardContent,
} from "@mui/material";
import { useResetPasswordMutation } from "../../services/auth.api";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion } from "framer-motion";

// Validation Schema
const schema = yup.object().shape({
  newPassword: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password is required"),
});

const ResetPassword: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  // Extract the token from query params
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const email = queryParams.get("email");

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing token");
    }
  }, [token]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Handle form submission
  const onSubmit = async (data: {
    newPassword: string;
    confirmPassword: string;
  }) => {
    if (!token) {
      setError("newPassword", { message: "Token is missing" });
      return;
    }

    try {
      const response = await resetPassword({
        token,
        newPassword: data.newPassword,
        email,
      }).unwrap();
      if (response.message === "Password updated successfully") {
        navigate("/login"); // Redirect to login page on success
      } else {
        setError("newPassword", { message: "Password reset failed" });
      }
    } catch (error) {
      setError("newPassword", {
        message: "An error occurred while resetting the password",
      });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 8,
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Card sx={{ boxShadow: 6, borderRadius: 3, padding: 2 }}>
            <CardContent>
              <Typography variant="h5" align="center" gutterBottom>
                Reset Password
              </Typography>
              {errors.newPassword && (
                <Alert severity="error">{errors.newPassword.message}</Alert>
              )}
              <form
                onSubmit={handleSubmit(onSubmit)}
                style={{ width: "100%", marginTop: "16px" }}
              >
                <TextField
                  label="New Password"
                  variant="outlined"
                  type="password"
                  fullWidth
                  margin="normal"
                  {...register("newPassword")}
                  error={!!errors.newPassword}
                  helperText={errors.newPassword?.message}
                />
                <TextField
                  label="Confirm Password"
                  variant="outlined"
                  type="password"
                  fullWidth
                  margin="normal"
                  {...register("confirmPassword")}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ marginTop: 2 }}
                  disabled={isLoading}
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </Box>
    </Container>
  );
};

export default ResetPassword;
