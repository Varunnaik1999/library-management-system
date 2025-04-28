import { useState } from "react";
import Button from "@mui/material/Button";
import SuccessDialog from "./SuccessDialog";
import { useNavigate } from "react-router-dom";

const divBox = {
  width: "400px",
  margin: "100px auto",
  border: "2px solid black",
  padding: "30px",
  borderRadius: "10px",
  textAlign: "center",
};
const inputBox = {
  width: "100%",
  padding: "10px",
  boxSizing: "border-box",
  borderRadius: "10px",
  marginBottom: "10px",
  border: "1px solid black",
};
const loginButton = {
  width: "100%",
  padding: "10px",
  borderRadius: "10px",
};
const Login = () => {
  const [credentials, setCredentials] = useState({ id: "", password: "" });
  const [UserDetails, setUserDetails] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState({
    title: "",
    body: "",
    error: false,
  });
  const navigate = useNavigate();

  const handleCredentials = (type, value) => {
    setCredentials((prevCred) => {
      return { ...prevCred, [type]: value };
    });
  };

  const handleLoginClick = () => {
    fetch(
      "https://api-generator.retool.com/rqR3AK/LibraryUsers?User_ID=" +
        credentials.id
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.length > 0) {
          const userDetails = data[0];
          if (
            userDetails.User_ID === credentials.id &&
            userDetails.Password === credentials.password
          ) {
            setUserDetails(userDetails);
            setDialogMessage({
              title: "Login Successful",
              body: "Welcome " + userDetails.UserName,
              error: false,
            });
            setOpenDialog(true);
          } else {
            setDialogMessage({
              title: "Login Failed",
              body: "Invalid credentials",
              error: true,
            });
            setOpenDialog(true);
          }
        } else {
          setDialogMessage({
            title: "Login Failed",
            body: "Invalid credentials",
            error: true,
          });
          setOpenDialog(true);
        }
      })
      .catch((error) => {
        setDialogMessage({
          title: "Server Error! Please try again later.",
          body: "Invalid credentials",
          error: true,
        });
        setOpenDialog(true);
        console.error("Error fetching data:", error);
      });
  };

  const handleCloseDialog = () => {
    if (dialogMessage.error) {
      setOpenDialog(false);
      setDialogMessage({
        title: "",
        body: "",
        error: false,
      });
      setCredentials({ id: "", password: "" });
    } else {
      setOpenDialog(false);
      localStorage.setItem("UserDetails", JSON.stringify(UserDetails));
      navigate("/menu");
    }
  };

  return (
    <>
      <div style={divBox}>
        <h1>Library Management System</h1>
        <input
          placeholder="Username"
          style={inputBox}
          value={credentials?.id}
          onChange={(e) => {
            handleCredentials("id", e.target.value);
          }}
        />
        <input
          placeholder="Password"
          style={inputBox}
          value={credentials?.password}
          onChange={(e) => {
            handleCredentials("password", e.target.value);
          }}
        />
        <Button
          variant="contained"
          style={loginButton}
          onClick={handleLoginClick}
          disabled={
            credentials.id !== "" && credentials.password !== "" ? false : true
          }
        >
          Login
        </Button>
      </div>
      {openDialog && (
        <SuccessDialog
          handleClose={handleCloseDialog}
          title={dialogMessage.title}
          body={dialogMessage.body}
          fail={dialogMessage.error}
        />
      )}
    </>
  );
};

export default Login;
