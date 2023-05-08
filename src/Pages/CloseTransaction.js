import React, { useState } from "react";
import { getUserToken, saveUserToken, clearUserToken } from "../localStorage";
import { Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
// import Home from "./Pages/Home";
var SERVER_URL = "http://127.0.0.1:5000";

const CloseTransaction = ({transId, usdAmount, lbpAmount, transType}) => {
  const [showDiv, setShowDiv] = useState(true);
  let [userToken, setUserToken] = useState(getUserToken());
  const [responseData, setResponseData] = useState(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  function addTransactionFromPlatform(usdAmount,lbpAmount,transType) {
    console.log("working");
    let headers = { "Content-Type": "application/json" };
    if (userToken) {
      headers["Authorization"] = `Bearer ${userToken}`;
    }
    fetch(`${SERVER_URL}/transaction`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        usd_amount: usdAmount,
        lbp_amount: lbpAmount,
        usd_to_lbp: transType,
      }),
    })
      .then((response) => response.json())
      .then((data) => {

      })
      .then(() => {
 
      });

  }

  const handleClose = (transId) => {
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
        
        if(data.message=="This card is not created by you"){
          
            setMessage("You are not the owner of this card! Only the owner can close it!");
            setOpen(true);
  
  
          }
  
          else{
            window.location.reload();
          }
      
    })
    .catch((error) => console.error(error));
    
    setShowDiv(false);

  };

  const handle_Close = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  
  return (
    <>
      <button id="add-button" class="button" type="button" onClick={() => {handleClose(transId); addTransactionFromPlatform(usdAmount,lbpAmount,transType)}}>Close Transaction</button>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <MuiAlert elevation={6} variant="filled" severity="error" onClose={handle_Close}>
          {message}
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default CloseTransaction;
