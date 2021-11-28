import React, { useEffect, useState } from "react";
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
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import FormHelperText from "@mui/material/FormHelperText";

export default function PackageList({
  appData,
  invoiceObj,
  changeOrder,
  removePackage,
  addPackcage,
}) {
  let [myAppData, setAppData] = useState(appData);
  const [sortPackagesByShipping, setsortPackagesByShipping] = useState(true);
  let [packWeight, setPackWeight] = useState("");
  let [packPrice, setPackPrice] = useState("");
  let [packCustomerName, setPackCustomerName] = useState("");
  let [packShippingOrder, setPackShippingOrder] = useState("");
  let [packCustomerId, setPackCustomerId] = useState("");
  let [modalState, setModalState] = useState(false);

  useEffect(() => {
    if (sortPackagesByShipping) {
      appData.packages.sort(function (a, b) {
        return a.shippingOrder - b.shippingOrder;
      });
    }
  }, [appData, sortPackagesByShipping]);

  const sortByShipping = () => {
    let newAppData = { ...appData };
    newAppData.packages.sort(function (a, b) {
      return a.shippingOrder - b.shippingOrder;
    });
    setAppData(newAppData);
    setsortPackagesByShipping(true);
  };

  const addPackage = () => {
    if (packWeight && packPrice && packShippingOrder && packCustomerId && packCustomerName) {
      let newPackWeight = packWeight + "kg";
      let newPackPrice = +packPrice;
      let newPackShippingOrder = +packShippingOrder;
      let newCustomerId = +packCustomerId;
      let newPackId = Date.now();

      setPackCustomerName("")
      setPackWeight("");
      setPackPrice("");
      setPackShippingOrder("");
      setPackCustomerId("");
      setModalState(false);
      addPackcage(
        packCustomerName,
        newPackId,
        newPackWeight,
        newCustomerId,
        newPackPrice,
        newPackShippingOrder
      );
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
                <Button onClick={() => sortByShipping()}>
                  order again by shipping time
                </Button>
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
            {appData.packages.map((row, index) => {
              return (
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.id}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {invoiceObj[row.customerid] &&
                      invoiceObj[row.customerid].name}
                  </TableCell>
                  <TableCell>{row.weight}</TableCell>

                  <TableCell>${row.price}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => removePackage(row.id)}
                      variant="contained"
                    >
                      Delete
                    </Button>

                    <i
                      onClick={(e) => {
                        setsortPackagesByShipping(false);
                        changeOrder("up", index, row);
                      }}
                      className="up"
                      style={{ cursor: "pointer", marginLeft: "20px" }}
                    >
                      <ArrowUpwardIcon />
                    </i>
                    <i
                      onClick={(e) => {
                        setsortPackagesByShipping(false);
                        changeOrder("down", index, row);
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
