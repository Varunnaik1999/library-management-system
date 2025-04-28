import * as React from "react";
import Box from "@mui/material/Box";
import { createTheme } from "@mui/material/styles";
import BookIcon from "@mui/icons-material/MenuBook";
import PersonIcon from "@mui/icons-material/Person";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { Routes, Route, useNavigate } from "react-router-dom";
import Books from "./Books";
import UserDetails from "./UserDetails";
import { Button, Typography } from "@mui/material";

const NAVIGATION = [
  {
    kind: "header",
    title: "Library Navigation",
  },
  {
    segment: "menu/books",
    title: "Books Available",
    icon: <BookIcon />,
    path: "books",
  },
  {
    segment: "menu/user",
    title: "User Details",
    icon: <PersonIcon />,
    path: "user",
  },
];

const theme = createTheme({
  colorSchemes: { light: true, dark: true },
});

function Menu() {
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate("/");
    localStorage.removeItem("UserDetails");
  };

  return (
    <AppProvider navigation={NAVIGATION} theme={theme}>
      <DashboardLayout>
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h4">Library Management System</Typography>
            <Button variant="outlined" color="error" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
          <Routes>
            <Route path="books" element={<Books />} />
            <Route path="user" element={<UserDetails />} />
          </Routes>
        </Box>
      </DashboardLayout>
    </AppProvider>
  );
}

export default Menu;
