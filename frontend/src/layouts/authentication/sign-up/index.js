import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import { FcGoogle } from "react-icons/fc";
import { handleError } from "utils";
import { ToastContainer } from "react-toastify";
import { handleSuccess } from "utils";
import "./index.css";

const Basic = () => {
  const [signupInfo, setSignUpInfo] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignUpInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = signupInfo;

    // Basic validation
    if (!email || !password) {
      console.error("Email and Password are required!");
      return;
    }

    try {
      const url = "http://localhost:8080/auth/signup";
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
      const { success, message, error } = result;
      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else if (error) {
        const details = error?.details[0].message;
        handleError(details);
      } else if (!success) {
        handleError(message);
      }
      console.log("Signup successful:", result);
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
        <Grid style={{ display: "flex", flexDirection: "column" }}>
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
              mb={5}
              variant="h5"
              style={{
                fontWeight: 600,
                color: "black",
              }}
            >
              Join us Free For Today Now!
            </Typography>
          </Grid>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={signupInfo.email}
              onChange={handleChange}
              style={{ marginBottom: "1rem" }}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={signupInfo.password}
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
              SignUp Now
            </Button>
          </form>
          {/* <MDBox display="flex" alignItems="center" ml={-1} mt={5}>
            <Checkbox />
            <MDTypography
              variant="button"
              fontWeight="regular"
              color="text"
              sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
            >
              &nbsp;&nbsp;I agree the&nbsp;
            </MDTypography>
            <MDTypography component="a" href="#" variant="button" fontWeight="bold" textGradient>
              Terms and Conditions
            </MDTypography>
          </MDBox> */}
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
            SignUp with Google
          </Button> */}
          <MDBox mt={1} mb={1} textAlign="center">
            <MDTypography variant="button" color="text">
              Already have an account{" "}
              <MDTypography
                style={{ color: "black" }}
                component={Link}
                to="/authentication/sign-in"
                variant="button"
                fontWeight="medium"
                textGradient
              >
                Sign In
              </MDTypography>
            </MDTypography>
          </MDBox>
          <ToastContainer />
        </Card>
      </Grid>
    </Grid>
  );
};

export default Basic;
