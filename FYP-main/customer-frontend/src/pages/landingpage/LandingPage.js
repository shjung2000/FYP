import React, { useState } from "react";
import Home from "../../components/landingpage/homesection/home";
import About from "../../components/landingpage/aboutsection/about";
import Menu from "../../components/menu/menu";
import Contact from "../../components/landingpage/contactsection/contact";
import Annoucement from "../../components/landingpage/annoucementsection/announcement";
function LandingPage() {
    const [menuItmeSize, setMenuItemSize] = useState(0);
    return (
        <div>
            <Home />
            <About />
            <Menu setMenuItemSize={setMenuItemSize} />
            {/* {menuItmeSize}px */}
            <Annoucement menuItmeSize={menuItmeSize} />
            <Contact />
        </div>
    );
}

export default LandingPage;
