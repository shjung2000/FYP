import React, { useState, useEffect, useRef } from "react";
import { Grid, Card, Typography, CardContent } from "@mui/material";
import "./MenuItem.css";
// props:
// menuImage --> url of the image
// menuItemName --> name of the menu item
// menuItemPrice --> price of the menu item
// menuItemDescription --> description of the menu item

const imageProperties = {
    backgroundSize: "100% 100%",
};

function MenuItem({ menuImage, menuItemName, menuItemPrice, setMenuItemSize }) {
    const { backgroundSize } = imageProperties;
    const [isHovered, setIsHovered] = useState(false);

    const ref = useRef(null);

    useEffect(() => {
        const handleWindowResize = () => {
            // setWindowWidth(window.innerWidth);
            setMenuItemSize(ref.current.offsetWidth);
        };
        window.addEventListener("resize", handleWindowResize);
    });
    useEffect(() => {
        setMenuItemSize(ref.current.offsetWidth);
    }, []);
    return (
        <Grid item xs={6} sm={6} md={4}>
            <div ref={ref}>
                <Card
                    className="menuItemContainer"
                    referrerPolicy="no-referrer"
                    sx={{
                        backgroundImage: `url(${menuImage})`,
                        transition: "background 0.3s, color 0.3s",
                        "&:hover": {
                            background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)),url(${menuImage}) `,
                            color: "white",
                            backgroundSize,
                        },
                        backgroundSize,
                        backgroundPosition: "center",
                        // aspectRatio: 1,
                        height: "100%",
                        width: "100%",
                        margin: "0 auto",
                        display: "flex",
                        alignItems: "end",
                    }}
                    onMouseEnter={() => {
                        setIsHovered(true);
                    }}
                    onMouseLeave={() => {
                        setIsHovered(false);
                    }}
                >
                    <CardContent
                        sx={{
                            width: "100%",
                        }}
                    >
                        {isHovered ? (
                            <>
                                <Typography
                                    variant={"h6"}
                                    textAlign={"center"}
                                    style={{
                                        width: "100%",
                                        // background: "rgba(0,0,0,0.5)",
                                    }}
                                >
                                    {menuItemName}
                                </Typography>
                                <Typography
                                    variant={"h6"}
                                    textAlign={"center"}
                                    style={{
                                        width: "100%",
                                        // background: "rgba(0,0,0,0.5)",
                                    }}
                                >
                                    {menuItemPrice}
                                </Typography>
                            </>
                        ) : (
                            <></>
                        )}
                    </CardContent>
                </Card>
            </div>
        </Grid>
    );
}

export default MenuItem;
