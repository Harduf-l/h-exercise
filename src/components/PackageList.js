import React, { useEffect, useState, useContext } from "react";
import { myContextObject } from "../context/MyContext";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import FormHelperText from "@mui/material/FormHelperText";

export default function PackageList() {
  const { appData, invoiceObj, dispatch } = useContext(myContextObject);

  let [packWeight, setPackWeight] = useState("");
  let [packPrice, setPackPrice] = useState("");
  let [packCustomerName, setPackCustomerName] = useState("");
  let [packShippingOrder, setPackShippingOrder] = useState("");
  let [packCustomerId, setPackCustomerId] = useState("");
  let [modalState, setModalState] = useState(false);

  const addPackage = () => {
    if (
      packWeight &&
      packPrice &&
      packShippingOrder &&
      packCustomerId &&
      packCustomerName
    ) {
      let newPackWeight = +packWeight;
      let newPackPrice = +packPrice;
      let newPackShippingOrder = +packShippingOrder;
      let newCustomerId = +packCustomerId;
      let newPackId = Date.now();

      setPackCustomerName("");
      setPackWeight("");
      setPackPrice("");
      setPackShippingOrder("");
      setPackCustomerId("");
      setModalState(false);

      dispatch({
        type: "ADD_PACKAGE",
        customerName: packCustomerName,
        packId: newPackId,
        packWeight: newPackWeight,
        packCustomerId: newCustomerId,
        packPrice: newPackPrice,
        packShippingOrder: newPackShippingOrder,
      });
    }
  };

  return (
    <div>
      <h3>Packages list</h3>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>id</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Weight</TableCell>
              <TableCell>Price</TableCell>

              <TableCell>
                <IconButton
                  onClick={() => setModalState(true)}
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                >
                  <AddIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          </TableHead>

          <Modal
            open={modalState}
            onClose={() => setModalState(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box
              sx={{
                width: "450px",
                paddingBottom: "40px",
                backgroundColor: "white",
                top: "20%",
                left: "30%",
                position: "absolute",
              }}
            >
              <FormControl style={{ marginTop: "20px", marginLeft: "15px" }}>
                <InputLabel htmlFor="customer-id">Customer Id</InputLabel>
                <Input
                  value={packCustomerId}
                  onChange={(e) => setPackCustomerId(e.target.value)}
                  id="customer-id"
                  aria-describedby="my-helper-text"
                />
              </FormControl>

              <FormControl style={{ marginTop: "20px", marginLeft: "15px" }}>
                <InputLabel htmlFor="customer-name">Customer Name</InputLabel>
                <Input
                  value={packCustomerName}
                  onChange={(e) => setPackCustomerName(e.target.value)}
                  id="customer-name"
                  aria-describedby="my-helper-text"
                />
              </FormControl>

              <FormControl style={{ marginTop: "20px", marginLeft: "15px" }}>
                <InputLabel htmlFor="pack-Weight">Package weight</InputLabel>
                <Input
                  value={packWeight}
                  onChange={(e) => setPackWeight(e.target.value)}
                  id="pack-Weight"
                  aria-describedby="my-helper-text"
                />
                <FormHelperText id="my-helper-text">
                  Please enter weight in kg
                </FormHelperText>
              </FormControl>

              <FormControl style={{ marginTop: "20px", marginLeft: "15px" }}>
                <InputLabel htmlFor="pack-Price">Package price</InputLabel>
                <Input
                  value={packPrice}
                  onChange={(e) => setPackPrice(e.target.value)}
                  id="pack-Price"
                  aria-describedby="my-helper-text"
                />
                <FormHelperText id="my-helper-text">
                  Please enter price in usd
                </FormHelperText>
              </FormControl>

              <FormControl style={{ marginTop: "20px", marginLeft: "15px" }}>
                <InputLabel htmlFor="pack-order">Shipping Order</InputLabel>
                <Input
                  value={packShippingOrder}
                  onChange={(e) => setPackShippingOrder(e.target.value)}
                  id="pack-order"
                  aria-describedby="my-helper-text"
                />
              </FormControl>
              <Button
                variant="contained"
                style={{ marginLeft: "20px", marginTop: "30px" }}
                onClick={addPackage}
              >
                Add Package
              </Button>
            </Box>
          </Modal>

          <TableBody>
            {appData &&
              appData.packages.map((row, index) => {
                return (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {invoiceObj[row.customerid] &&
                        invoiceObj[row.customerid].name}
                    </TableCell>
                    <TableCell>{row.weight}kg</TableCell>

                    <TableCell>${row.price}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() =>
                          dispatch({ type: "REMOVE_PACKAGE", packageEl: row })
                        }
                        variant="contained"
                      >
                        Delete
                      </Button>

                      <i
                        onClick={(e) => {
                          dispatch({
                            type: "CHANGE_ORDER",
                            direction: "up",
                            index,
                          });
                        }}
                        className="up"
                        style={{ cursor: "pointer", marginLeft: "20px" }}
                      >
                        <ArrowUpwardIcon />
                      </i>
                      <i
                        onClick={(e) => {
                          dispatch({
                            type: "CHANGE_ORDER",
                            direction: "down",
                            index,
                          });
                        }}
                        className="down"
                        style={{ cursor: "pointer", marginLeft: "20px" }}
                      >
                        <ArrowDownwardIcon />
                      </i>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
