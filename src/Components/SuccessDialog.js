import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import Typography from "@mui/material/Typography";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(3),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogTitle-root": {
    fontSize: "1.5rem",
  },
}));

const SuccessDialog = (props) => {
  const { handleClose, title, body, fail = false, warning = false } = props;

  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle
        sx={{ m: 0, p: 2, textAlign: "center", fontSize: "2rem" }}
        id="customized-dialog-title"
      >
        {title}
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: "green",
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers sx={{ textAlign: "center" }}>
        {fail ? (
          <ErrorIcon sx={{ fontSize: 50, color: "red", mb: 2 }} />
        ) : warning ? (
          <WarningAmberIcon sx={{ fontSize: 50, color: "orange", mb: 2 }} />
        ) : (
          <CheckCircleIcon sx={{ fontSize: 50, color: "green", mb: 2 }} />
        )}
        <Typography
          variant="body1"
          sx={{ fontSize: "1.2rem", lineHeight: "1.5" }}
        >
          {body}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center" }}>
        <Button
          variant="contained"
          color={fail ? "error" : "primary"}
          onClick={handleClose}
          sx={{
            padding: "10px 20px",
            fontSize: "1rem",
          }}
        >
          Close
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
};

export default SuccessDialog;
