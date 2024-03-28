import React from "react";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
function TableCellComponent({ tableNum, resultDict, text }) {
    return (
        <Tooltip
            title={
                resultDict.hasOwnProperty(tableNum) ? (
                    <>
                        {" "}
                        <Typography fontSize={22}>
                            {"Name:" + resultDict[tableNum][0]}
                        </Typography>
                        <Typography fontSize={22}>
                            {"Phone Number:" + resultDict[tableNum][1]}
                        </Typography>
                    </>
                ) : (
                    "N/A"
                )
            }
        >
            <Box>{text}</Box>
        </Tooltip>
    );
}

export default TableCellComponent;
