import React, { useState } from "react";
import { motion } from "framer-motion";
import { useSignUpMutation } from "../services/auth.api";
import { setTokens, setUser } from "../store/reducers/authReducer";
import {useNavigate} from 'react-router-dom'
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppDispatch } from "../store/store";

const SignUp = () => {
  const navigate=useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER"); // Default role is USER
  const [signUp, { isLoading, error }] = useSignUpMutation();
  const dispatch = useAppDispatch();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await signUp({ name, email, password, role }).unwrap();
      console.log(data);

      // dispatch(
      //   setTokens({
      //     accessToken: data.data.accessToken,
      //     refreshToken: data.data.refreshToken,
      //   })
      // );

      dispatch(
        setUser({
          id: data.data.user._id,
          name: data.data.user.name,
          email: data.data.user.email,
          role: data.data.user.role,
        })
      );

      toast.success("Sign Up Successful");
      setTimeout(() => {
       navigate('/login')
      },1500)
    } catch (err) {
      toast.error("Sign Up Failed");
      console.error(err);
    }
  };

  return (
<motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Paper
        elevation={6}
        sx={{
          maxWidth: 400,
          margin: "80px auto",
          padding: 4,
          borderRadius: 3,
          // backgroundColor: "#fff",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>
          Sign Up
        </Typography>
        <form onSubmit={handleSignUp}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
            fullWidth
            required
            margin="normal"
            sx={{
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": { borderColor: "primary.main" },
                "&.Mui-focused fieldset": { borderColor: "primary.main" },
              },
            }}
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            fullWidth
            required
            margin="normal"
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
            variant="outlined"
            fullWidth
            required
            margin="normal"
            sx={{
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": { borderColor: "primary.main" },
                "&.Mui-focused fieldset": { borderColor: "primary.main" },
              },
            }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              label="Role"
              required
            >
              <MenuItem value="ADMIN">ADMIN</MenuItem>
              <MenuItem value="USER">USER</MenuItem>
            </Select>
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              marginTop: "16px",
              padding: 1.5,
              fontWeight: "bold",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "primary.dark",
              },
            }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
          </Button>
        </form>

        <Typography variant="body2" sx={{ marginTop: 2 }} align="center">
          Already have an account?{" "}
          <Button
            color="primary"
            onClick={() => navigate("/login")}
            sx={{ textTransform: "none", fontWeight: "bold" }}
          >
            Login
          </Button>
        </Typography>

        {error && (
          <Typography color="error" variant="body2" sx={{ marginTop: 2, textAlign: "center" }}>
            {error}
          </Typography>
        )}
      </Paper>
    </motion.div>
  );
};

export default SignUp;
