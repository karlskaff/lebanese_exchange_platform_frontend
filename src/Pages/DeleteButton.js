import React, { useState } from "react";
import { getUserToken, saveUserToken, clearUserToken } from "../localStorage";
import { Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
var SERVER_URL = "http://127.0.0.1:5000";

const DeleteButton = ({transId}) => {
  const [showDiv, setShowDiv] = useState(true);
  let [userToken, setUserToken] = useState(getUserToken());
  const [responseData, setResponseData] = useState(null);
  const [warningMessage, setWarningMessage] = useState(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleDelete = (transId) => {
    fetch(`${SERVER_URL}/deleteExchange`, {
      method: "DELETE",
      headers: {
        Authorization: `bearer ${userToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        transaction_id: transId
      })
    })
    .then((response) => response.json())
    .then((data) => {
        
        // setResponseData(data);
        if(data.message=="This card is not created by you"){
          
          setMessage("You are not the owner of this card!  You cannot delete it");
          setOpen(true);


        }

        else{
          window.location.reload();
        }
      
    })
    .catch((error) => console.error(error));
    
    setShowDiv(false);
    // window.location.reload();
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  
  return (
    <>
      
      <button id="add-button" class="button" type="button" onClick={() => handleDelete(transId) }>Delete Transaction</button>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <MuiAlert elevation={6} variant="filled" severity="error" onClose={handleClose}>
          {message}
        </MuiAlert>
      </Snackbar>

    </>
  );
};

export default DeleteButton;
