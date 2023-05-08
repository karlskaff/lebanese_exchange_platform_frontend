import './App.css';
import { useState, useEffect, useCallback } from "react";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from "@mui/material/Typography";
import { TextField } from '@mui/material';
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import UserCredentialsDialog from './UserCredentialsDialog/UserCredentialsDialog';
import { getUserToken, saveUserToken, clearUserToken } from "./localStorage";
import {DataGrid} from '@mui/x-data-grid';
import {Route,BrowserRouter as Router,Routes,Link,Outlet,} from "react-router-dom";
import Statistics from "./Pages/Statistics";
import Home from "./Pages/Home";
import Platform from "./Pages/Platform";
import NewsList from './Pages/NewsList';
import logo from "./images/logo.png"
import PublicPlatform from './Pages/PublicPlatform';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
var SERVER_URL = "http://127.0.0.1:5000";

function App() {

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

    const States = {
        PENDING: "PENDING",
        USER_CREATION: "USER_CREATION",
        USER_LOG_IN: "USER_LOG_IN",
        USER_AUTHENTICATED: "USER_AUTHENTICATED",
      };

    let [buyUsdRate, setBuyUsdRate] = useState(null);
    let [sellUsdRate, setSellUsdRate] = useState(null);
    let [lbpInput, setLbpInput] = useState("");
    let [usdInput, setUsdInput] = useState("");
    let [transactionType, setTransactionType] = useState("usd-to-lbp");
    let [authState, setAuthState] = useState(States.PENDING);
    let [userToken, setUserToken] = useState(getUserToken());
    let [lbpConversion, setLbpConversion] = useState(0);
    let [usdConversion, setUsdConversion] = useState(0);
    let [userTransactions, setUserTransactions] = useState([]);
    const [menuOpen, setMenuOpen] = useState(false);

    const handleMenuClick = () => {
      setMenuOpen(!menuOpen);
    };

    function handleButtonClick() {
      setMenuOpen(false);
    }
    

    function fetchRates() {
        console.log("Fetching updated rates...")
        fetch(`${SERVER_URL}/exchangeRate`)
        .then(response => response.json())
        .then(data => {

            if (data.usd_to_lbp != null) {
            setBuyUsdRate(data.usd_to_lbp)   
            }

            if (data.lbp_to_usd != null) {
                setSellUsdRate(data.lbp_to_usd)
            }

            console.log("Rates are updated!")

        });
    }

    useEffect(fetchRates, []);


    const fetchUserTransactions = useCallback(() => {
        fetch(`${SERVER_URL}/transaction`, {
          headers: {
            Authorization: `bearer ${userToken}`,
    }, })
    .then((response) => response.json())
    .then((transactions) => setUserTransactions(transactions));
        }, [userToken]);
    
    useEffect(() => {
        if (userToken) {
            fetchUserTransactions();
        }
    }, [fetchUserTransactions, userToken]);


    function addItem() {
        // Get values
        let type = transactionType;
        let usd_amount = usdInput;
        let lbp_amount = lbpInput;
        // Convert type to boolean
        if (type === 'usd-to-lbp') {
            type = false;
        } else if (type === 'lbp-to-usd') {
            type = true;
        }
        // Create JS object
        const transaction = {
            usd_amount: usd_amount,
            lbp_amount: lbp_amount,
            usd_to_lbp: type
        }

        let headers = { 'Content-Type' : 'application/json' };
        if (userToken) {
            headers['Authorization'] = `Bearer ${userToken}`;
        }

        // Post request to add transaction to database
        fetch(`${SERVER_URL}/transaction`, { 
            method: 'POST',
            headers: headers,
            body: JSON.stringify(transaction),
        })
        .then(response => 
            response.json())
        .then(data => {
            console.log("Success: ", data);
        })
        .catch( err => {
            console.log('Error: ', err);
        })
        // Update rates
        fetchRates();
        // Clear the form entries
        setLbpInput("");
        setUsdInput("");
        console.log("End addItem function");
    }

    function login(username, password) {
        return fetch(`${SERVER_URL}/authentication`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_name: username,
            password: password,

    }), })
          .then((response) => response.json())
          .then((body) => {
            setAuthState(States.USER_AUTHENTICATED);
            setUserToken(body.token);
            saveUserToken(body.token);
            window.location.reload();
       
          });
          
    }

    function createUser(username, password) {
        return fetch(`${SERVER_URL}/user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_name: username,
            password: password,
          }),
        }).then((response) => login(username, password));
        
    }

    function logout() {
        setUserToken(null);
        clearUserToken();
        // window.location.reload();
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
      <Router>
      <AppBar position="fixed" style={{backgroundColor: 'rgba(1, 136, 166, 1)'}}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleMenuClick}>

          <MenuIcon />

        </IconButton>
        <Link to="/" style={{ textDecoration: "inherit", color: "inherit", display: "flex", alignItems: "center" }}>
          <img src={logo} style={{ height: "4em", marginRight: "1em" }} alt="Star Exchange" />
          <Typography variant="h4" style={{ fontFamily: 'Times New Roman'}}>Star Exchange</Typography>
        </Link>

        <div style={{ marginLeft: 'auto' }}>
          
          {menuOpen && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'left', backgroundColor: 'rgba(1, 35, 64, 0.85)', padding: '1em', position: 'absolute', top: '64px', left: '1px', right: '150mv', borderRadius:"10px" }}>
              <Link to="/" style={{ textDecoration: "none", color: "white", margin: '0.5em' }}>
                <Button color="inherit" onClick={handleMenuClick}>Home</Button>
              </Link>

              <Link to="/Statistics" style={{ textDecoration: "none", color: "white", margin: '0.5em' }}>
                <Button color="inherit" onClick={handleMenuClick}>Statistics</Button>
              </Link>

              <Link to="/NewsList" style={{ textDecoration: "none", color: "white", margin: '0.5em' }}>
                <Button color="inherit" onClick={handleMenuClick}>News</Button>
              </Link>

              {userToken !== null ? (
                <>
                  <Link to="/Platform" style={{ textDecoration: "none", color: "white", margin: '0.5em' }}>
                    <Button color="inherit" onClick={handleMenuClick}>My Platform</Button>
                  </Link>

                  <Link to="/PublicPlatform" style={{ textDecoration: "none", color: "white", margin: '0.5em' }}>
                    <Button color="inherit" onClick={handleMenuClick}>List of Offers</Button>
                  </Link>

                  <Link to="/" style={{ textDecoration: "none", color: "white", margin: '0.5em' }}>
                    <Button color="inherit" onClick={logout}>Logout</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Button color="inherit" onClick={() => setAuthState(States.USER_CREATION)} >Register</Button>
                  <Button color="inherit" onClick={() => setAuthState(States.USER_LOG_IN)} >Login</Button>
                </>
              )}
            </div>
          )}
        </div>
      </Toolbar>
    </AppBar>

        <UserCredentialsDialog
            open = {authState === States.USER_CREATION}
            onClose = {() => setAuthState(States.PENDING)}
            onSubmit = {(username, password) => createUser(username, password)}
            title = "Enter your credentials to register"
            submitText = "Submit"
        />

        <UserCredentialsDialog
            open = {authState === States.USER_LOG_IN}
            onClose = {() => setAuthState(States.PENDING)}
            onSubmit = {(username, password) => login(username, password)}
            title = "Enter your credentials to login"
            submitText = "Submit"
        />

        <Snackbar
        elevation={6}
        variant="filled"
        open={authState === States.USER_AUTHENTICATED}
        autoHideDuration={2000}
        onClose={() => setAuthState(States.PENDING)}
        >
        <Alert severity="success">Success</Alert>
        </Snackbar>
        <div style={{ paddingTop: "80px" }}>
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Platform" element={<Platform />} />
              <Route path="/Statistics" element={<Statistics />} />
              <Route path="/NewsList" element={<NewsList />} />
              <Route path="/PublicPlatform" element={<PublicPlatform />} />
            </Routes>
          </div>
          </Router>

        </>
  );

}

export default App;