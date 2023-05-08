import "../App.css";
import React, { useState, useEffect, useCallback } from "react";
import { Typography, TextField } from "@material-ui/core";
import { getUserToken } from "../localStorage";
import { DataGrid } from "@mui/x-data-grid";
import { Line } from "react-chartjs-2";
import{Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Legend} from "chart.js";

var SERVER_URL = "http://127.0.0.1:5000";


const dataGridColumns = [
  {
    field: "added_date",
    headerName: "Date",
    resizable: true,
    flex: 1,
  },
  { field: "id", headerName: "TxId", flex: 1 },
  {
    field: "lbp_amount",
    headerName: "LBP",
    flex: 1,
  },
  {
    field: "usd_amount",
    headerName: "USD",
    flex: 1,
  },
  {
    field: "usd_to_lbp",
    headerName: "USD to LBP",
    flex: 1,
  },
  { field: "user_id", hide: true, flex: 1 },
];

ChartJS.register(
  LineElement,
  CategoryScale, //x-axis
  LinearScale, //y-axis
  PointElement,
  Legend
)
function Home() {
  const [timeframe, setTimeframe] = useState("last week");
  let [buyUsdRate, setBuyUsdRate] = useState(null);
  let [sellUsdRate, setSellUsdRate] = useState(null);
  let [lbpInput, setLbpInput] = useState("");
  let [usdInput, setUsdInput] = useState("");
  let [transactionType, setTransactionType] = useState("usd-to-lbp");
  let [userToken, setUserToken] = useState(getUserToken());
  let [lbpConversion, setLbpConversion] = useState(0);
  let [usdConversion, setUsdConversion] = useState(0);
  let [userTransactions, setUserTransactions] = useState([]);
  let [graphDate, setGraphDate] = useState([]);
  let [buyData, setBuyData] = useState([]);
  let [sellData, setSellData] = useState([]);
  



  function fetchRates() {
    fetch(`${SERVER_URL}/exchangeRate`)
      .then((response) => response.json())
      .then((data) => {
        // console.log(data); // for testing purposes
        setBuyUsdRate(
          Math.round((data.lbp_to_usd + Number.EPSILON) * 100) / 100
        );
        setSellUsdRate(
          Math.round((data.usd_to_lbp + Number.EPSILON) * 100) / 100
        );
      });
  }

// This graph was writen based on the react-chartjs-2 documentation
// We are initiating a different GET request based on the selected time
//For each time frame selected,the appropriate data will be received and displayed on the graph
  function graphData() {
    
    let url;
    switch(timeframe) {
   
      case 'last week':
        url = `${SERVER_URL}/graph/week`;
        break;
      case 'last month':
        url = `${SERVER_URL}/graph/month`;
        break;
      case 'last three month':
        url = `${SERVER_URL}/graph/three-month`;
        break;
      case 'last six month':
        url = `${SERVER_URL}/graph/six-month`;
        break;
      case 'last year':
        url = `${SERVER_URL}/graph/year`;
        break;
    default:
      url = `${SERVER_URL}/graph/week`;
  }
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setBuyData(data.average_buy);
        setSellData(data.average_sell);
        setGraphDate(data.dates);
      });
  }

  useEffect(fetchRates, []);
  useEffect(graphData,[])

  // Setting the data to show on the graph. The data are the one received from the above initiated requests, based on the time frame
  const data ={
    labels: graphDate,
    datasets: [{
      label:"Buy USD",
      data: buyData,
      backgroundColor: '#7bc314',
      borderColor: '#7bc314',
      pointBorderColor: 'black',
      tension: 0.4
    },
    {
      label:"Sell USD",
      data: sellData,
      backgroundColor: '#ff0000',
      borderColor: '#ff0000',
      pointBorderColor: 'black',
      tension: 0.4
    }]
  }
  
  const options ={
    plugins:{
      legend: true
    },
    scales:{

    }
  }

  const fetchUserTransactions = useCallback(() => {
    fetch(`${SERVER_URL}/transaction`, {
      headers: {
        Authorization: `bearer ${userToken}`,
      },
    })
      .then((response) => response.json())
      .then((transactions) => setUserTransactions(transactions));
  }, [userToken]);

  useEffect(() => {
    if (userToken) {
      fetchUserTransactions();
    }
  }, [fetchUserTransactions, userToken]);


  function addItem() {
    let headers = { "Content-Type": "application/json" };
    if (userToken) {
      headers["Authorization"] = `Bearer ${userToken}`;
    }
    fetch(`${SERVER_URL}/transaction`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        usd_amount: usdInput,
        lbp_amount: lbpInput,
        usd_to_lbp: transactionType === "usd-to-lbp" ? true : false,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data.message); // for testing purposes
        setLbpInput("");
        setUsdInput("");
        fetchRates();
      })
      .then(() => {
        fetchRates();
        fetchUserTransactions();
      });
    fetchRates();
    fetchUserTransactions();
  }

  function buyUsdRateFunction() {
    if (buyUsdRate == null) {
      return "Not Available";
    } else {
      return buyUsdRate;
    }
  }

  function sellUsdRateFunction() {
    if (sellUsdRate == null) {
      return "Not Available";
    } else {
      return sellUsdRate;
    }
  }

  function convertToUSD(value) {
    if (value == null) {
      setUsdConversion("");
    } else {
      setUsdConversion((value / buyUsdRate).toFixed(2));
    }
  }

  function convertFromUSD(value) {
    if (value == null) {
      setLbpConversion("");
    } else {
      setLbpConversion(value * sellUsdRate);
    }
    
  }

  return (


<>
   <div className="wrapper" style={{marginTop:"100px"}}>
            <h2>Today's Exchange Rate</h2>
            <p>LBP to USD Exchange Rate</p>
            <h3>Buy USD: <span id="buy-usd-rate">{buyUsdRate != null ? buyUsdRate.toFixed(2) : "Not available yet"}</span></h3>
            <h3>Sell USD: <span id="sell-usd-rate">{sellUsdRate != null ? sellUsdRate.toFixed(2) : "Not available yet"}</span></h3>
            <hr />


            <Typography variant="h5" gutterBottom>
              Calculate conversion between USD and LBP
            </Typography>
            <form name="transaction-entry">
              <div className="amount-input">
                <div className="conversionDiv">
                  <TextField
                    id="lbp-amount"
                    label="LBP Amount"
                    type="number"
                    size="Normal"
                    margin="dense"
                    onChange={(e) => convertToUSD(e.target.value)}
                  />
                  <Typography variant="h6" className="conversionText">
                    USD : {usdConversion}
                  </Typography>
                </div>
                <div className="conversionDiv">
                  <TextField
                    id="usd-amount"
                    label="USD Amount"
                    type="number"
                    margin="dense"
                    onChange={(e) => convertFromUSD(e.target.value)}
                  />
                  <Typography variant="h6" className="conversionText">
                    LBP : {lbpConversion}
                  </Typography>
                </div>
              </div>
            </form>

        </div>

        <div className="wrapper">
        <h2>Record a recent transaction</h2>
            <form name="transaction-entry">

                <div className="amount-input">
                    <label htmlFor="lbp-amount">LBP Amount</label>
                    <input id="lbp-amount" type="number" value={lbpInput} onChange={ e => setLbpInput(e.target.value)}/>
                </div>


                <div className="amount-input">
                    <label htmlFor="usd-amount">USD Amount</label>
                    <input id="usd-amount" type="number" value={usdInput} onChange={ e => setUsdInput(e.target.value)}/>
                  </div>

                  <select id="transaction-type" onChange={ e => setTransactionType(e.target.value)} style={{
                                                                                          backgroundColor: "#f7f7f7",
                                                                                          border: "1px solid #ccc",
                                                                                          borderRadius: "4px",
                                                                                          color: "#555",
                                                                                          fontSize: "13.5px",
                                                                                          padding: "10px",
                                                                                          width: "12%"
                                                                                        }}>
                    <option value="usd-to-lbp" >USD to LBP</option>
                    <option value="lbp-to-usd">LBP to USD</option>
                  </select>

                  <button id="add-button" class="button" type="button" onClick={addItem}>Add</button>
            </form>
        </div>

        <div className="wrapper" style={{ marginBottom: "3em" }}>
              <h2> Exchange Rate Line Chart</h2>
              <select value={timeframe} onChange={(event) => {setTimeframe(event.target.value);graphData();}}>
                <option value="last week">Last Week</option>
                <option value="last month">Last Month</option>
                <option value="last three month">Last Three Month</option>
                <option value="last six month">Last Six Month</option>
                <option value="last year">Last Year</option>
              </select>
              
              <Line
              data = {data}
              options = {options}
              ></Line>
            </div>

        {userToken && (
            <div className="wrapper" style={{ marginBottom: "3em"}}>
              <Typography variant="h5" className="tableTitle">
                Your Transactions
              </Typography>
              <DataGrid
                columns={dataGridColumns}
                rows={userTransactions}
                autoHeight
              />
            </div>
          )    
          
          
          }


          </>);
}


export default Home;
