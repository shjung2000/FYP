import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Grid, Box, Button, CardMedia } from "@mui/material";
import aboutPic from "../../../images/HoneyNightBG.png";
import "./about.css";

function scrollToMenu() {
    document.getElementById("menu-div").scrollIntoView({ behavior: "smooth" });
}

function About() {
    // THIS CODE IS IMPORTANT FROM HERE
    const { pathname } = useLocation();
    let location = useLocation();
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

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleWindowResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener("resize", handleWindowResize);
    });
    if (pathname === "/reserve") {
        return <></>;
    } else {
        return (
            <>
                {/* // THIS CODE IS IMPORTANT UNTIL HERE  */}
                <Box
                    className="about-div"
                    id="about-div"
                    sx={{
                        backgroundImage: `url(https://www.pixelstalk.net/wp-content/uploads/2016/05/Black-Background-Images.jpg)`,
                    }}
                >
                    <div class="about-centered-grid">
                        {/* Insert content here or else the layout will be all messed up  */}
                        <Box sx={{ margin: "10px auto" }}>
                            <Grid
                                container
                                rowSpacing={{ xs: 0, md: 2 }}
                                // gap={}
                                sx={{
                                    padding: {
                                        xs: "20px",
                                        sm: "35px",
                                        md: "50px",
                                    },
                                    width: {
                                        xs: "100vw",
                                        sm: "auto",
                                    },
                                    // margin: "0 0 0 0",
                                }}
                            >
                                <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    md={6}
                                    sx={{ padding: "0px" }}
                                >
                                    <Box
                                        sx={{
                                            margin: "0 auto",
                                            paddingRight: {
                                                xs: "0px",
                                                md: "10px",
                                            },
                                        }}
                                    >
                                        <h1
                                            className="title"
                                            style={{
                                                textAlign:
                                                    windowWidth < 600
                                                        ? "center"
                                                        : "left",
                                            }}
                                        >
                                            Our Story
                                        </h1>
                                        <p
                                            className="englishdescription"
                                            style={{
                                                textAlign:
                                                    windowWidth < 600
                                                        ? "center"
                                                        : "left",
                                            }}
                                        >
                                            Looking for a taste of Korean
                                            cuisine that will tantalize your
                                            tastebuds? Look no further than
                                            Honey Night, the premier Korean
                                            restaurant in town! Whether you're
                                            in the mood for savory bibimbap,
                                            spicy kimchi stew, or the delicious
                                            flavors of Korean barbecue, we have
                                            something for everyone. <br></br>
                                        </p>
                                        <p
                                            className="description"
                                            style={{
                                                textAlign:
                                                    windowWidth < 600
                                                        ? "center"
                                                        : "left",
                                            }}
                                        >
                                            {/* Insert doNotWrap for those phrases that you don't want the responsive browser to separate */}
                                            안녕하세요! 우리 식당은 한국의
                                            맛있는 음식을 제공하는
                                            <span class="doNotWrap">
                                                {" "}
                                                곳입니다.{" "}
                                            </span>
                                            저희는 다양한 한국적 요리, 예를 들어
                                            비빔밥,
                                            <span class="doNotWrap">
                                                {" "}
                                                삼겹살,{" "}
                                            </span>
                                            김치찌개 등을 제공합니다<br></br>
                                            또한 저희는
                                            <span class="doNotWrap">
                                                {" "}
                                                고객의
                                            </span>
                                            요구에 맞춰 적절한 음식을 추천하고,
                                            최고의 서비스를<br></br>
                                            제공하겠습니다. 언제든지
                                            <span class="doNotWrap">
                                                {" "}
                                                저희{" "}
                                            </span>
                                            식당에 찾아주세요!
                                        </p>
                                    </Box>
                                </Grid>

                                <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    md={6}
                                    mt={5}
                                    rowSpacing={1.5}
                                    columnSpacing={1.5}
                                    sx={{ padding: "0px" }}
                                >
                                    <Box
                                        sx={{
                                            margin: "0 auto",
                                            paddingLeft: {
                                                xs: "0",
                                                md: "10px",
                                            },
                                        }}
                                    >
                                        <CardMedia
                                            component={"img"}
                                            src={aboutPic}
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </div>
                </Box>
            </>
        );
    }
}
export default About;
