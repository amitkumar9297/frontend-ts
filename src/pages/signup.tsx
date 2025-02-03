import React from "react";
import { motion } from "framer-motion";
import { useSignUpMutation } from "../services/auth.api";
import { setUser, setTokens } from "../store/reducers/authReducer";
import { useNavigate } from "react-router-dom";
import {
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
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  role: yup
    .string()
    .oneOf(["ADMIN", "USER"], "Invalid role")
    .required("Role is required"),
});

/**
 * SignUp component.
 *
 * This component handles user sign up. It renders a form with name, email, password, and role fields.
 * When the form is submitted, it calls the signUp mutation and dispatches the setTokens and setUser actions.
 * If the sign up is successful, it shows a success toast and redirects to the login page after 1.5 seconds.
 * If the sign up fails, it shows an error toast.
 *
 * @returns {JSX.Element} The SignUp component.
 */
const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [signUp, { isLoading }] = useSignUpMutation();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "USER",
    },
  });

  const handleSignUp = async (data) => {
    try {
      const response = await signUp(data).unwrap();
      console.log(response);

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
      toast.success("Sign Up Successful");
      setTimeout(() => navigate("/login"), 1500);
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
          boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>
          Sign Up
        </Typography>
        <form onSubmit={handleSubmit(handleSignUp)}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Name"
                variant="outlined"
                fullWidth
                required
                margin="normal"
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                required
                margin="normal"
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                required
                margin="normal"
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            )}
          />
          <FormControl fullWidth margin="normal" error={!!errors.role}>
            <InputLabel>Role</InputLabel>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Select {...field} label="Role" required>
                  <MenuItem value="ADMIN">ADMIN</MenuItem>
                  <MenuItem value="USER">USER</MenuItem>
                </Select>
              )}
            />
          </FormControl>
          {errors.role && (
            <Typography color="error" variant="body2">
              {errors.role.message}
            </Typography>
          )}
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
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Sign Up"
            )}
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
      </Paper>
    </motion.div>
  );
};

export default SignUp;
