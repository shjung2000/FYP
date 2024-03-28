import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";

import "../../../pages/reservationpage/reserve.css";
import "./announcement.css";
import "../../../pages/reservationpage/reserve.css";
import Carousel from "react-elastic-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const breakPoints = [
    { width: 1, itemsToShow: 1, itemsToScroll: 1, pagination: false },
    { width: 550, itemsToShow: 2, itemsToScroll: 2, pagination: true },
    { width: 850, itemsToShow: 3, itemsToScroll: 3 },
    // { width: 1150, itemsToShow: 3, itemsToScroll: 2 },
];

const announcementMessages = [
    "https://lh3.googleusercontent.com/p/AF1QipPHlM7f_2xQkT1Ed3pmXYppxbm6zxw9YOCHUiKf=w768-h768-n-o-v1",
    "https://lh3.googleusercontent.com/p/AF1QipNUB1gMQY-bvdgkTKmLhrl86CV62FsZq-7uZOho=s1280-p-no-v1",

    "https://lh3.googleusercontent.com/p/AF1QipNtL7lVz3XrsrXbJ8H97f23xe5CZlz3L33yOme2",
    "https://lh3.googleusercontent.com/p/AF1QipMf2pHQKO6oFn5NYseeXaSI_S4ldIhALPkcFiVt=s1280-p-no-v1",

    "https://lh3.googleusercontent.com/p/AF1QipPzowFP9fx_PgrrE6UHX_CSuM3b0ebigOjmKMfj=w768-h768-n-o-v1",
    "https://lh3.googleusercontent.com/p/AF1QipM27Lw3LVGFkGLz80yAfIBdIpljlcLXJPFkicSt",

    "https://lh3.googleusercontent.com/p/AF1QipPE9bX0DRzRq9gVIw0kxAQ73Ccp4R0HH_v-KQli",
    "https://lh3.googleusercontent.com/p/AF1QipPQVs5sVdwhji4BPIVQLpOkHPN1KtKbXF5MsNj8",

    "https://lh3.googleusercontent.com/p/AF1QipMq08BUaP1QnOgHnVZANWhlAIKMygiHXTPAhnNC=s1280-p-no-v1",
    "https://lh3.googleusercontent.com/p/AF1QipM3prkRns_zSbi_Flgsfcp_pLukh0EUNsrnBOEM",

    "https://lh3.googleusercontent.com/p/AF1QipMfWOBPWQm_MpwoDo1SYaze38Db3RssGWHQYwz7",
    "https://scontent-xsp1-3.xx.fbcdn.net/v/t39.30808-6/276997867_1983630401816866_8498284467251807484_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=a26aad&_nc_ohc=1kOU5VDM2CMAX9ODXCb&_nc_ht=scontent-xsp1-3.xx&oh=00_AfDHN-RT_LcJ_Zy3TSIKGHu653F6o1ODKJaRsNg7TnE4Sg&oe=63EF754D",

    "https://scontent-xsp1-2.xx.fbcdn.net/v/t39.30808-6/279484859_2004520346394538_974556120937099312_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=a26aad&_nc_ohc=x6aZzJArt5MAX8We9-g&_nc_ht=scontent-xsp1-2.xx&oh=00_AfB7nZlw8kzjJOss77f2aU4YqwBUNfFCA-0aTH3iqst3ZQ&oe=63EFE142",
    "https://scontent-xsp1-3.xx.fbcdn.net/v/t1.6435-9/111614733_1501413300038581_4936354285827641844_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=8bfeb9&_nc_ohc=R85RxqYlf0EAX_OS8Vl&_nc_ht=scontent-xsp1-3.xx&oh=00_AfDrex1f8221LZmjvZvVBxiyXUUqWwtprDndiq64g5VZXg&oe=64129B82",

    "https://scontent-xsp1-2.xx.fbcdn.net/v/t1.6435-9/110015347_1500728776773700_6402248089709668441_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=8bfeb9&_nc_ohc=PV5_8KPcbRQAX9qrzpm&_nc_ht=scontent-xsp1-2.xx&oh=00_AfDwBK6hwdmZhXtNdg_U8-TU9lu8Ml5qKR3M9bNhX71mGA&oe=64129B2A",
    "https://scontent-xsp1-1.xx.fbcdn.net/v/t1.6435-9/88196493_1391611561018756_5433170488849334272_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=e3f864&_nc_ohc=CFoqSJpWC44AX9F7wiz&_nc_ht=scontent-xsp1-1.xx&oh=00_AfAjyY69MOC1QwL8g98DDBj8cBZFrSH7nb8l6ym0eGQU1w&oe=6412C59D",

    "https://scontent-xsp1-3.xx.fbcdn.net/v/t1.6435-9/82384205_1349964255183487_5276597327224635392_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=e3f864&_nc_ohc=rA1GPqGqP00AX98gEIm&_nc_ht=scontent-xsp1-3.xx&oh=00_AfAqCAjArHbTPSeaMi58EJN54RZ8RhWs3Iajj5Kw740yWg&oe=6412A67F",
    "https://scontent-xsp1-3.xx.fbcdn.net/v/t1.6435-9/81625894_1329871723859407_7954305567067996160_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=730e14&_nc_ohc=nlxMNuVzQTwAX-FQYeP&_nc_ht=scontent-xsp1-3.xx&oh=00_AfDIqyFlp2Zf4Vj9Fp2axoomt-rb24uYhoIwqDo0Cuw7Mw&oe=6412BDD5",

    "https://scontent-xsp1-1.xx.fbcdn.net/v/t1.6435-9/69586256_1221861111327136_1644961698295054336_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=0debeb&_nc_ohc=PB2Js0YUK5QAX8w1pbf&_nc_ht=scontent-xsp1-1.xx&oh=00_AfAs5wF4Se241hmTqCS1nvxLmvYdw82midW0N0c5ZNiAnQ&oe=6412A292",
    "https://scontent-xsp1-3.xx.fbcdn.net/v/t1.6435-9/66440165_1186708068175774_488103220506263552_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=cdbe9c&_nc_ohc=eA5IG7sMSTYAX8rBkqT&_nc_ht=scontent-xsp1-3.xx&oh=00_AfBS4KjACd_37Vcdh-eHH2Cqre2C55RE_HbtWZ82fQ2kww&oe=6412B016",

    "https://scontent-xsp1-2.xx.fbcdn.net/v/t1.6435-9/58796889_1133884403458141_8288111705213370368_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=cdbe9c&_nc_ohc=XVUAWeDdeTkAX_5Vb6y&_nc_ht=scontent-xsp1-2.xx&oh=00_AfBzdf0BYk47CS6kc4dtWxPVla_seCu7_oZwZ-wf7lai2g&oe=6412C102",
    "https://scontent-xsp1-3.xx.fbcdn.net/v/t1.6435-9/59549770_1133884393458142_648811417729761280_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=cdbe9c&_nc_ohc=OS6iZ5fN7uUAX-QGF7S&_nc_ht=scontent-xsp1-3.xx&oh=00_AfBNTMxqzr_pzUYIKd2CHm5Yh4R4uzK31AJ1X0Lmhzb6lQ&oe=6412B584",

    "https://scontent-xsp1-2.xx.fbcdn.net/v/t1.6435-9/58796889_1133884403458141_8288111705213370368_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=cdbe9c&_nc_ohc=XVUAWeDdeTkAX_5Vb6y&_nc_ht=scontent-xsp1-2.xx&oh=00_AfBzdf0BYk47CS6kc4dtWxPVla_seCu7_oZwZ-wf7lai2g&oe=6412C102",
    "https://scontent-xsp1-3.xx.fbcdn.net/v/t1.6435-9/59549770_1133884393458142_648811417729761280_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=cdbe9c&_nc_ohc=OS6iZ5fN7uUAX-QGF7S&_nc_ht=scontent-xsp1-3.xx&oh=00_AfBNTMxqzr_pzUYIKd2CHm5Yh4R4uzK31AJ1X0Lmhzb6lQ&oe=6412B584",
    "https://scontent-xsp1-2.xx.fbcdn.net/v/t1.6435-9/62235591_1173942472785667_3580511495038959616_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=0debeb&_nc_ohc=XifLJbSFfMgAX9SvZhf&_nc_ht=scontent-xsp1-2.xx&oh=00_AfBCioA3AzTpl0atxAA_mDEMpH1Z4pvXNcRfSZcw08OMpw&oe=6412D039",
];

// breakpts: (MUI default breakpoints)
// xs: 0px
// sm: 600px
// md: 900px
// lg:1200px
// xl:1536px
const Image = styled("img")({
    display: "block",
    justifyContent: "center",
    alignItems: "center",
    height: "400px",
    width: "400px",
});

function Annoucement({ menuItmeSize }) {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [sidePadding, setSidePadding] = useState(20);
    // const [componentWidth, setComponentWidth] = useState(100);

    useEffect(() => {
        const handleWindowResize = () => {
            setWindowWidth(window.innerWidth);
            // xs
            if (windowWidth < 600) {
                setSidePadding(0);
            }
            // sm
            else if (windowWidth < 900) {
                setSidePadding(35);
            } else {
                setSidePadding(50);
            }
        };
        window.addEventListener("resize", handleWindowResize);
    });

    useEffect(() => {
        setWindowWidth(window.innerWidth);
        // xs
        if (windowWidth < 600) {
            setSidePadding(0);
        }
        // sm
        else if (windowWidth < 900) {
            setSidePadding(35);
        } else {
            setSidePadding(50);
        }
    });
    return (
        <div className="secondBlock">
            <div
                style={{
                    textAlign: "center",
                    marginTop: "80px",
                    marginBottom: "50px",
                }}
            >
                <h1
                    className="seoul"
                    id="bookTableWord"
                    style={{
                        backgroundColor: "",
                        color: "#F49300",
                        marginLeft: "84px",
                        marginRight: "84px",
                        fontSize: "4vw",
                    }}
                >
                    A N N O U N C E M E N T S
                </h1>
            </div>
            <Carousel
                id="carousel"
                focusOnSelect={true}
                infiniteLoop
                breakPoints={breakPoints}
                style={{
                    margin: "auto",
                    padding: `${sidePadding}px`,
                    // width: `${componentWidth}vw`,
                }}
                itemPadding={[0, 10]}
            >
                {announcementMessages.map((messageImage) => {
                    return (
                        <img
                            alt="image1"
                            id="img"
                            src={messageImage}
                            referrerPolicy="no-referrer"
                            style={{
                                height: windowWidth < 600 ? 350 : menuItmeSize,
                                width: windowWidth < 600 ? 350 : menuItmeSize,
                            }}
                            loading={"lazy"}
                        />
                    );
                })}
            </Carousel>
        </div>
    );
}

export default Annoucement;
