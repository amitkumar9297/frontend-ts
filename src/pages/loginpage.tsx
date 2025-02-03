import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"
import { useLoginMutation } from "../services/auth.api";
import { setTokens, setUser } from "../store/reducers/authReducer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useAppDispatch } from "../store/store";
import ForgotPassword from "../components/Auth/ForgotPassword";

const Login = () => {
  const navigate=useNavigate();
  const [enableForgotPass, setEnableForgotPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginRequest, { isLoading, error }] = useLoginMutation();
  const dispatch = useAppDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await loginRequest({ email, password }).unwrap();
      console.log(data);

      dispatch(
        setTokens({
          accessToken: data.data.accessToken,
          refreshToken: data.data.refreshToken,
        })
      );

      dispatch(
        setUser({
          id: data.data.user._id,
          name: data.data.user.name,
          email: data.data.user.email,
          role: data.data.user.role,
        })
      );
      toast.success("Login Successful");
    } catch (err) {
      console.error(err);
      toast.error("Login Failed");
    }
  };

  if (enableForgotPass) return <ForgotPassword />;
  else
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
          // backgroundColor: "#fff",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            required
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": { borderColor: "primary.main" },
                "&.Mui-focused fieldset": { borderColor: "primary.main" },
              },
            }}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": { borderColor: "primary.main" },
                "&.Mui-focused fieldset": { borderColor: "primary.main" },
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              marginTop: 2,
              padding: 1.5,
              fontWeight: "bold",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "primary.dark",
              },
            }}
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
          <Typography color="error" variant="body2" sx={{ marginTop: 2, textAlign: "center" }}>
            {error?.data?.message || "Something went wrong"}
          </Typography>
        )}
      </Paper>
    </motion.div>
    );
};

export default Login;
