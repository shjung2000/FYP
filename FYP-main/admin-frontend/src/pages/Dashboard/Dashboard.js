import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import { Routes, Route, useNavigate } from "react-router-dom";
import AdminInterface from "../availability/AdminInterface";
import Monthly from "./Monthly";
import Daily from "./Daily";
import HoneyNightLogo from "../../Image/honeynightlogo.PNG";
import PeopleIcon from "@mui/icons-material/People";
import WorkIcon from "@mui/icons-material/Work";
import Attendance from "./labour";
import Cost from "./Cost";
import PaidIcon from '@mui/icons-material/Paid';
const drawerWidth = 240;

function Dashboard(props) {
    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const navigate = useNavigate();

    const drawer = (
        <>
            <div style={{ background: "#F7f7f8", height: "100%" }}>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <img
                        src={HoneyNightLogo}
                        alt="logo"
                        width={"64"}
                        height={"64"}
                    />
                </div>
                <List>
                    <ListItem
                        disablePadding
                        onClick={() => navigate("/reservations")}
                    >
                        <ListItemButton>
                            <ListItemIcon>
                                <PeopleIcon />
                            </ListItemIcon>
                            <ListItemText>Reservation</ListItemText>
                        </ListItemButton>
                    </ListItem>
                </List>
                <List>
                    <ListItem
                        disablePadding
                        onClick={() => navigate("/monthly")}
                    >
                        <ListItemButton>
                            <ListItemIcon>
                                <AutoGraphIcon />
                            </ListItemIcon>
                            <ListItemText>Monthly Overview</ListItemText>
                        </ListItemButton>
                    </ListItem>
                </List>
                <List>
                    <ListItem disablePadding onClick={() => navigate("/daily")}>
                        <ListItemButton>
                            <ListItemIcon>
                                <LeaderboardIcon />
                            </ListItemIcon>
                            <ListItemText>Daily Overview</ListItemText>
                        </ListItemButton>
                    </ListItem>
                </List>
                <List>
                    <ListItem
                        disablePadding
                        onClick={() => navigate("/labour")}
                    >
                        <ListItemButton>
                            <ListItemIcon>
                                <WorkIcon />
                            </ListItemIcon>
                            <ListItemText>Staff Checkout</ListItemText>
                        </ListItemButton>
                    </ListItem>
                </List>
                <List>
                    <ListItem
                        disablePadding
                        onClick={() => navigate("/cost")}
                    >
                        <ListItemButton>
                            <ListItemIcon>
                                <PaidIcon />
                            </ListItemIcon>
                            <ListItemText>Staff Salary</ListItemText>
                        </ListItemButton>
                    </ListItem>
                </List>
            </div>
        </>
    );

    const container =
        window !== undefined ? () => window().document.body : undefined;

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    background: "#F49300",
                    color: "black",
                }}
            >
                <Toolbar>
                    <IconButton
                        color="orange]"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: "none" } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h4" fontWeight={"bold"}>
                        Admin Interface
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: "block", sm: "none" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawerWidth,
                        },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: "none", sm: "block" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawerWidth,
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                }}
            >
                <Toolbar />
                <Routes>
                    <Route
                        path="/reservations"
                        element={<AdminInterface />}
                    ></Route>
                    <Route path="/monthly" element={<Monthly />}></Route>
                    <Route path="/daily" element={<Daily />}></Route>
                    <Route path="/labour" element={<Attendance />}></Route>
                    <Route path="/cost" element={<Cost />}></Route>
                </Routes>
            </Box>
        </Box>
    );
}

Dashboard.propTypes = {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
};

export default Dashboard;
