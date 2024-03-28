import React, { useState } from "react";
import { Box } from "@mui/material";
import "./PopupPrompt.css";
import "../../../index.css";
import DiningIcon from "@mui/icons-material/Dining";
import { useLocation } from "react-router-dom";

function PopupPrompt() {
    const { pathname } = useLocation();
    const [hovered, setHovered] = useState(false);

    if (pathname === "/reserve") {
        return <></>;
    } else {
        return (
            <Box
                className={`popupContainer hidden-mobile`}
                onClick={() => {
                    window.open("https://qashiereats.com/honeynight");
                }}
                onMouseEnter={() => {
                    setHovered(true);
                }}
                onMouseLeave={() => {
                    setHovered(false);
                }}
                sx={{
                    display: {
                        xs: "none",
                        sm: "block",
                    },
                    fontSize:"18px"
                }}
            >
                {!hovered ? (
                    <>
                        <>Order here</>
                        <hr />
                    </>
                ) : (
                    <></>
                )}

                <Box className="iconContainer">
                    <DiningIcon />
                </Box>
                {hovered ? <>Click to order!</> : <></>}
            </Box>
        );
    }
}

export default PopupPrompt;
