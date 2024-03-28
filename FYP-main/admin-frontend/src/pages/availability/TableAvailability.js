import React from "react";
import { Container } from "@mui/system";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import "./TableAvailability.css";
import { useLocation } from "react-router-dom";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Button } from "@mui/material";


const TableAvailability = () => {
  const location = useLocation();
  const topRectangle = {
    width: "500px",
    height: "200px",
    backgroundColor: "white",
    borderTop: "3px solid black",
    borderRight: "3px solid black",
    borderLeft: "3px solid black",
    transform: "rotate(15deg)",
    transformOrigin: "center",
    marginLeft: "100px",
  };

  const middleRectangle = {
    width: "500px",
    height: "120px",
    // backgroundColor: "red",
    borderLeft: "3px solid black",
    transformOrigin: "center",
    transform: "rotate(15deg)",
    marginLeft: "59px",
    marginTop: "-10px",
  };

  const bottomRectangle = {
    width: "700px",
    height: "350px",
    backgroundColor: "white",
    borderLeft: "3px solid black",
    transformOrigin: "center",
    marginLeft: "52px",
    marginTop: "-70px",
  };

  const rightSlantedBorder = {
    height: "150px",
    backgroundColor: "white",
    borderLeft: "3px solid black",
    transformOrigin: "center",
    transform: "rotate(-60deg)",
    marginLeft: "462px",
    marginTop: "-663px",
  };

  const rightVerticalBorder = {
    width: "8px",
    height: "320px",
    backgroundColor: "white",
    borderLeft: "3px solid black",
    transformOrigin: "center",
    marginLeft: "700px",
    marginTop: "260px",
  };

  const entrance = {
    width: "100px",
    height: "65px",
    backgroundColor: "white",
    borderTop: "3px solid black",
    borderBottom: "3px solid black",
    transformOrigin: "center",
    marginLeft: "-45px",
    marginTop: "-70px",
    display: "flex",
    justifyContent: "center",
  };

  const entranceText = {
    fontSize: "20px",
    alignSelf: "center",
  };

  const counterSection = {
    width: "645px",
    height: "60px",
    backgroundColor: "white",
    borderBottom: "3px solid black",
    transformOrigin: "center",
    marginLeft: "55px",
    marginTop: "-63px",
  };

  const counter = {
    width: "350px",
    height: "40px",
    backgroundColor: "white",
    border: "2px solid black",
    transformOrigin: "center",
    marginLeft: "230px",
    marginBottom: "0px",
    padding: "5px",
    display: "flex",
    justifyContent: "center",
  };

  const counterText = {
    alignSelf: "center",
    fontSize: "20px",
  };

  return (
    <>
      <Container sx={{ mt: 8 }}>
        <div style={topRectangle}>
          <table
            style={{
              width: "500px",
              borderBottom: "none",
              borderRight: "none",
            }}
          >
            <tbody>
              <tr
                className="measurementRow"
                style={{ height: "1px", border: "none" }}
              >
                <td colSpan={1}></td>
                <td colSpan={1}></td>
                <td colSpan={1}></td>
                <td colSpan={1}></td>
                <td colSpan={1}></td>
                <td colSpan={1}></td>
                <td colSpan={1}></td>
              </tr>
              <tr>
                <td height="50" className="table" colSpan={2}>
                  4 pax
                </td>
                <td colSpan={3} className="emptySpace"></td>
                <td colSpan={2} className="table">
                  4 pax
                </td>
              </tr>
              <tr style={{ border: "none" }}>
                <td height="25" colSpan={7} className="emptySpace"></td>
              </tr>
              <tr>
                <td height="50" colSpan={1} className="table">
                  2 pax
                </td>
                <td colSpan={1} className="emptySpace"></td>
                <td colSpan={2} className="table">
                  4 pax
                </td>
                <td colSpan={3} className="emptySpace"></td>
              </tr>
              <tr>
                <td height="50" colSpan={5} className="emptySpace"></td>
                <td colSpan={2} className="table">
                  4pax
                </td>
              </tr>
              <tr>
                <td height="50" className="table">
                  2pax
                </td>
                <td colSpan={6} className="emptySpace"></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style={middleRectangle}></div>
        <div style={bottomRectangle}>
          <table style={{ width: "650px", borderBottom: "none" }}>
            <tbody>
              <tr
                className="measurementRow"
                style={{ height: "80px", border: "none" }}
              >
                <td colSpan={1}></td>
                <td colSpan={1}></td>
                <td colSpan={1}></td>
                <td colSpan={1}></td>
                <td colSpan={1}></td>
                <td colSpan={1}></td>
                <td colSpan={1}></td>
                <td colSpan={1}></td>
                <td colSpan={1}></td>
                <td colSpan={1}></td>
                <td colSpan={1}></td>
                <td colSpan={1}></td>
                <td colSpan={1}></td>
                <td colSpan={1}></td>
                <td colSpan={1}></td>
                <td colSpan={1}></td>
                <td colSpan={1}></td>
                <td colSpan={1}></td>
                <td colSpan={1}></td>
                <td colSpan={1}></td>
                <td colSpan={1}></td>
                <td colSpan={1}></td>
                <td colSpan={1}></td>
                <td colSpan={1}></td>
                <td colSpan={1}></td>
                <td colSpan={1}></td>
                <td colSpan={1}></td>
                <td colSpan={1}></td>
                <td colSpan={1}></td>
                <td colSpan={1}></td>
                <td colSpan={1}></td>
                <td colSpan={1}></td>
                <td colSpan={1}></td>
                <td colSpan={1}></td>
                <td colSpan={1}></td>
                <td colSpan={1}></td>
              </tr>
              <tr>
                <td height="50" colSpan={8} className="table">
                  4 pax
                </td>
                <td colSpan={28} className="emptySpace"></td>
              </tr>
              <tr style={{ border: "none" }}>
                <td height="25" colSpan={4} className="emptySpace">
                  <hr></hr>
                </td>
                <td height="25" colSpan={10} className="emptySpace"></td>
                <td height="25" colSpan={22} className="emptySpace">
                  <hr></hr>
                </td>
              </tr>
              <tr>
                <td height="50" colSpan={8} className="table">
                  4 pax
                </td>
                <td colSpan={6} className="emptySpace"></td>
                <td colSpan={4} className="table">
                  2 pax
                </td>
                <td colSpan={1} className="emptySpace"></td>
                <td height="50" colSpan={8} className="table">
                  4 pax
                </td>
                <td colSpan={1} className="emptySpace"></td>
                <td height="50" colSpan={8} className="table">
                  4 pax
                </td>
              </tr>
              <tr>
                <td height="25" colSpan={36} className="emptySpace"></td>
              </tr>
              <tr>
                <td height="50" colspan={4} className="table">
                  2pax
                </td>
                <td colSpan={1} className="emptySpace"></td>
                <td height="50" colspan={4} className="table">
                  2pax
                </td>
                <td colSpan={5} className="emptySpace"></td>
                <td height="50" colspan={4} className="table">
                  2pax
                </td>
                <td colSpan={3} className="emptySpace"></td>
                <td height="50" colspan={4} className="table taken">
                  2pax
                </td>
                <td colSpan={3} className="emptySpace"></td>
                <td height="50" colSpan={8} className="table">
                  4 pax
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style={rightSlantedBorder}></div>
        <div style={rightVerticalBorder}></div>
        <div style={entrance}>
          <p style={entranceText}>Entrance</p>
        </div>
        <div style={counterSection}>
          <div style={counter}>
            <p style={counterText}>Counter</p>
          </div>
        </div>
        {/* Click the button to see combined layout */}
        <div>
          {location.pathname === "/AdminInterface" ? (
            <button style={{ marginTop: "50px" }}>
              <a class="roboto" href="/">
                <h1>Click here to go back to just the layout</h1>
              </a>
            </button>
          ) : (
            <button style={{ marginTop: "50px" }}>
              <a class="roboto" href="/AdminInterface">
                <h1>Click here to see combined layout</h1>
              </a>
            </button>
          )}
        </div>
      </Container>
    </>
  );
};

export default TableAvailability;
