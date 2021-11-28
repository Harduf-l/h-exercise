import React, { useState, useEffect } from "react";
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
  const [appData, setAppData] = useState({ customers: [], packages: [] });
  const [drawerState, setDrawerState] = useState(false);
  const [invoiceObj, setInvoiceObj] = useState({});

  useEffect(() => {
    let fetchMe = true;

    if (fetchMe) {
      fetch("/data.json")
        .then((response) => response.json())
        .then((data) => {
          setAppData(data);
          let customersInvoiceObj = {};
          let myDate = createDate();

          data.customers.forEach((customer) => {
            customersInvoiceObj[customer.id] = createNewInvoiceObj(
              customer.name,
              0,
              0,
              [],
              Date.now(),
              myDate
            );
          });

          data.packages.forEach((pack) => {
            let rightPersonObj = customersInvoiceObj[pack.customerid];
            let kgInNum = returnNetoWeight(pack.weight);
            rightPersonObj.totalWeight = rightPersonObj.totalWeight + kgInNum;
            rightPersonObj.totalPrice = rightPersonObj.totalPrice + pack.price;
            pack.weight = kgInNum;
            rightPersonObj.packages.push(pack);
          });

          setInvoiceObj(customersInvoiceObj);
        });
    }
    return () => {
      fetchMe = false;
    };
  }, []);

  const createNewInvoiceObj = (
    name,
    totalWeight,
    totalPrice,
    packages,
    invoiceId,
    invoiceDate
  ) => {
    return {
      name: name,
      totalWeight: totalWeight,
      totalPrice: totalPrice,
      packages: packages,
      invoiceId: invoiceId,
      invoiceDate: invoiceDate,
    };
  };

  const returnNetoWeight = (stringKg) => {
    return +stringKg.split("kg")[0];
  };

  const removeClient = (id) => {
    let newAppData = { ...appData };
    let found = newAppData.customers.findIndex((element) => element.id === id);
    newAppData.customers.splice(found, 1);

    newAppData.packages = newAppData.packages.filter((pack) => {
      return pack.customerid !== id;
    });

    setAppData(newAppData);
    let newInvoiceObj = { ...invoiceObj };
    delete newInvoiceObj[id];
    setInvoiceObj(newInvoiceObj);
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

  const removePackage = (packageEl) => {
    let id = packageEl.id;
    let newAppData = { ...appData };
    let packageToDelete = newAppData.packages.findIndex(
      (element) => element.id === id
    );
    newAppData.packages.splice(packageToDelete, 1);
    setAppData(newAppData);

    let newInvoiceObj = { ...invoiceObj };

    let customerId = packageEl.customerid;
    let foundPackage = newInvoiceObj[customerId].packages.findIndex(
      (el) => el.id === id
    );
    newInvoiceObj[customerId].packages.splice(foundPackage, 1);
    newInvoiceObj[customerId].totalWeight =
      newInvoiceObj[customerId].totalWeight - packageEl.weight;
    newInvoiceObj[customerId].totalPrice =
      newInvoiceObj[customerId].totalPrice - packageEl.price;
    setInvoiceObj(newInvoiceObj);
  };

  const createDate = () => {
    let myDate = new Date();
    let formattedDate =
      myDate.getDate() +
      "-" +
      (myDate.getMonth() + 1) +
      "-" +
      myDate.getFullYear();

    return formattedDate;
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
    let invoiceObjNew = { ...invoiceObj };

    if (!invoiceObjNew[packCustomerId]) {
      let myDate = createDate();
      newAppData.customers.push({ id: packCustomerId, name: customerName });
      invoiceObjNew[packCustomerId] = createNewInvoiceObj(
        customerName,
        0,
        0,
        [],
        Date.now(),
        myDate
      );
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

    invoiceObjNew[packCustomerId].packages.push(newPackage);
    let newPrice = invoiceObjNew[packCustomerId].totalPrice + packPrice;
    invoiceObjNew[packCustomerId].totalWeight =
      invoiceObjNew[packCustomerId].totalWeight + packWeight;
    invoiceObjNew[packCustomerId].totalPrice = newPrice;
    setInvoiceObj(invoiceObjNew);
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
            <Invoices invoiceObj={invoiceObj} />
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
