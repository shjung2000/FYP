import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Button, CardMedia } from "@mui/material";
import "./home.css";

function Home() {
    // THIS CODE IS IMPORTANT FROM HERE
    let location = useLocation();
    const pictures = [
        "https://i.imgur.com/3hoca6H.jpg",
        "https://i.imgur.com/2gfJw9o.png",
        "https://insanelygoodrecipes.com/wp-content/uploads/2020/12/Korean-Side-Dishes.png",
    ];
    const [currentPicture, setCurrentPicture] = useState(0);
    useEffect(() => {
        if (location.hash) {
            let elem = document.getElementById(location.hash.slice(1));
            if (elem) {
                elem.scrollIntoView({ behavior: "smooth" });
            }
        } else {
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        }
    }, [location]);

    useEffect(() => {
        const timer = setTimeout(() => {
            changePictureOnRight();
        }, 2000);
        return () => clearTimeout(timer);
    });

    const changePictureOnRight = () => {
        if (currentPicture == pictures.length - 1) {
            changePicture(0);
        } else {
            changePicture(currentPicture + 1);
        }
    };

    const changePictureOnLeft = () => {
        if (currentPicture == 0) {
            changePicture(pictures.length - 1);
        } else {
            changePicture(currentPicture - 1);
        }
    };

    // to add animation
    const [opacity, setOpacity] = useState(1);
    const changePicture = (newPicture) => {
        setOpacity(0);
        const timer = setTimeout(() => {
            setCurrentPicture(newPicture);
            setOpacity(1);
        }, 350);
        return () => clearTimeout(timer);
    };

    const { pathname } = useLocation();
    if (pathname === "/reserve") {
        return <></>;
    } else {
        return (
            <>
                {/* // THIS CODE IS IMPORTANT UNTIL HERE  */}
                <div className="home-div" id="home-div">
                    <CardMedia
                        component={"img"}
                        src={pictures[currentPicture]}
                        className="home-background"
                        sx={{
                            height: {
                                xs: "40vh",
                                sm: "50vh",
                                md: "80vh",
                                lg: "100vh",
                            },
                            opacity: opacity,
                        }}
                    />
                    <div className="home-centered-text">
                        Delivering the most authentic Korean taste
                    </div>
                    <div className="arrowButtonContainer">
                        <Button
                            sx={{ color: "white" }}
                            onClick={() => {
                                changePictureOnLeft();
                            }}
                        >
                            <ArrowBackIosIcon />
                        </Button>
                        <Button
                            sx={{ color: "white" }}
                            onClick={() => {
                                changePictureOnRight();
                            }}
                        >
                            <ArrowForwardIosIcon />
                        </Button>
                    </div>
                </div>
            </>
        );
    }
}

export default Home;
