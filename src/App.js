import React, { useState, useEffect, useContext } from "react";
import { myContextObject } from "./context/MyContext";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";

import ChevronLeft from "@mui/icons-material/ChevronLeft";

import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

import PackageList from "./components/PackageList.js";
import CustomerList from "./components/CustomerList.js";
import Invoices from "./components/Invoices.js";
import OneInvoice from "./components/OneInvoice.js";

import "./App.css";

function App() {
  const { dispatch } = useContext(myContextObject);
  const [drawerState, setDrawerState] = useState(false);

  useEffect(() => {
    fetch("/data.json")
      .then((response) => response.json())
      .then((data) => dispatch({ type: "FETCH_DATA_COMPLETED", data }));
  }, []);

  return (
    <div className="App">
      <Router>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={() => setDrawerState(true)}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Mail Delivery Service
              </Typography>
            </Toolbar>
          </AppBar>

          <Drawer anchor={"left"} open={drawerState} onClose={() => {}}>
            <div style={{ textAlign: "right" }}>
              <IconButton onClick={() => setDrawerState(false)}>
                <ChevronLeft />
              </IconButton>
            </div>
            <List style={{ width: "300px" }}>
              <ListItem
                button
                onClick={() => setDrawerState(false)}
                component={Link}
                to="/"
              >
                <ListItemText primary={"Customers"} />
              </ListItem>
              <ListItem
                button
                onClick={() => setDrawerState(false)}
                component={Link}
                to="/packages"
              >
                <ListItemText primary={"Packages"} />
              </ListItem>
              <ListItem
                button
                onClick={() => setDrawerState(false)}
                component={Link}
                to="/invoices"
              >
                <ListItemText primary={"Invoices"} />
              </ListItem>
            </List>
          </Drawer>
        </Box>

        <Switch>
          <Route path="/" exact>
            <CustomerList />
          </Route>
          <Route path="/packages">
            <PackageList />
          </Route>
          <Route path="/invoices">
            <Invoices />
          </Route>
          <Route path="/printInvoice/:id">
            <OneInvoice />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
