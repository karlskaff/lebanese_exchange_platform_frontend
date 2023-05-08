// Import the needed librairies
import { React, useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";

var SERVER_URL = "http://127.0.0.1:5000";

function Statistics() {

  let [dateOfTransactions, setDateOfTransactions] = useState([]);
  let [transactionsNumber, setTransactionsNumber] = useState([]);
  let [transactionsNumberBuy, setTransactionsNumberBuy] = useState([]);
  let [transactionsNumberSell, setTransactionsNumberSell] = useState([]);
  let [transactionsVolume, setTransactionsVolume] = useState([]);
  let [transactionsVolumeBuy, setTransactionsVolumeBuy] = useState([]);
  let [transactionsVolumeSell, setTransactionsVolumeSell] = useState([]);
  let [highestRate, setHighestRate] = useState([]);
  let [lowestRate, setLowestRate] = useState([]);
  const [timeframe, setTimeframe] = useState("last week");
    // Create a new Date object with today's date
    const today = new Date();

    // Get the date in the format of "YYYY-MM-DD"
    const formattedDate = today.toISOString().slice(0, 10);

    // Output the formatted date
    console.log(formattedDate);

    //This function initiates a GET request tha retrieves statistics form the backend based on the selected time frame by the user
    //For each case of selected time frame the function initiates a different API call, to fetch the needed data and display them on the screen
  function statistics() {
    let url;
    switch(timeframe) {
   
      case 'last week':
        url = `${SERVER_URL}/statistics/week`;
        break;
      case 'last month':
        url = `${SERVER_URL}/statistics/month`;
        break;
      case 'last three month':
        url = `${SERVER_URL}/statistics/three-month`;
        break;
      case 'last six month':
        url = `${SERVER_URL}/statistics/six-month`;
        break;
      case 'last year':
        url = `${SERVER_URL}/statistics/year`;
        break;
    default:
      url = `${SERVER_URL}/statistics/week`;
  }

    fetch(url)
      .then((response) => response.json())
      .then((data) => {

        var buy_amount = data.usd_amount_buy[formattedDate];
        var sell_amount = data.usd_amount_sell[formattedDate];
        console.log(data)
        var total_amount = buy_amount + sell_amount;

        //Setting the values of the needed information
        setDateOfTransactions([formattedDate]);
        setTransactionsNumber([data.number_of_transactions[formattedDate]]);
        setTransactionsNumberBuy([data.transactions_to_buy_usd[formattedDate]])
        setTransactionsNumberSell([data.transactions_to_sell_usd[formattedDate]])
        setDateOfTransactions([formattedDate]);
        setTransactionsVolume([total_amount]);
        setTransactionsVolumeBuy([buy_amount]);
        setTransactionsVolumeSell([sell_amount]);
        setHighestRate(data.highest_rate[formattedDate].toFixed(2));
        setLowestRate(data.lowest_rate[formattedDate].toFixed(2));
      });
     
  }

  useEffect(statistics, []);

  return (

    // This is a drop down select menu to choose the desired time frame, for the statisctics
    <div>
      <div className="select-container">
        <label htmlFor="timeframe-select">Select a Timeframe:</label>
      <select value={timeframe} onChange={(event) => {setTimeframe(event.target.value);statistics()}}>
                <option value="last week">Last Week</option>
                <option value="last month">Last Month</option>
                <option value="last three month">Last Three Month</option>
                <option value="last six month">Last Six Month</option>
                <option value="last year">Last Year</option>
      </select>
      </div>
    

      <div style={{ margin: "2em"}}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "0.8em",
            justifyContent: "center",
            
          }}
        >
          <Typography variant="h3" > Highest/Lowest Rate </Typography>
        </div>

        <ul>
          <div
            style={{
              display: "grid",
              placeItems: "center",
              gridTemplateColumns: "1fr 1fr",
              marginBottom: "3em",
            }}
          >
            <div
              className="wrapper"
              style={{
                margin: "auto 0.1em",
                textAlign: "center",
                width: "69%",
                padding: "1em 1.5em",
                height: "79%",
                
              }}
            >
              <Typography variant="h4" >
                Highest 
              </Typography>
              
                <h1>
                  <Typography variant="h3" style={{ color: '#7bc314' }}>
                      <span>{highestRate}</span>
                  </Typography>
                </h1>
            </div>
            <div
              className="wrapper"
              style={{
                margin: "auto 0.1em",
                textAlign: "center",
                width: "69%",
                padding: "1em 1.5em",
                height: "79%",
                
              }}
            >
              <Typography variant="h4" >
                Lowest
              </Typography>
                <h1>
                  <Typography variant="h3" style={{ color: '#ff0000' }}>
                      <span>{lowestRate}</span>
                  </Typography>
                </h1>
 
            </div>
          </div>
        </ul>
      </div>


      <div style={{ margin: "2em" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "0.8em",
            justifyContent: "center",
          }}
        >
          <Typography variant="h3">
            Total Transactions
          </Typography>
        </div>

        <ul>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              placeItems: "center",
            }}
          >
            <div
              className="wrapper"
              style={{
                margin: "auto 0.1em",
                textAlign: "center",
                width: "69%",
                padding: "1em 1.5em",
                height: "79%",
                
              }}
            >
              <Typography variant="h4">
                Number of Transactions
              </Typography>
                <h1>
                  <Typography variant="h3" style={{ color: '#0093d5' }}>
                    <span>{' '}{transactionsNumber[dateOfTransactions.length - 1]}</span> 
                    
                  </Typography>
                </h1>
          
            </div>
            <div
              className="wrapper"
              style={{
                margin: "auto 0.1em",
                textAlign: "center",
                width: "69%",
                padding: "1em 1.5em",
                height: "79%",
                
              }}
            >
              <Typography variant="h4">
                Volume in USD
              </Typography>
                <h1>
                  <Typography variant="h3" style={{ color: '#0093d5' }}>
                    <span>{' '}{transactionsVolume[dateOfTransactions.length - 1]}</span> 
                    
                  </Typography>
                </h1>
            
            </div>
          </div>
        </ul>
      </div>
      <div style={{ margin: "2em" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "0.8em",
            marginTop: "5em",
          }}
        >
          <Typography variant="h3">
            Buy Transactions
          </Typography>
        </div>

        <ul>
          <div
            style={{
              placeItems: "center",
              display: "grid",
              marginBottom: "2.9em",
              gridTemplateColumns: "1fr 1fr",

            }}
          >
            <div
              className="wrapper"
              style={{
                margin: "auto 0.1em",
                textAlign: "center",
                width: "69%",
                padding: "1em 1.5em",
                height: "79%",
                
              }}
            >
              <Typography variant="h4">
                Number of Transactions
              </Typography>
           
                <h1>
                  <Typography variant="h3" style={{ color: '#0093d5' }}>
                    <span>{' '}{transactionsNumberBuy[dateOfTransactions.length - 1]}
                    </span>
                  </Typography>
                </h1>
     
            </div>
            <div
              className="wrapper"
              style={{
                margin: "auto 0.1em",
                textAlign: "center",
                width: "69%",
                padding: "1em 1.5em",
                height: "79%",
              }}
            >
              <Typography variant="h4">
                Volume in USD
              </Typography>
             
                <h1>
                  <Typography variant="h3" style={{ color: '#0093d5' }}>
                    <span>{' '}{transactionsVolumeBuy[dateOfTransactions.length - 1]}
                    </span>
                  </Typography>
                </h1>
            </div>
          </div>
        </ul>
      </div>
      <div style={{ margin: "2em" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "0.8em",
            marginTop: "5em",
          }}
        >
          <Typography variant="h3">
            Sell Transactions
          </Typography>
        </div>

        <ul>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              placeItems: "center",
              marginBottom: "3em",
            }}
          >
            <div
              className="wrapper"
              style={{
                margin: "auto 0.1em",
                textAlign: "center",
                width: "69%",
                padding: "1em 1.5em",
                height: "79%",
                
              }}
            >
              <Typography variant="h4">
                Number of Transactions 
              </Typography>
              
                <h1>
                  <Typography variant="h3" style={{ color: '#0093d5' }}>
                    <span>{' '}{transactionsNumberSell[dateOfTransactions.length - 1]}
                    </span>
                  </Typography>
                </h1>
            </div>
            <div
              className="wrapper"
              style={{
                margin: "auto 0.1em",
                textAlign: "center",
                width: "69%",
                padding: "1em 1.5em",
                height: "79%",
                
              }}
            >
              
              <Typography variant="h4">
                Volume in USD
              </Typography>
                <h1>
                  <Typography variant="h3" style={{ color: '#0093d5' }}>
                    <span>{' '}{transactionsVolumeSell[dateOfTransactions.length - 1]}
                    </span>
                  </Typography>
                </h1>
 
            </div>
          </div>
        </ul>
      </div>
    </div>
  );
}

export default Statistics;
