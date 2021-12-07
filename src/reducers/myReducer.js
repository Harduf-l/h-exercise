import React from "react";

export default function myReducer(state, action) {
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

  const addPackage = (
    customerName,
    packId,
    packWeight,
    packCustomerId,
    packPrice,
    packShippingOrder
  ) => {
    let newAppData = { ...state.appData };
    let invoiceObjNew = { ...state.invoiceObj };

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
      id: "pak" + packId,
      weight: packWeight,
      customerid: packCustomerId,
      price: packPrice,
      shippingOrder: packShippingOrder,
    };
    newAppData.packages.push(newPackage);

    invoiceObjNew[packCustomerId].packages.push(newPackage);
    let newPrice = invoiceObjNew[packCustomerId].totalPrice + packPrice;
    invoiceObjNew[packCustomerId].totalWeight =
      invoiceObjNew[packCustomerId].totalWeight + packWeight;
    invoiceObjNew[packCustomerId].totalPrice = newPrice;

    return { appData: newAppData, invoiceObj: invoiceObjNew };
  };

  const removePackage = (packageEl) => {
    let id = packageEl.id;
    let newAppData = { ...state.appData };
    let packageToDelete = newAppData.packages.findIndex(
      (element) => element.id === id
    );
    newAppData.packages.splice(packageToDelete, 1);

    let newInvoiceObj = { ...state.invoiceObj };

    let customerId = packageEl.customerid;
    let foundPackage = newInvoiceObj[customerId].packages.findIndex(
      (el) => el.id === id
    );
    newInvoiceObj[customerId].packages.splice(foundPackage, 1);
    newInvoiceObj[customerId].totalWeight =
      newInvoiceObj[customerId].totalWeight - packageEl.weight;
    newInvoiceObj[customerId].totalPrice =
      newInvoiceObj[customerId].totalPrice - packageEl.price;

    return { appData: newAppData, invoiceObj: newInvoiceObj };
  };

  const removeClient = (id) => {
    let newAppData = { ...state.appData };
    let found = newAppData.customers.findIndex((element) => element.id === id);
    newAppData.customers.splice(found, 1);

    newAppData.packages = newAppData.packages.filter((pack) => {
      return pack.customerid !== id;
    });

    let newInvoiceObj = { ...state.invoiceObj };
    delete newInvoiceObj[id];

    return { appData: newAppData, invoiceObj: newInvoiceObj };
  };

  const changeOrder = (direction, index) => {
    let dataObj = { ...state.appData };
    let packagesObj = [...dataObj.packages];

    if (direction === "down" && index < packagesObj.length - 1) {
      let temp = packagesObj[index];

      packagesObj[index] = packagesObj[index + 1];
      packagesObj[index + 1] = temp;
    }
    if (direction === "up" && index > 0) {
      let temp = packagesObj[index];
      packagesObj[index] = packagesObj[index - 1];
      packagesObj[index - 1] = temp;
    }

    dataObj.packages = packagesObj;
    return { appData: dataObj };
  };

  const initApp = (data) => {
    data.packages.sort(function (a, b) {
      return a.shippingOrder - b.shippingOrder;
    });

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

    return { appData: data, invoiceObj: customersInvoiceObj };
  };

  let newState;
  switch (action.type) {
    case "FETCH_DATA_COMPLETED":
      newState = initApp(action.data);
      return { ...state, ...newState };
    case "ADD_PACKAGE":
      newState = addPackage(
        action.customerName,
        action.packId,
        action.packWeight,
        action.packCustomerId,
        action.packPrice,
        action.packShippingOrder
      );
      return { ...state, ...newState };
    case "REMOVE_PACKAGE":
      newState = removePackage(action.packageEl);
      return { ...state, ...newState };
    case "REMOVE_CLIENT":
      newState = removeClient(action.id);
      return { ...state, ...newState };
    case "CHANGE_ORDER":
      newState = changeOrder(action.direction, action.index);
      return { ...state, ...newState };
    default:
      return state;
  }
}
