import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";

// Icons
import { FcGoogle } from "react-icons/fc";

// Styling
import { Box, Typography } from "@mui/material";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import { handleError } from "utils";
import { handleSuccess } from "utils";
import { ToastContainer } from "react-toastify";
import "./index.css";

const Login = () => {
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = loginInfo;

    // Basic validation
    if (!email || !password) {
      console.error("Email and Password are required!");
      return;
    }

    try {
      const url = "http://localhost:8080/auth/login";
      console.log("Sending request to:", url);
      console.log("Request body:", { email, password });

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }), // Ensure only necessary fields are sent
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server Error:", errorData.message || "Unknown Error");
        return;
      }

      const result = await response.json();
      const { success, message, jwtToken, name, error } = result;
      if (success) {
        handleSuccess(message);
        localStorage.setItem("token", jwtToken);
        localStorage.setItem("loggedInUser", name);
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else if (error) {
        const details = error?.details[0].message;
        handleError(details);
      } else if (!success) {
        handleError(message);
      }
      console.log("Login Successful:", result);
    } catch (error) {
      console.error("Network Error:", error.message);
    }
  };

  return (
    <Grid container style={{ height: "100vh" }}>
      {/* Left Section */}
      <Grid
        item
        xs={12}
        md={6}
        style={{
          background: "linear-gradient(135deg, #3A80F8, #1A56D0)",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem",
        }}
      >
        <Typography
          variant="h1"
          style={{ fontWeight: 600, position: "relative", right: "80px", color: "white" }}
        >
          Hello
        </Typography>
        <Typography variant="h1" style={{ fontWeight: 600, color: "white" }}>
          SaleSkip! 👋
        </Typography>
        <Grid ml={-3} style={{ display: "flex", flexDirection: "column" }}>
          <Typography style={{ position: "relative", left: "84px" }}>
            Skip repetitive and manual sales-marketing
          </Typography>
          <Typography style={{ position: "relative", left: "84px" }}>
            tasks. Get highly productive through automation
          </Typography>
          <Typography style={{ position: "relative", left: "84px" }}>
            and save tons of time!
          </Typography>
        </Grid>
      </Grid>

      {/* Right Section */}
      <Grid
        item
        xs={12}
        md={6}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem",
        }}
      >
        <Card
          style={{
            width: "100%",
            maxWidth: "400px",
            padding: "2rem",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Grid style={{ display: "flex", flexDirection: "column" }}>
            <Typography
              variant="h3"
              style={{ fontWeight: 600, marginBottom: "50px", color: "black" }}
            >
              SaleSkip
            </Typography>
            <Typography
              variant="h3"
              style={{
                fontWeight: 600,
                color: "black",
              }}
            >
              Welcome Back!
            </Typography>
          </Grid>
          <Typography variant="body2" style={{ margin: "1rem 0" }}>
            Don’t have an account?{" "}
            <Link to="/authentication/sign-up" style={{ color: "#3A80F8", textDecoration: "none" }}>
              Create a new account now.
            </Link>
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={loginInfo.email}
              onChange={handleChange}
              style={{ marginBottom: "1rem" }}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={loginInfo.password}
              onChange={handleChange}
              style={{ marginBottom: "1rem" }}
            />
            <Button
              variant="contained"
              fullWidth
              type="submit"
              style={{
                marginBottom: "1rem",
                color: "white",
                backgroundColor: "black",
                textTransform: "capitalize",
              }}
            >
              Login Now
            </Button>
          </form>

          {/* <Divider style={{ margin: "0.5rem 0" }}>OR</Divider> */}

          {/* <Button
            variant="outlined"
            fullWidth
            startIcon={<FcGoogle />}
            style={{
              borderColor: "black",
              color: "black",
              margin: "4rem 0",
              textTransform: "capitalize",
            }}
          >
            Login with Google
          </Button> */}

          <Typography variant="body2" style={{ textAlign: "center", marginTop: "1rem" }}>
            Forgot password?{" "}
            <Link
              component={Link}
              to="/authentication/reset-password"
              style={{ color: "#3A80F8", textDecoration: "none" }}
            >
              Click here
            </Link>
          </Typography>
          <MDBox mt={1} mb={1} textAlign="center">
            <MDTypography variant="button" color="black">
              Register Here!{" "}
              <MDTypography
                component={Link}
                to="/authentication/sign-up"
                variant="button"
                color="black"
                fontWeight="medium"
                textGradient
              >
                Sign Up
              </MDTypography>
            </MDTypography>
          </MDBox>
          <ToastContainer />
        </Card>
      </Grid>
    </Grid>
  );
};

export default Login;
