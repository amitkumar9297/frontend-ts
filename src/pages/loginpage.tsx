import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../services/auth.api";
import { setTokens, setUser } from "../store/reducers/authReducer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Paper, TextField, Typography } from "@mui/material";
import { useAppDispatch } from "../store/store";
import ForgotPassword from "../components/Auth/ForgotPassword";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [enableForgotPass, setEnableForgotPass] = useState(false);
  const dispatch = useAppDispatch();
  const [loginRequest, { isLoading, error }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleLogin = async (data) => {
    try {
      const response = await loginRequest(data).unwrap();
      dispatch(
        setTokens({
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        })
      );
      dispatch(
        setUser({
          id: response.data.user._id,
          name: response.data.user.name,
          email: response.data.user.email,
          role: response.data.user.role,
        })
      );
      toast.success("Login Successful");
    } catch (err) {
      console.error(err);
      toast.error("Login Failed");
    }
  };

  if (enableForgotPass) return <ForgotPassword />;
  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Paper
        elevation={6}
        sx={{
          maxWidth: 400,
          margin: "100px auto",
          padding: 4,
          borderRadius: 3,
          boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit(handleLogin)}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            variant="outlined"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            variant="outlined"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2, padding: 1.5, fontWeight: "bold" }}
            disabled={isLoading}
          >
            {isLoading ? "Logging In..." : "Login"}
          </Button>
        </form>
        <Typography variant="body2" sx={{ marginTop: 2 }} align="center">
          Don't have an account?{" "}
          <Button
            color="primary"
            onClick={() => navigate("/signup")}
            sx={{ textTransform: "none", fontWeight: "bold" }}
          >
            Sign Up
          </Button>
        </Typography>
        <Button
          color="error"
          onClick={() => setEnableForgotPass(true)}
          sx={{
            fontSize: "12px",
            display: "block",
            margin: "10px auto",
            textTransform: "none",
          }}
        >
          Forgot Password?
        </Button>
        {error && (
          <Typography
            color="error"
            variant="body2"
            sx={{ marginTop: 2, textAlign: "center" }}
          >
            {error?.data?.message || "Something went wrong"}
          </Typography>
        )}
      </Paper>
    </motion.div>
  );
};

export default Login;
