import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";

import ChevronLeft from "@mui/icons-material/ChevronLeft";

import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import PackageList from "./components/PackageList.js";
import CustomerList from "./components/CustomerList.js";
import Invoices from "./components/Invoices.js";
import OneInvoice from "./components/OneInvoice.js";

import "./App.css";

function App() {
  const [appData, setAppData] = useState({ customers: [], packages: [] });
  const [invoices, setInvoices] = useState([]);
  const [drawerState, setDrawerState] = useState(false);
  const [invoiceObj, setInvoiceObj] = useState({});

  useEffect(() => {
    let fetchMe = true;

    if (fetchMe) {
      fetch("/data.json")
        .then((response) => response.json())
        .then((data) => {
          setAppData(data);
        });
    }
    return () => {
      fetchMe = false;
    };
  }, []);

  useEffect(() => {
    let data = { ...appData };
    let customersInvoiceObj = {};

    let myDate = new Date();

    data.customers.forEach((customer) => {
      customersInvoiceObj[customer.id] = {
        name: customer.name,
        totalWeight: 0,
        totalPrice: 0,
        packages: [],
        invoiceId: Date.now(),
        invoiceDate:
          myDate.getDate() +
          "-" +
          (myDate.getMonth() + 1) +
          "-" +
          myDate.getFullYear(),
      };
    });

    data.packages.forEach((pack) => {
      let rightPersonObj = customersInvoiceObj[pack.customerid];
      let onlyNum = +pack.weight.split("kg")[0];
      rightPersonObj.totalWeight = rightPersonObj.totalWeight + onlyNum;
      rightPersonObj.totalPrice = rightPersonObj.totalPrice + pack.price;

      let newPackObj = {};
      newPackObj.price = pack.price;
      newPackObj.weight = onlyNum;
      newPackObj.id = pack.id;

      rightPersonObj.packages.push(newPackObj);
    });

    let newArray = [];
    let arrayOfKeys = Object.keys(customersInvoiceObj);

    arrayOfKeys.forEach((key) => {
      let newMinObj = {};
      newMinObj.id = key;
      newMinObj.name = customersInvoiceObj[key].name;
      newMinObj.totalWeight = customersInvoiceObj[key].totalWeight;
      newMinObj.totalPrice = customersInvoiceObj[key].totalPrice;
      newMinObj.invoiceId = customersInvoiceObj[key].invoiceId;
      newMinObj.packagesArray = customersInvoiceObj[key].packages;
      newArray.push(newMinObj);
    });

    console.log(customersInvoiceObj);
    setInvoiceObj(customersInvoiceObj);
    setInvoices(newArray);
  }, [appData]);

  const removeClient = (id) => {
    let newAppData = { ...appData };
    let found = newAppData.customers.findIndex((element) => element.id === id);
    newAppData.customers.splice(found, 1);

    newAppData.packages = newAppData.packages.filter((pack) => {
      return pack.customerid !== id;
    });

    setAppData(newAppData);
  };

  const changeOrder = (direction, index, obj) => {
    let dataObj = { ...appData };

    if (direction === "down" && index < dataObj.packages.length - 1) {
      let temp = dataObj.packages[index];
      dataObj.packages[index] = dataObj.packages[index + 1];
      dataObj.packages[index + 1] = temp;
    }
    if (direction === "up" && index > 0) {
      let temp = dataObj.packages[index];
      dataObj.packages[index] = dataObj.packages[index - 1];
      dataObj.packages[index - 1] = temp;
    }
    setAppData(dataObj);
  };

  const removePackage = (id) => {
    let newAppData = { ...appData };
    let packageToDelete = newAppData.packages.findIndex(
      (element) => element.id === id
    );
    newAppData.packages.splice(packageToDelete, 1);
    setAppData(newAppData);
  };

  const addPackcage = (
    customerName,
    packId,
    packWeight,
    packCustomerId,
    packPrice,
    packShippingOrder
  ) => {
    let newAppData = { ...appData };
    let newInvoiceObj = { ...invoiceObj };

    if (!newInvoiceObj[packCustomerId]) {
      newAppData.customers.push({ id: packCustomerId, name: customerName });
    }

    let newPackage = {
      id: packId,
      weight: packWeight,
      customerid: packCustomerId,
      price: packPrice,
      shippingOrder: packShippingOrder,
    };

    newAppData.packages.push(newPackage);
    setAppData(newAppData);
  };
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
            <CustomerList appData={appData} removeClient={removeClient} />
          </Route>
          <Route path="/packages">
            <PackageList
              appData={appData}
              invoiceObj={invoiceObj}
              changeOrder={changeOrder}
              removePackage={removePackage}
              addPackcage={addPackcage}
            />
          </Route>
          <Route path="/invoices">
            <Invoices invoices={invoices} />
          </Route>
          <Route path="/printInvoice/:id">
            <OneInvoice invoiceObj={invoiceObj} />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
