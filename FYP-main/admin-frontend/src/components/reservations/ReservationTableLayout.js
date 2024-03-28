import React, {
    useEffect,
    useState,
    useCallback,
    useRef,
    useMemo,
} from "react";
import "./ReservationTableLayout.css";
import TableCellComponent from "./TableCellComponent";
import ReactDOM from "react-dom/client";
import Typography from "@mui/material/Typography";
import { createRoot } from "react-dom/client";
import axios from "axios";
import { render } from "react-dom";

function ReservationTableLayout({ date, time }) {
    const [resultDict, setResultDict] = useState({});
    const [loading, setLoading] = useState(false);

    const timeConverter = (time) => {
        time = time.toString();
        const hours = time.substr(0, 2);
        const minutes = time.substr(2);
        if (minutes == "50") {
            return hours + "30";
        } else {
            return hours + "00";
        }
    };

    const timeConverterReverse = (time) => {
        time = time.toString();
        const hours = time.substr(0, 2);
        const minutes = time.substr(2);
        if (minutes == "30") {
            return parseInt(hours + "50");
        } else {
            return parseInt(hours + "00");
        }
    };

    const combineTables = async (resultDict) => {
        await fetch(
            `${process.env.REACT_APP_BACKEND_URL}reservation/getTableCombination`,
            {
                crossDomain: true,
                method: "POST",
                body: JSON.stringify({
                    date,
                    time,
                }),
                headers: { "Content-Type": "application/json" },
            }
        )
            .then((response) => response.json())
            .then((tableIDs) => {
                for (let i = 1; i < 17; i++) {
                    clearTables(i);
                }
                var empty1 = document.getElementById("empty1");
                empty1.colSpan = 15;

                for (let combination of tableIDs) {
                    if (combination.length == 2) {
                        var firstTable = document.getElementById(
                            combination[0]
                        );
                        var secondTable = document.getElementById(
                            combination[1]
                        );
                        var leftOfSecondTable = document.getElementById(
                            combination[1] + "l"
                        );

                        // special case - 13 move diagonally right when it's [13, 16]
                        if (
                            JSON.stringify(combination) ===
                            JSON.stringify([13, 16])
                        ) {
                            firstTable.classList = "emptySpace";
                            secondTable.classList = "custTable taken";
                            leftOfSecondTable.classList = "custTable taken";

                            var emptyspace = document.getElementById("empty1");
                            emptyspace.colSpan = 8;
                            leftOfSecondTable.colSpan = 8;

                            firstTable.innerText = "";

                            // leftOfSecondTable.innerText = combination[0] + "";
                            renderTable(
                                combination[1] + "l",
                                combination[1],
                                combination[0] + "",
                                resultDict
                            );
                        }

                        // normal case - 2nd table moves left
                        else {
                            if (is4PaxTable(combination[1])) {
                                leftOfSecondTable.colSpan = 4;
                            } else {
                                leftOfSecondTable.colSpan = 2;
                            }
                            secondTable.colSpan = 1;

                            firstTable.classList = "custTable taken";
                            secondTable.classList = "emptySpace";
                            leftOfSecondTable.classList = "custTable taken";

                            secondTable.innerText = "";
                            // leftOfSecondTable.innerText = combination[1] + "";
                            renderTable(
                                combination[1] + "l",
                                combination[1],
                                combination[1] + "",
                                resultDict
                            );
                        }
                    } else if (combination.length == 3) {
                        var firstTable = document.getElementById(
                            combination[0]
                        );
                        var secondTable = document.getElementById(
                            combination[1]
                        );
                        var leftOfSecondTable = document.getElementById(
                            combination[1] + "l"
                        );
                        var thirdTable = document.getElementById(
                            combination[2]
                        );
                        var leftOfThirdTable = document.getElementById(
                            combination[2] + "l"
                        );

                        if (is4PaxTable(combination[0])) {
                            leftOfSecondTable.colSpan = 4;
                        } else {
                            leftOfSecondTable.colSpan = 2;
                        }

                        if (is4PaxTable(combination[2])) {
                            leftOfThirdTable.colSpan = 4;
                        } else {
                            leftOfThirdTable.colSpan = 2;
                        }
                        firstTable.colSpan = 1;
                        thirdTable.colSpan = 1;

                        firstTable.classList = "emptySpace";
                        leftOfSecondTable.classList = "custTable taken";
                        secondTable.classList = "custTable taken";
                        leftOfThirdTable.classList = "custTable taken";
                        thirdTable.classList = "emptySpace";

                        firstTable.innerText = "";

                        leftOfSecondTable.innerText = combination[0] + "";
                        renderTable(
                            combination[1] + "l",
                            combination[1],
                            combination[0] + "",
                            resultDict
                        );

                        leftOfThirdTable.innerText = combination[2] + "";
                        renderTable(
                            combination[2] + "l",
                            combination[2],
                            combination[2] + "",
                            resultDict
                        );

                        thirdTable.innerText = "";
                    } else if (combination.length == 4) {
                        var firstTable = document.getElementById(
                            combination[0]
                        );
                        var secondTable = document.getElementById(
                            combination[1]
                        );
                        var thirdTable = document.getElementById(
                            combination[2]
                        );
                        var fourthTable = document.getElementById(
                            combination[3]
                        );
                        var leftOfFourthTable = document.getElementById(
                            combination[3] + "l"
                        );

                        firstTable.classList = "emptySpace";
                        secondTable.classList = "emptySpace";
                        thirdTable.classList = "custTable taken";
                        fourthTable.classList = "custTable taken";
                        leftOfFourthTable.classList = "custTable taken";

                        firstTable.innerText = "";
                        secondTable.innerText = "";

                        thirdTable.innerText = combination[1] + "";
                        renderTable(
                            combination[2] + "l",
                            combination[2],
                            combination[1] + "",
                            resultDict
                        );

                        leftOfFourthTable.innerText = combination[2] + "";
                        renderTable(
                            combination[3] + "l",
                            combination[3],
                            combination[2] + "",
                            resultDict
                        );

                        // first combination - [1, 2, 3, 4]
                        if (
                            JSON.stringify(combination) ===
                            JSON.stringify([1, 2, 3, 4])
                        ) {
                            var leftOfThirdTable =
                                document.getElementById("jointable1");
                            leftOfThirdTable.classList = "custTable taken";
                            leftOfThirdTable.innerText = combination[0] + "";
                            renderTable(
                                "jointable1",
                                combination[0],
                                combination[0] + "",
                                resultDict
                            );

                            firstTable.colSpan = 1;
                            secondTable.colSpan = 1;
                            leftOfThirdTable.colSpan = 2;
                            leftOfFourthTable.colSpan = 2;
                        }

                        // second combination - [2, 3, 4, 11]
                        else if (
                            JSON.stringify(combination) ===
                            JSON.stringify([2, 3, 4, 11])
                        ) {
                            var leftOfThirdTable =
                                document.getElementById("4l");
                            leftOfThirdTable.classList = "custTable taken";

                            leftOfThirdTable.innerText = combination[0] + "";
                            renderTable(
                                "4l",
                                combination[0],
                                combination[0] + "",
                                resultDict
                            );

                            firstTable.colSpan = 1;
                            secondTable.colSpan = 1;
                            leftOfThirdTable.colSpan = 2;
                            thirdTable.colSpan = 2;
                            leftOfFourthTable.colSpan = 2;
                        }
                    } else if (combination.length == 1) {
                        let table = document.getElementById(combination[0]);
                        table.classList = "custTable taken";
                    }
                }
                const elements = document.getElementsByClassName("taken");

                for (let i = 0; i < elements.length; i++) {
                    const currTable = elements[i];

                    if (
                        currTable.innerText &&
                        currTable.innerText !== "" &&
                        currTable.innerText !== " "
                    ) {
                        const tableNum = currTable.innerText;
                        renderTable(
                            currTable.id,
                            tableNum,
                            tableNum,
                            resultDict
                        );
                    }
                }
            })
            .catch((error) => {
                console.error("Error", error);
            });
    };

    const clearTables = (tableid) => {
        let tabletd = document.getElementById(tableid);
        let withoutLeftTables = [1, 2, 5, 8, 12, 6, 7, 14];
        if (!withoutLeftTables.includes(tableid)) {
            let leftOfTable = document.getElementById(tableid + "l");
            leftOfTable.classList = "emptySpace";
            leftOfTable.innerText = "";
            leftOfTable.colSpan = 1;
        }
        tabletd.classList = "custTable";
        tabletd.innerText = tableid;

        if (is4PaxTable(tableid) && tableid != 12) {
            tabletd.colSpan = 4;
        } else {
            tabletd.colSpan = 2;
        }
    };

    const is4PaxTable = (tableid) => {
        if (tableid <= 16 && tableid > 7) {
            return true;
        }
        return false;
    };

    const renderTable = (id, tableNum, text, resultDict) => {
        const root = document.getElementById(id);
        if (!root.hasOwnProperty("_reactRootContainer")) {
            ReactDOM.createRoot(root).render(
                <TableCellComponent
                    resultDict={resultDict}
                    tableNum={tableNum}
                    text={text}
                />
            );
        }
    };

    const getReservationInfo = async () => {
        setLoading(true);
        await axios
            .get(`${process.env.REACT_APP_BACKEND_URL}reservation/`)
            .then(async (res) => {
                const newDict = {};
                var updatedData = res.data;
                for (const jsonObj of updatedData) {
                    if (
                        jsonObj.status === 1 &&
                        jsonObj.date_of_visit === date &&
                        jsonObj.time === time &&
                        jsonObj.tableID.length >= 1
                    ) {
                        for (const tableID of jsonObj.tableID) {
                            newDict[tableID] = [jsonObj.name, jsonObj.phone];
                        }
                    }
                }
                await combineTables(newDict);

                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    useEffect(() => {
        getReservationInfo();
    }, [date, time]);
    useEffect(() => {
        getReservationInfo();
    }, []);
    return (
        <div>
            <Typography variant="h5" textAlign={"center"}>
                Floor plan
            </Typography>
            <div
                style={{
                    width: "600px",
                    padding: "5px",
                    // background: "black",
                    margin: "20px auto",
                    overflow: "scroll",
                }}
            >
                <div class={"topTableArea"} style={{ float: "right" }}>
                    <div
                        style={{
                            width: "350px",
                            height: "250px",
                            background: "white",
                            transform: "rotate(10deg)",
                            transformOrigin: "0 100%",
                        }}
                    >
                        <table
                            style={{
                                width: "100%",
                                border: "1px black solid",
                                borderRight: "none",
                                borderBottom: "none",
                            }}
                        >
                            <tbody>
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="custTable"
                                        id="14"
                                    >
                                        {/* 14 */}
                                        <TableCellComponent
                                            resultDict={resultDict}
                                            tableNum={14}
                                            text={14}
                                        />
                                    </td>
                                    <td
                                        colSpan={1}
                                        className="emptySpace"
                                        id="15l"
                                    ></td>
                                    <td
                                        colSpan={11}
                                        className="emptySpace"
                                    ></td>
                                    <td
                                        colSpan={4}
                                        className="custTable"
                                        style={{
                                            borderRight: "1px black solid",
                                        }}
                                        id="15"
                                    >
                                        {/* 15 */}
                                        <TableCellComponent
                                            resultDict={resultDict}
                                            tableNum={15}
                                            text={15}
                                        />
                                    </td>
                                </tr>
                                <tr style={{ border: "none" }}>
                                    <td
                                        colSpan={20}
                                        className="emptySpace"
                                        style={{
                                            borderRight: "1px black solid",
                                        }}
                                    ></td>
                                </tr>
                                <tr>
                                    <td
                                        colSpan={2}
                                        className="custTable"
                                        id="7"
                                    >
                                        {/* 7 */}
                                        <TableCellComponent
                                            resultDict={resultDict}
                                            tableNum={7}
                                            text={7}
                                        />
                                    </td>
                                    <td
                                        colSpan={1}
                                        className="emptySpace"
                                        id="13l"
                                    ></td>
                                    <td colSpan={1} className="emptySpace"></td>
                                    <td
                                        colSpan={4}
                                        className="custTable"
                                        id="13"
                                    >
                                        {/* 13 */}
                                        <TableCellComponent
                                            resultDict={resultDict}
                                            tableNum={13}
                                            text={13}
                                        />
                                    </td>
                                    <td
                                        colSpan={12}
                                        className="emptySpace"
                                        style={{
                                            borderRight: "1px black solid",
                                        }}
                                    ></td>
                                </tr>
                                <tr>
                                    <td
                                        colSpan={15}
                                        className="emptySpace"
                                        id="empty1"
                                    ></td>
                                    <td
                                        colSpan={1}
                                        className="custTable"
                                        id="16l"
                                    ></td>
                                    <td
                                        colSpan={4}
                                        className="custTable"
                                        style={{
                                            borderRight: "1px black solid",
                                        }}
                                        id="16"
                                    >
                                        {/* 16 */}
                                        <TableCellComponent
                                            resultDict={resultDict}
                                            tableNum={16}
                                            text={16}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                        className="custTable"
                                        id="6"
                                        colSpan={2}
                                    >
                                        {/* 6 */}
                                        <TableCellComponent
                                            resultDict={resultDict}
                                            tableNum={6}
                                            text={6}
                                        />
                                    </td>
                                    <td
                                        colSpan={18}
                                        className="emptySpace"
                                    ></td>
                                </tr>
                                <tr className="measureRow">
                                    <td colSpan={20}></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div
                        style={{
                            width: "500px",
                            height: "100px",
                            background: "white",
                            left: "10",
                        }}
                        id={"middlePart"}
                    >
                        <table
                            style={{
                                width: "100%",
                                tableLayout: "fixed",
                                borderBottom: "none",
                            }}
                        >
                            <tbody>
                                <tr
                                    style={{
                                        border: "none",
                                        height: "40px",
                                    }}
                                    className="measureRow"
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

                                    <td
                                        colSpan={1}
                                        style={{
                                            borderTop: "1px black solid",
                                        }}
                                    ></td>
                                    <td
                                        colSpan={1}
                                        style={{
                                            borderTop: "1px black solid",
                                        }}
                                    ></td>
                                    <td
                                        colSpan={1}
                                        style={{
                                            borderTop: "1px black solid",
                                        }}
                                    ></td>
                                    <td
                                        colSpan={1}
                                        style={{
                                            borderTop: "1px black solid",
                                        }}
                                    ></td>
                                </tr>
                                <tr>
                                    <td
                                        colSpan={2}
                                        className="custTable"
                                        id="12"
                                    >
                                        {/* 12 */}
                                        <TableCellComponent
                                            resultDict={resultDict}
                                            tableNum={12}
                                            text={12}
                                        />
                                    </td>
                                    <td
                                        colSpan={11}
                                        className="emptySpace"
                                    ></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    {/* 450 /9 = 50 */}
                    <div
                        style={{
                            width: "500px",
                            // height: "300px",
                            background: "white",
                            left: "10",
                        }}
                        id="bottomBox"
                    >
                        <table
                            style={{
                                width: "100%",
                                tableLayout: "fixed",
                                borderBottom: "none",
                            }}
                        >
                            {" "}
                            <tr
                                style={{
                                    border: "none",
                                    height: "1px",
                                }}
                                className="measureRow"
                            ></tr>
                            <tr
                                style={{ border: "none" }}
                                className="measureRow"
                            >
                                <td colSpan={8}></td>
                                <td colSpan={12}>
                                    <hr />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={4} className="custTable" id="8">
                                    {/* 8 */}
                                    <TableCellComponent
                                        resultDict={resultDict}
                                        tableNum={8}
                                        text={8}
                                    />
                                </td>
                                <td colSpan={3} className="emptySpace"></td>
                                <td
                                    colSpan={1}
                                    className="emptySpace"
                                    id="5l"
                                ></td>
                                <td colSpan={2} className="custTable" id="5">
                                    {/* 5 */}
                                    <TableCellComponent
                                        resultDict={resultDict}
                                        tableNum={5}
                                        text={5}
                                    />
                                </td>
                                <td
                                    colSpan={1}
                                    className="emptySpace"
                                    id="9l"
                                ></td>
                                <td colSpan={4} className="custTable" id="9">
                                    {/* 9 */}
                                    <TableCellComponent
                                        resultDict={resultDict}
                                        tableNum={9}
                                        text={9}
                                    />
                                </td>
                                <td
                                    colSpan={1}
                                    className="emptySpace"
                                    id="10l"
                                ></td>
                                <td colSpan={4} className="custTable" id="10">
                                    {/* 10 */}
                                    <TableCellComponent
                                        resultDict={resultDict}
                                        tableNum={10}
                                        text={10}
                                    />
                                </td>
                            </tr>
                            <tr
                                style={{
                                    border: "none",
                                    height: "10px",
                                }}
                                className="measureRow"
                            >
                                <td colSpan={20} className="emptySpace"></td>
                            </tr>
                            <tr>
                                <td colSpan={2} className="custTable" id="1">
                                    {/* 1 */}
                                    <TableCellComponent
                                        resultDict={resultDict}
                                        tableNum={1}
                                        text={1}
                                    />
                                </td>
                                <td
                                    colSpan={1}
                                    className="emptySpace"
                                    id="2l"
                                ></td>
                                <td colSpan={2} className="custTable" id="2">
                                    {/* 2 */}
                                    <TableCellComponent
                                        resultDict={resultDict}
                                        tableNum={2}
                                        text={2}
                                    />
                                </td>
                                <td
                                    colSpan={1}
                                    className="emptySpace"
                                    id="3l"
                                ></td>
                                <td
                                    colSpan={3}
                                    className="emptySpace"
                                    id="jointable1"
                                ></td>
                                <td colSpan={2} className="custTable" id="3">
                                    {/* 3 */}
                                    <TableCellComponent
                                        resultDict={resultDict}
                                        tableNum={3}
                                        text={3}
                                    />
                                </td>
                                <td
                                    colSpan={1}
                                    className="emptySpace"
                                    id="4l"
                                ></td>
                                <td colSpan={2} className="custTable" id="4">
                                    {/* 4 */}
                                    <TableCellComponent
                                        resultDict={resultDict}
                                        tableNum={4}
                                        text={4}
                                    />
                                </td>
                                <td
                                    colSpan={1}
                                    className="emptySpace"
                                    id="11l"
                                ></td>
                                <td colSpan={4} className="custTable" id="11">
                                    {/* 11 */}
                                    <TableCellComponent
                                        resultDict={resultDict}
                                        tableNum={11}
                                        text={11}
                                    />
                                </td>
                                <td colSpan={1} className="emptySpace"></td>
                            </tr>
                            <tr
                                style={{
                                    border: "none",
                                    height: "10px",
                                }}
                                className="measureRow"
                            >
                                <td colSpan={20} className="emptySpace"></td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div class={"entranceArea"} style={{ float: "right" }}>
                    <div
                        style={{
                            width: "600px",
                            height: "60px",
                            background: "white",
                        }}
                    >
                        <table>
                            <tr className="bottomTopBorder">
                                <td
                                    colSpan={2}
                                    style={{
                                        borderTop: "1px black solid",
                                    }}
                                ></td>
                                <td colSpan={2}></td>
                                <td colSpan={2}></td>
                                <td colSpan={2}></td>
                                <td colSpan={2}></td>
                                <td colSpan={2}></td>
                            </tr>
                            <tr>
                                {" "}
                                <td colSpan={6} style={{ border: "none" }}>
                                    Entrance
                                </td>
                                <td colSpan={1} className="emptySpace"></td>
                                <td colSpan={4}>Counter</td>
                                <td colSpan={1} className="emptySpace"></td>
                            </tr>
                            <tr style={{ height: "5px" }}> </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReservationTableLayout;
