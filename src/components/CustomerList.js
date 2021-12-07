import React, { useContext } from "react";

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
import { Link } from "react-router-dom";
export default function CustomerList() {
  const { appData, dispatch } = useContext(myContextObject);
  return (
    <div>
      <h3>Customers list</h3>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>id</TableCell>
              <TableCell>Name</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appData &&
              appData.customers.map((row) => {
                return (
                  <TableRow
                    id={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>
                      <Link
                        to={`/printInvoice/${row.id}`}
                        style={{ textDecoration: "none" }}
                      >
                        <Button variant="contained">Create Invoice</Button>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() =>
                          dispatch({ type: "REMOVE_CLIENT", id: row.id })
                        }
                        variant="contained"
                      >
                        Delete
                      </Button>
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
