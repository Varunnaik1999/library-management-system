import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { checkUserHadBook, insertBookIntoUser } from "../DataSet/Data";
import SuccessDialog from "./SuccessDialog";
import AddBook from "./AddBook";

const paginationModel = { page: 0, pageSize: 5 };

const Books = () => {
  const [Library_Books, setLibrary_Books] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState({
    message: "",
    error: false,
    warning: false,
  });
  const [refetch, setRefetch] = useState(false);
  const [bookDetails, setBookDetails] = useState({});
  const [showAddBook, setShowAddBook] = useState(false);

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
  }, [refetch]);

  const handleBorrow = (row) => {
    if (UserDetails.Limit === 0) {
      setDialogMessage({
        message:
          "You have already borrowed 2 books. Please return a book to borrow another one.",
        warning: true,
        error: false,
      });
      setOpenDialog(true);
    } else if (checkUserHadBook(UserDetails.Books, row.id)) {
      setDialogMessage({
        message: "You have already borrowed this book.",
        warning: true,
        error: false,
      });
      setOpenDialog(true);
    } else {
      insertBookIntoUser(
        UserDetails,
        row.id,
        row.Name,
        row.Stock,
        setDialogMessage,
        setOpenDialog,
        setRefetch
      );
      // window.location.reload();
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogMessage({
      message: "",
      error: false,
      warning: false,
    });
  };

  const handleEditBook = (row) => {
    setBookDetails(row);
    setShowAddBook(true);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "Name", headerName: "Book Name", width: 130 },
    {
      field: "Stock",
      headerName: "Stock",
      type: "number",
      width: 90,
    },
    UserDetails.Role === "Normal" && {
      field: "actions",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          size="small"
          disabled={params.row.Stock === 0}
          onClick={() => handleBorrow(params.row)}
        >
          Borrow
        </Button>
      ),
      sortable: false,
      filterable: false,
    },
    UserDetails.Role === "Admin" && {
      field: "actions",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => handleEditBook(params.row)}
        >
          Edit
        </Button>
      ),
      sortable: false,
      filterable: false,
    },
  ];

  const onCancel = () => {
    setBookDetails({});
    setShowAddBook(false);
    setRefetch(!refetch);
  };

  const handleAddBook = () => {
    setBookDetails({});
    setShowAddBook(true);
  };

  return (
    <>
      {UserDetails.Role === "Admin" && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddBook}
          sx={{ margin: "20px 0" }}
        >
          Add Book
        </Button>
      )}
      {showAddBook ? (
        <AddBook onCancel={onCancel} bookDetails={bookDetails} />
      ) : (
        <Paper sx={{ height: 400, width: "90%" }}>
          <DataGrid
            rows={Library_Books}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            sx={{ border: 0 }}
            disableRowSelectionOnClick
          />
        </Paper>
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

export default Books;
