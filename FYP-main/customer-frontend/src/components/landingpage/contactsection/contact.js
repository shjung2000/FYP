import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Typography, CardContent, Grid, Card, Box } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "./contact.css";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

// import { styled } from "@mui/material/styles";

// const mapStyles = {
//   width: "30%",
//   height: "30%",
// };

function Contact() {
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
    if (pathname === "/reserve") {
        return <></>;
    } else {
        return (
            <>
                {/* // THIS CODE IS IMPORTANT UNTIL HERE  */}
                <ThemeProvider theme={darkTheme}>
                    <CssBaseline />

                    <div id="contact-div">
                        <Grid
                            container
                            // justifyContent={"center"}
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
                            }}
                            style={{ backgroundColor: "#1c1c1c" }}
                        >
                            <Grid item xs={12} md={8} mt={6}>
                                <Box
                                    textAlign={"center"}
                                    sx={{ height: "100%" }}
                                >
                                    <div id="Map" style={{ height: "100%" }}>
                                        <iframe
                                            title="Googlemap"
                                            style={{
                                                width: "100%",
                                                minHeight: "400px",
                                                height: "100%",
                                            }}
                                            src="https://maps.google.com/maps?q=Honey%20Night&t=k&z=17&ie=UTF8&iwloc=&output=embed"
                                            frameborder="0"
                                            marginheight="0"
                                            marginwidth="0"
                                        ></iframe>
                                    </div>
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={4} mt={6}>
                                <Box textAlign={"center"}>
                                    {/* <p>
                    <b>
                      Opening hrs and contact details supposed to be displayed
                      here
                    </b>
                  </p> */}
                                    <Card
                                        sx={{ minWidth: 200 }}
                                        style={{ backgroundColor: "#2f3133" }}
                                    >
                                        <CardContent>
                                            <Typography
                                                variant="h5"
                                                component="div"
                                                textAlign={"left"}
                                                sx={{
                                                    fontFamily: "SeoulHangangC",
                                                }}
                                            >
                                                <b>Business Hours</b>
                                            </Typography>
                                            <Typography
                                                sx={{ mb: 1, mt: 1 }}
                                                color="text.secondary"
                                                textAlign={"left"}
                                            >
                                                Monday: 11:30am - 11:00pm
                                                <br></br>
                                                Wednesday: 11:30am - 11:00pm
                                                <br></br>
                                                Thursday: 11:30am - 11:00pm
                                                <br></br>
                                                Sunday: 11:30am - 11:00pm
                                                <br></br>
                                                Friday and Saturday: 11:30am -{" "}
                                                <b>
                                                    <u>11:30pm</u>
                                                </b>{" "}
                                            </Typography>
                                            <Typography
                                                variant="h6"
                                                component="div"
                                                textAlign={"left"}
                                            >
                                                <b>*Note: Closed on Tuesdays</b>
                                            </Typography>
                                            <br />
                                            <hr />
                                            <br />
                                            <Typography
                                                variant="h5"
                                                component="div"
                                                textAlign={"left"}
                                                sx={{
                                                    fontFamily: "SeoulHangangC",
                                                }}
                                            >
                                                <b>Contact Us:</b>
                                            </Typography>
                                            <Typography
                                                sx={{ mt: 1 }}
                                                variant="h6"
                                                color="text.primary"
                                                textAlign={"left"}
                                                sx={{
                                                    fontFamily: "SeoulHangangC",
                                                }}
                                            >
                                                <b>Email:</b>
                                            </Typography>
                                            <Typography
                                                sx={{ mb: 1 }}
                                                color="text.secondary"
                                                textAlign={"left"}
                                            >
                                                <a
                                                    target="_blank"
                                                    href="mailto:honeynight.business@gmail.com"
                                                    style={{ color: "white" }}
                                                >
                                                    honeynight.business@gmail.com
                                                </a>
                                            </Typography>
                                            <br />
                                            <Typography
                                                variant="h6"
                                                color="text.primary"
                                                textAlign={"left"}
                                                sx={{
                                                    fontFamily: "SeoulHangangC",
                                                }}
                                            >
                                                <b>Call/WhatsApp Us:</b>
                                            </Typography>
                                            <Typography
                                                sx={{ mb: 1 }}
                                                color="text.secondary"
                                                textAlign={"left"}
                                            >
                                                Call: 6677 2946
                                                <br></br>
                                                WhatsApp: 8671 1443
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Box>
                            </Grid>
                        </Grid>

                        {/* <script
              src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&callback=initMap&v=weekly"
              defer
            ></script>
            <script src="./googlemap.js"></script> */}
                    </div>
                </ThemeProvider>
                {/* <Footer></Footer> */}
            </>
        );
    }
}

export default Contact;
