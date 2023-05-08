import { React, useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import { TextField, Select, MenuItem, Button } from "@material-ui/core";
import { getUserToken } from "../localStorage";
import DeleteButton from "./DeleteButton";
import CloseTransaction from "./CloseTransaction";
import jwtDecode from 'jwt-decode';


// import DeleteButton from "./DeleteButton";
var SERVER_URL = "http://127.0.0.1:5000";

function Platform() {
  let [sellAmount, setSellAmount] = useState();
  let [buyAmount, setBuyAmount] = useState();
  let [transactionTypePlatform, setTransactionTypePlatform] = useState([]);
  let [transactionId, setTransactionId] = useState([]);
  let [emailAddress, setEmailAddress] = useState();
  let [emailAddressPlatform, setEmailAddressPlatform] = useState([]);
  let [transactionType, setTransactionType] = useState("usd-to-lbp");
  let [amountSellingPlatform, setAmountSellingPlatform] = useState([]); //USD amount
  let [amountBuyingPlatform, setAmountBuyingPlatform] = useState([]); //LBP amount
  let [userNamePlatform, setUserNamePlatform] = useState([]);
  let [userToken, setUserToken] = useState(getUserToken());
  let [requestUserId, setRequestUserId] = useState();

  //Decoding the token to get the current User ID
  //This ID will be used to filter the offers between those owned by the current logged in user, and those who are not
  const decodedToken = jwtDecode(userToken);
  const currentUser = decodedToken.sub;
  
   //Filtering the data by checking if the owner of the card is the same as the current user. 
  //The card only gets displayed if the owner isn't the same as the logged in user
  function transactions() {
    fetch(`${SERVER_URL}/exchangeTransaction`)
      .then((response) => response.json())
      .then((data) => {
        const filteredData = data.filter(transaction => transaction.request_user_id === currentUser);
        setAmountSellingPlatform([]);
        setAmountBuyingPlatform([]);
        setEmailAddressPlatform([]);
        setTransactionTypePlatform([]);
        setTransactionId([]);
        setUserNamePlatform([]);
        setRequestUserId([]);

        //Setting all the needed information to be displayed on the card, data are get form the already filteredData created

        filteredData.forEach((transaction) => {
          
          setRequestUserId((requestUserId) => [...requestUserId, transaction.request_user_id])
          setTransactionId((transactionId) => [...transactionId, transaction.exchange_id]);
          setAmountSellingPlatform((amountSellingPlatform) => [...amountSellingPlatform, transaction.sell_amount]);
          setEmailAddressPlatform((emailAddressPlatform) => [...emailAddressPlatform, transaction.user_email]);
          setTransactionTypePlatform((transactionTypePlatform) => [...transactionTypePlatform, transaction.usd_to_lbp]);
          setAmountBuyingPlatform((amountBuyingPlatform) => [...amountBuyingPlatform, transaction.buy_amount]);
          setUserNamePlatform((userNamePlatform) => [...userNamePlatform,transaction.username]);
          
        });
      });

     
  }

  //Initiates a POST request that sends the details of an offer.
  //The offer is saved in table called exchange_card in the database, which will then be retrieved from it
  function addTransaction() {
    
    let headers = { "Content-Type": "application/json" };
    if (userToken) {
      headers["Authorization"] = `Bearer ${userToken}`;
    }
    fetch(`${SERVER_URL}/exchangeTransaction`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        user_email: emailAddress,
        sell_amount: sellAmount,
        buy_amount: buyAmount,
        usd_to_lbp: transactionType === "usd-to-lbp" ? true : false,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setSellAmount("");
        setBuyAmount("");
        setEmailAddress("");
        transactions();
      });
      
      
  }

  useEffect(transactions, []);
  
  return (
    // Creating a form that has the required fields about an offer
    //The details inserted inside this form will be sent to the database
    <div style={{ margin: "2em"}}>
      <div
        style={{
          display: "flex",
          marginBottom: "1em",
          justifyContent: "center",
          alignItems: "center",
          
        }}
      >
        <Typography variant="h3" gutterBottom>
          Post your Offers
        </Typography>
      </div>
      <div
        className="wrapper"
        style={{
          textAlign: "center",
          width: "500px",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Add Transaction
        </Typography>
        {/* Adding the amount of USD */}
        <form name="transaction-entry">
          <div className="amount-input">
            <TextField
              id="amount-to-sell"
              label="USD amount"
              style={{ width: "100%" }}
              type="number"
              value={sellAmount}
              onChange={({ target: { value } }) => setSellAmount(value)}
              
            />
          </div>
          {/* Adding the Amount of LBP */}
          <div className="amount-input">
            <TextField
              id="asked-price"
              label="LBP amount"
              style={{ width: "100%" }}
              type="number"
              value={buyAmount}
              onChange={({ target: { value } }) => setBuyAmount(value)}
              
            />
          </div>
          {/* Adding an email address as a form of contact */}
          <div className="amount-input">
            <TextField
              id="email-address"
              label="Email Address"
              style={{ width: "100%" }}
              type="email"
              value={emailAddress}
              onChange={({ target: { value } }) => setEmailAddress(value)}
              
            />
          </div>
          {/* Choose the desired type of transaction. LBP to USD or USD to LBP */}
          <div style={{ paddingTop: "1em", textAlign: "left" }}>
            <Select
              id="transaction-type"
              defaultValue={transactionType}
              size="small"
              onChange={({ target: { value } }) => setTransactionType(value)}
            >
              <MenuItem value="usd-to-lbp">USD to LBP</MenuItem>
              <MenuItem value="lbp-to-usd">LBP to USD</MenuItem>
            </Select>
            {/* The add button once pressed calls the function addTrasaction */}
            {/* The offer details that have been inserted will then be sent to the database */}
            <Button onClick={addTransaction} id="add-button" class="button" type="button">Add</Button>
          </div>
        </form>
      </div>
      <br></br>
      <br></br>
      <br></br>

      
        <hr />
        {/* Section to Display the offers that the current user has posted */}
      <ul style={{ padding: "0" }}>
        <div
          style={{
            placeItems: "center",
            display: "grid",
            gridTemplateColumns: "repeat(3, auto)",
            
          }}
        >

          {/* Using the Array.from() method to create an array with a length equal to the transactionTypePlatform array. */}
          {/* The resulting array is used to generate a list containing information about the posted offers */}
          {Array.from({ length: transactionTypePlatform.length }, (_, i) => (
            <h1>
              <Typography variant="h6">
                <h1>
                
                  <div
                    className="wrapper"
                    style={{
                      padding: "1em 1.5em",
                      minWidth: "170px",
                      textAlign: "left",
                      width: "fit-content",
                      height: "auto",
                      margin: "auto 0.1em",
                    }}
                  >
                    
                    <div style={{ marginLeft: "0em"}}>
                    {/* Displaying the details of the offer */}
                    {/* Displaying the name of the offer owner */}
                    <Typography variant="h6">
                        Posted by: <span>{userNamePlatform[i]}</span>{" "}
                
                      </Typography>
                      {/* Displaying the amount of USD */}
                      <Typography variant="h6">
                        Amount Selling: <span>{amountSellingPlatform[i]}</span>{" "}
                        {transactionTypePlatform[i] === true ? (
                          <span>USD</span>
                        ) : (
                          <span>LBP</span>
                        )}
                      </Typography>
                      {/* Displaying the amount of LBP */}
                      <Typography variant="h6">
                        Buying Amount Ask:{" "}
                        <span>{amountBuyingPlatform[i]}</span>{" "}
                        {transactionTypePlatform[i] === true ? (
                          <span>LBP</span>
                        ) : (
                          <span>USD</span>
                        )}
                      </Typography>
                      {/* Displaying the type of transaction */}
                      {/* is it LBP to USD or USD to LBP */}
                      <Typography variant="h6">
                        Listing Type:{" "}
                        <span>
                          {transactionTypePlatform[i] === true ? (
                            <span>USD to LBP</span>
                          ) : (
                            <span>LBP to USD</span>
                          )}
                        </span>
                      </Typography>
                      {/* Displaying the email address that the owner of the card has inserted while creating it */}
                      <Typography variant="h6">
                        Emaill Address: <span>{emailAddressPlatform[i]}</span>
                       
                       {/* Two buttons one is used to delete a transaction that the owner doesn't want to offer any more */}
                       {/* The other button to show that a transaction was completed successfuly */}
                       {/* When the delete button is pressed, the transaction is deleted from the exchange_card tables */}
                       {/* When the Close transaction button is pressed the transaction is moved from the exchange_card table to the transaction_table and it is counted while calculating the exchange rate*/}
                        <div>
                            <DeleteButton transId={transactionId[i]} />
                            <CloseTransaction transId={transactionId[i]} usdAmount={amountSellingPlatform[i]} lbpAmount={amountBuyingPlatform[i]} transType={transactionTypePlatform[i]}/>
 
                        </div>
                        
                      </Typography>
                    </div>
                    
                  </div>
                </h1>
              </Typography>
            </h1>
          ))
          }
        </div>
      </ul>

    </div>
  );
}
export default Platform;
