import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { removeBookFromUser } from "../DataSet/Data";
import SuccessDialog from "./SuccessDialog";
import { Box, Divider, Typography } from "@mui/material";

const paginationModel = { page: 0, pageSize: 5 };

const UserDetails = () => {
  const [Library_Books, setLibrary_Books] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState({
    message: "",
    error: false,
    warning: false,
  });
  const [borrowedBooks, setBorrowedBooks] = useState([]);

  const UserDetails = JSON.parse(localStorage.getItem("UserDetails"));

  useEffect(() => {
    fetch("https://api-generator.retool.com/JrI0R4/LibraryBooks")
      .then((response) => response.json())
      .then((data) => {
        setLibrary_Books(data);
      })
      .catch((error) => {
        alert("server error");
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    if (UserDetails?.Role === "Admin") {
      fetch("https://api-generator.retool.com/rqR3AK/LibraryUsers")
        .then((response) => response.json())
        .then((data) => {
          const borrowedBooks = data
            .filter((item) => item.Role === "Normal")
            .flatMap((user) =>
              (user.Books || []).map((book) => ({
                ...book,
                id: book.Book_ID,
              }))
            );
          setBorrowedBooks(borrowedBooks);
        })
        .catch((error) => {
          alert("server error");
          console.error("Error fetching data:", error);
        });
    }
  }, []);

  const tableData = UserDetails?.Books?.map((book) => ({
    id: book.Book_ID,
    Book_ID: book.Book_ID,
    Book_Name: book.Book_Name,
  }));

  const handleReturn = (row) => {
    const book_Details = Library_Books.find((item) => item.id === row.Book_ID);
    removeBookFromUser(
      UserDetails,
      row.Book_ID,
      book_Details.Stock,
      setDialogMessage,
      setOpenDialog
    );
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogMessage({
      message: "",
      error: false,
      warning: false,
    });
  };

  const columns = [
    {
      field: "Book_ID",
      headerName: "Book ID",
      type: "number",
      width: 90,
    },
    { field: "Book_Name", headerName: "Book Name", width: 130 },
    UserDetails?.Role === "Normal" && {
      field: "actions",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => handleReturn(params.row)}
        >
          Return
        </Button>
      ),
      sortable: false,
      filterable: false,
    },
  ];

  return (
    <>
      {UserDetails?.id && (
        <Paper elevation={3} sx={{ p: 2, mb: 3, width: "90%" }}>
          <Typography variant="h6" gutterBottom>
            User Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
            <Typography>
              <strong>User ID:</strong> {UserDetails.User_ID}
            </Typography>
            <Typography>
              <strong>User Name:</strong> {UserDetails.UserName}
            </Typography>
            <Typography>
              <strong>Role:</strong> {UserDetails.Role}
            </Typography>
            {UserDetails.Role !== "Admin" && (
              <Typography>
                <strong>Limit:</strong> {UserDetails.Limit}
              </Typography>
            )}
          </Box>
        </Paper>
      )}
      {tableData?.length > 0 || borrowedBooks?.length > 0 ? (
        <Paper sx={{ height: 300, width: "90%" }}>
          <DataGrid
            rows={UserDetails?.Role === "Normal" ? tableData : borrowedBooks}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            sx={{ border: 0 }}
            disableRowSelectionOnClick
          />
        </Paper>
      ) : (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <h2>No Books Borrowed</h2>
        </div>
      )}
      {openDialog && (
        <SuccessDialog
          handleClose={handleCloseDialog}
          title={dialogMessage.message}
          error={dialogMessage.error}
          warning={dialogMessage.warning}
        />
      )}
    </>
  );
};

export default UserDetails;
