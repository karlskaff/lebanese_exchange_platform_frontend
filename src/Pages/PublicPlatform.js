import { React, useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import { getUserToken } from "../localStorage";
import jwtDecode from 'jwt-decode';


// import DeleteButton from "./DeleteButton";
var SERVER_URL = "http://127.0.0.1:5000";

function PublicPlatform() {
  
  let [transactionTypePlatform, setTransactionTypePlatform] = useState([]);
  let [transactionId, setTransactionId] = useState([]);
  let [emailAddressPlatform, setEmailAddressPlatform] = useState([]);
  let [amountSellingPlatform, setAmountSellingPlatform] = useState([]); //USD amount
  let [amountBuyingPlatform, setAmountBuyingPlatform] = useState([]); //LBP amount
  let [userNamePlatform, setUserNamePlatform] = useState([]);
  let [userToken, setUserToken] = useState(getUserToken());
  let [requestUserId, setRequestUserId] = useState();
  //Decoding the token to get the current User ID
  //This ID will be used to filter the offers between those owned by the current logged in user, and those who are not
  const decodedToken = jwtDecode(userToken);
  const currentUser = decodedToken.sub; //retrieving the user ID
  

//Sending a GET request to retrieve all the posted offers that aren't posted by the logged in user
  function transactions() {
    fetch(`${SERVER_URL}/exchangeTransaction`)
      .then((response) => response.json())
      .then((data) => {
        //Filtering the data by checking if the owner of the card is the same as the current user. 
        //The card only gets displayed if the owner isn't the same as the logged in user
        const filteredData = data.filter(transaction => transaction.request_user_id !== currentUser);

        setAmountSellingPlatform([]); 
        setAmountBuyingPlatform([]);
        setEmailAddressPlatform([]);
        setTransactionTypePlatform([]);
        setTransactionId([]);
        setUserNamePlatform([]);
        setRequestUserId([]);

        filteredData.forEach((transaction) => {
          //Setting all the needed information to be displayed on the card, data are get form the already filteredData created
          setRequestUserId((requestUserId) => [...requestUserId, transaction.request_user_id])
          setAmountSellingPlatform((amountSellingPlatform) => [...amountSellingPlatform, transaction.sell_amount]);
          setAmountBuyingPlatform((amountBuyingPlatform) => [...amountBuyingPlatform, transaction.buy_amount]);
          setEmailAddressPlatform((emailAddressPlatform) => [...emailAddressPlatform, transaction.user_email]);
          setTransactionId((transactionId) => [...transactionId, transaction.exchange_id]);
          setTransactionTypePlatform((transactionTypePlatform) => [...transactionTypePlatform, transaction.usd_to_lbp]);
          setUserNamePlatform((userNamePlatform) => [...userNamePlatform,transaction.username]);
          
        });
      });   
  }
  
  useEffect(transactions, []);
  

  return (

    <div style={{ margin: "2em"}}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "1em",
        }}
      >
        <Typography variant="h3" gutterBottom>
          List of Offers
        </Typography>
      </div>
      
        
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
                      textAlign: "left",
                      height: "auto",
                      margin: "auto 0.1em",
                      width: "fit-content",
                      minWidth: "170px",
                      
                    }}
                  >
                    
                    <div style={{ marginLeft: "0em"}}>

                    {/* User that owns the card */}
                    <Typography variant="h6">
                        Posted by: <span>{userNamePlatform[i]}</span>{" "}
                
                      </Typography>
                      {/* USD amount that the user wants to buy or sell */}
                      <Typography variant="h6">
                        USD amount: <span>{amountSellingPlatform[i]}</span>{" "}
                        {transactionTypePlatform[i] === true ? (
                          <span>USD</span>
                        ) : (
                          <span>LBP</span>
                        )}
                      </Typography>
                      {/* LBP amount that the user wants to buy or sell */}
                      <Typography variant="h6">
                        LBP amount:{" "}
                        <span>{amountBuyingPlatform[i]}</span>{" "}
                        {transactionTypePlatform[i] === true ? (
                          <span>LBP</span>
                        ) : (
                          <span>USD</span>
                        )}
                      </Typography>
                      {/* Type of transaction the user wants to execute */}
                      <Typography variant="h6">
                        Transaction Type:{""}
                        <span>
                          {transactionTypePlatform[i] === true ? (
                            <span>USD to LBP</span>
                          ) : (
                            <span>LBP to USD</span>
                          )}
                        </span>
                      </Typography>
                      {/* Email address to contact the owner of the card */}
                      <Typography variant="h6">
                        Email: <span>{emailAddressPlatform[i]}</span>
                       
                        <div>
                            <button id="add-button" class="button" type="button" onClick={() => window.open('mailto:' + emailAddressPlatform[i])} >Send Email</button>
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
export default PublicPlatform;
