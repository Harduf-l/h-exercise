import React, { useContext } from "react";
import { myContextObject } from "../context/MyContext";

import { useParams } from "react-router-dom";

export default function OneInvoice() {
  const { invoiceObj } = useContext(myContextObject);
  let { id } = useParams();

  return (
    <div className="bigInvoiceDiv">
      {invoiceObj[id] && (
        <div>
          <div className="headerInvoice">
            <span className="dateObj">{invoiceObj[id].invoiceDate}</span>
            <span className="invoiceBigger widthFixed">Invoice</span>
          </div>
          <div className="headerInvoice">
            <span className="dateObj">{invoiceObj[id].name}</span>
            <span className="widthFixed">No. {invoiceObj[id].invoiceId}</span>
          </div>

          <div className="contentPackages">
            <div className="generalDiv">
              <span className="tableTH">ID</span>
              {invoiceObj[id].packages.map((el) => {
                return <div className="marginTD">{el.id}</div>;
              })}
            </div>
            <div className="generalDiv">
              <span className="tableTH">Weight</span>

              {invoiceObj[id].packages.map((el) => {
                return <div className="marginTD">{el.weight}kg</div>;
              })}
              <div className="paddingTopPlz">
                {invoiceObj[id].totalWeight}kg
              </div>
            </div>

            <div className="priceDiv">
              <span className="tableTH">Price</span>
              {invoiceObj[id].packages.map((el) => {
                return <div className="marginTD">${el.price}</div>;
              })}
              <div className="paddingTopPlz priceBig">
                Total: ${invoiceObj[id].totalPrice}
              </div>
            </div>
          </div>

          <div className="endInvoice">
            <div>You received {invoiceObj[id].packages.length} packages</div>
            <div style={{ marginTop: "5px" }}>
              Thank you for using our services
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
