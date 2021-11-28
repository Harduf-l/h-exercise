import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import OneInvoice from "../components/OneInvoice.js";

export default function Invoices({ invoiceObj }) {
  let invoices = Object.keys(invoiceObj);
  return (
    <div>
      {invoices.map((el) => {
        return (
          <div>
            <OneInvoice elID={el} invoiceObj={invoiceObj} />
            <hr />
          </div>
        );
      })}
    </div>
  );
}

//  invoices data in a table - if necessary ////

/* <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Customer Name</TableCell>
              <TableCell>Total Weight</TableCell>
              <TableCell>Total Price</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.map((row) => {
              return (
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell>{row.totalWeight}kg</TableCell>
                  <TableCell>${row.totalPrice}</TableCell>
                  <TableCell>
                    <Link
                      to={`/printInvoice/${row.id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <Button variant="contained">Print invoice</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer> */
