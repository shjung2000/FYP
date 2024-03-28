import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/general/navbar/Navbar";
import PopupPrompt from "./components/general/popupprompt/PopupPrompt";
import Footer from "./components/general/footer/Footer";

import LandingPage from "./pages/landingpage/LandingPage";
import Reserve from "./pages/reservationpage/reserve";

import CancelReservation from "./pages/reservationpage/cancelreservation/cancelreservation";
import ViewReservation from "./pages/reservationpage/viewreservation/viewReservation";

function App() {
    return (
        <>
            <Router>
                <Navbar />
                <div style={{ minHeight: "100vh" }}>
                    <Routes>
                        <Route path="/" element={<LandingPage />} />

                        <Route path="/reserve" element={<Reserve />} />
                        <Route path="reservation">
                            <Route
                                path="cancel/:reservationId"
                                element={<CancelReservation />}
                            />
                            <Route
                                path="view/:reservationId"
                                element={<ViewReservation />}
                            />
                        </Route>
                    </Routes>
                    <PopupPrompt />
                </div>
                <Footer />
            </Router>
        </>
    );
}

export default App;
