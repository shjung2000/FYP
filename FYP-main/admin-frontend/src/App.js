import "./App.css";
import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    BrowserRouter,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard/Dashboard";

function App() {
    return (
        <>
            <BrowserRouter>
                <Dashboard />
            </BrowserRouter>
        </>
    );
}

export default App;
