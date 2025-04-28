import React, { useState } from "react";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import SuccessDialog from "./SuccessDialog";

const AddBook = ({ onCancel, bookDetails = {} }) => {
  const [name, setName] = useState(bookDetails.Name || "");
  const [stock, setStock] = useState(bookDetails.Stock || "");
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState({
    message: "",
    error: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
    setName("");
    setStock("");
  };

  const onSave = () => {
    if (bookDetails.id) {
      fetch(
        "https://api-generator.retool.com/JrI0R4/LibraryBooks/" +
          bookDetails.id,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Name: name, Stock: stock }),
        }
      )
        .then((response) => response.json())
        .then(() => {
          setDialogMessage({
            message: "Book updated successfully",
            error: false,
          });
          setOpenDialog(true);
        })
        .catch((error) => {
          setDialogMessage({
            message: "Error adding book",
            error: true,
          });
          setOpenDialog(true);
          console.error("Error updating book:", error);
        });
    } else {
      fetch("https://api-generator.retool.com/JrI0R4/LibraryBooks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Name: name, Stock: stock }),
      })
        .then((response) => response.json())
        .then(() => {
          setDialogMessage({
            message: "Book added successfully",
          });
          setOpenDialog(true);
        })
        .catch((error) => {
          setDialogMessage({
            message: "Error adding book",
            error: true,
          });
          setOpenDialog(true);
          console.error("Error adding book:", error);
        });
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogMessage({
      message: "",
      error: false,
    });
    onCancel();
  };

  return (
    <Paper sx={{ padding: 3, width: 400, margin: "auto", marginTop: 5 }}>
      <Typography variant="h5" gutterBottom align="center">
        {bookDetails.id ? "Edit Book" : "Add Book"}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Book Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Stock"
            variant="outlined"
            type="number"
            value={stock}
            onChange={(e) => {
              const value = e.target.value;
              if (value >= 0) {
                setStock(value);
              }
            }}
            fullWidth
            required
          />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ width: "48%" }}
              disabled={!name || !stock}
            >
              {bookDetails.id ? "Update Book" : "Add Book"}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              sx={{ width: "48%" }}
              onClick={onCancel}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </form>
      {openDialog && (
        <SuccessDialog
          handleClose={handleCloseDialog}
          title={dialogMessage.message}
          error={dialogMessage.error}
          warning={dialogMessage.warning}
        />
      )}
    </Paper>
  );
};

export default AddBook;
