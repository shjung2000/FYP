import React from "react";
import { Grid, IconButton } from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import FacebookIcon from "@mui/icons-material/Facebook";
import "./Footer.css";

function SocialMedia({ classes }) {
    return (
        // From 0 to 600px wide (smart-phones), I take up 12 columns, or the whole device width!
        // From 600-690px wide (tablets), I take up 6 out of 12 columns, so 2 columns fit the screen.
        // From 960px wide and above, I take up 25% of the device (3/12), so 4 columns fit the screen.
        <Grid item xs={12} sm={4} md={4}>
            <div className="center-text three-icons">
                <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="label"
                    onClick={() =>
                        window.open("https://www.instagram.com/honeynightsg/")
                    }
                >
                    <InstagramIcon color="warning" fontSize="large" />
                </IconButton>
                <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="label"
                    onClick={() => window.open("https://wa.me/86711443")}
                >
                    <WhatsAppIcon color="warning" fontSize="large" />
                </IconButton>
                <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="label"
                    onClick={() =>
                        window.open("https://www.facebook.com/HONEYNIGHTSG/")
                    }
                >
                    <FacebookIcon color="warning" fontSize="large" />
                </IconButton>
            </div>
        </Grid>
    );
}
function CompanyLogo({ classes }) {
    return (
        // From 0 to 600px wide (smart-phones), I take up 12 columns, or the whole device width!
        // From 600-690px wide (tablets), I take up 6 out of 12 columns, so 2 columns fit the screen.
        // From 960px wide and above, I take up 25% of the device (3/12), so 4 columns fit the screen.
        <Grid item xs={12} sm={4} md={4} sx={{paddingTop: "10px"}}>
            <div className="center-text company-logo">
                <img
                    src="https://honeytesting.netlify.app/assets/images/logo/logo_bottom_yellow.png"
                    alt="honeynight logo"
                />
            </div>
        </Grid>
    );
}
function CopyRight({ classes }) {
    return (
        // From 0 to 600px wide (smart-phones), I take up 12 columns, or the whole device width!
        // From 600-690px wide (tablets), I take up 6 out of 12 columns, so 2 columns fit the screen.
        // From 960px wide and above, I take up 25% of the device (3/12), so 4 columns fit the screen.
        <Grid item xs={12} sm={4} md={4} sx={{ color: "#a66709"}}>
            <div className="center-text copyright">
                <b> © Copyright Honey Night Co.</b>
            </div>
        </Grid>
    );
}

function Footer() {
    return (
        <div className="footer-bg">
            <Grid container sx={{alignItems: "center"}}>
                <SocialMedia />
                <CompanyLogo />
                <CopyRight />
            </Grid>
        </div>
    );
}
export default Footer;
