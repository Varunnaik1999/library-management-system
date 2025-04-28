export const checkUserHadBook = (Books, bookID) => {
  if (Books.length) {
    return Books?.some((book) => book.Book_ID === bookID);
  }
  return false;
};

export const insertBookIntoUser = (
  UserDetails,
  bookID,
  bookName,
  bookStock,
  setDialogMessage,
  setOpenDialog,
  setRefetch
) => {
  fetch(
    "https://api-generator.retool.com/rqR3AK/LibraryUsers/" + UserDetails.id,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Limit: UserDetails.Limit - 1,
        Books: [...UserDetails.Books, { Book_ID: bookID, Book_Name: bookName }],
      }),
    }
  )
    .then((response) => response.json())
    .then((data) => {
      setDialogMessage({
        message: "Book Borrowed Successfully!",
        warning: false,
        error: false,
      });
      setOpenDialog(true);
      setRefetch((prev) => !prev);
    })
    .catch((error) => {
      setDialogMessage({
        message: "Server Error! Please try again later.",
        warning: false,
        error: true,
      });
      setOpenDialog(true);
      console.error("Error:", error);
    });

  localStorage.setItem(
    "UserDetails",
    JSON.stringify({
      ...UserDetails,
      Limit: UserDetails.Limit - 1,
      Books: [...UserDetails.Books, { Book_ID: bookID, Book_Name: bookName }],
    })
  );

  fetch("https://api-generator.retool.com/JrI0R4/LibraryBooks/" + bookID, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Stock: bookStock - 1,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

export const removeBookFromUser = (
  UserDetails,
  bookID,
  bookStock,
  setDialogMessage,
  setOpenDialog
) => {
  fetch(
    "https://api-generator.retool.com/rqR3AK/LibraryUsers/" + UserDetails.id,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Limit: UserDetails.Limit + 1,
        Books: UserDetails.Books.filter((item) => item.Book_ID !== bookID),
      }),
    }
  )
    .then((response) => response.json())
    .then((data) => {
      setDialogMessage({
        message: "Book Returned Successfully!",
        warning: false,
        error: false,
      });
      setOpenDialog(true);
    })
    .catch((error) => {
      setDialogMessage({
        message: "Server Error! Please try again later.",
        warning: false,
        error: true,
      });
      setOpenDialog(true);
      console.error("Error:", error);
    });

  localStorage.setItem(
    "UserDetails",
    JSON.stringify({
      ...UserDetails,
      Limit: UserDetails.Limit + 1,
      Books: UserDetails.Books.filter((item) => item.Book_ID !== bookID),
    })
  );

  fetch("https://api-generator.retool.com/JrI0R4/LibraryBooks/" + bookID, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Stock: bookStock + 1,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};
