import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Axios from "axios";
import { useImmerReducer } from "use-immer";

// Contexts
import stateContext from "../Context/StateContext";

// Assets
import defaultProfilePicture from "./Assets/defaultProfilePicture.jpg";
import stadiumIconPng from "./Assets/Mapicons/stadium.png";
import hospitalIconPng from "./Assets/Mapicons/hospital.png";
import universityIconPng from "./Assets/Mapicons/university.png";

// Components
import ListingUpdate from "./ListingUpdate";

// React Leaflet
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
} from "react-leaflet";
import { Icon } from "leaflet";

// MUI
import {
    Grid,
    Typography,
    Button,
    CircularProgress,
    Breadcrumbs,
    Link,
    Dialog,
    Snackbar,
} from "@mui/material";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import RoomIcon from "@mui/icons-material/Room";
import axios from "axios";
import {ArrowDropDown} from "@mui/icons-material";
import {FaLock, FaTimesCircle} from "react-icons/fa";

function ListingDetail() {
    const navigate = useNavigate();
    const GlobalState = useContext(stateContext);

    const params = useParams();

    const [isPhotoPopUp, setIsPhotoPopUp] = useState(true);

    const [isScreenW, setIsScreenW] = useState(window.innerWidth)

    const handleResize = () => {
        setIsScreenW(window.innerWidth)
    }

    useEffect(() => {
        window.addEventListener("resize", handleResize)
    },[])


    const stadiumIcon = new Icon({
        iconUrl: stadiumIconPng,
        iconSize: [40, 40],
    });

    const hospitalIcon = new Icon({
        iconUrl: hospitalIconPng,
        iconSize: [40, 40],
    });

    const universityIcon = new Icon({
        iconUrl: universityIconPng,
        iconSize: [40, 40],
    });

    const initialState = {
        dataIsLoading: true,
        listingInfo: "",
        sellerProfileInfo: "",
        openSnack: false,
        disabledBtn: false,
    };

    function ReducerFuction(draft, action) {
        switch (action.type) {
            case "catchListingInfo":
                draft.listingInfo = action.listingObject;
                break;

            case "loadingDone":
                draft.dataIsLoading = false;
                break;

            case "catchSellerProfileInfo":
                draft.sellerProfileInfo = action.profileObject;
                break;

            case "openTheSnack":
                draft.openSnack = true;
                break;

            case "disableTheButton":
                draft.disabledBtn = true;
                break;

            case "allowTheButton":
                draft.disabledBtn = false;
                break;
            default:
                console.log('something is wrong')
                break;
        }
    }

    const [state, dispatch] = useImmerReducer(ReducerFuction, initialState);

    // request to get listing info
    useEffect(() => {
        async function GetListingInfo() {
            try {
                const response = await Axios.get(
                    `https://listingbuddy-d88c1ed5b70e.herokuapp.com/api/listings/${params.id}/`
                );
                dispatch({
                    type: "catchListingInfo",
                    listingObject: response.data,
                });
            } catch (e) {}
        }
        GetListingInfo();
    }, []);

    // request to get profile info
    useEffect(() => {
        if (state.listingInfo) {
            async function GetProfileInfo() {
                try {
                    const response = await Axios.get(
                        `https://listingbuddy-d88c1ed5b70e.herokuapp.com/api/profiles/${state.listingInfo.seller}/`
                    );

                    dispatch({
                        type: "catchSellerProfileInfo",
                        profileObject: response.data,
                    });
                    dispatch({ type: "loadingDone" });
                } catch (e) {}
            }
            GetProfileInfo();
        }
    }, [state.listingInfo]);

    const listingPictures = [
        state.listingInfo.picture1,
        state.listingInfo.picture2,
        state.listingInfo.picture3,
        state.listingInfo.picture4,
        state.listingInfo.picture5,
    ].filter((picture) => picture !== null);

    const [currentPicture, setCurrentPicture] = useState(0);

    function NextPicture() {
        if (currentPicture === listingPictures.length - 1) {
            return setCurrentPicture(0);
        } else {
            return setCurrentPicture(currentPicture + 1);
        }
    }

    function PreviousPicture() {
        if (currentPicture === 0) {
            return setCurrentPicture(listingPictures.length - 1);
        } else {
            return setCurrentPicture(currentPicture - 1);
        }
    }



    async function DeleteHandler() {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this listing?"
        );
        if (confirmDelete) {
            try {
                await axios.delete(
                    `https://listingbuddy-d88c1ed5b70e.herokuapp.com/api/listings/${params.id}/delete/`
                );

                dispatch({ type: "openTheSnack" });
                dispatch({ type: "disableTheButton" });
            } catch (e) {
                dispatch({ type: "allowTheButton" });
            }
        }
    }

    useEffect(() => {
        if (state.openSnack) {
            setTimeout(() => {
                navigate("/listing");
            }, 1500);
        }
    }, [state.openSnack]);

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    if (state.dataIsLoading === true) {
        return (
            <Grid
                container
                justifyContent="center"
                alignItems="center"
                style={{ height: "100vh" ,}}
            >
                <CircularProgress />
            </Grid>
        );
    }

    function handlePhotoPopUp(e) {
        e.preventDefault()
        setIsPhotoPopUp(!isPhotoPopUp)
    }

    return (
        <div
            style={{backgroundColor: 'white', paddingLeft: '50px', paddingRight:'50px', borderTop: '1px solid black' }}
        >
            <Grid item style={{ paddingTop: "1rem", filter: !isPhotoPopUp? "blur(2px)" : ''}}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link
                        underline="hover"
                        color="inherit"
                        onClick={() => navigate("/listing")}
                        style={{ cursor: "pointer" }}
                    >
                        Listings
                    </Link>

                    <Typography color="text.primary">
                        {state.listingInfo.title}
                    </Typography>
                </Breadcrumbs>
            </Grid>

            {/* Image slider */}
            {listingPictures.length > 0 ? (
                <Grid
                    item
                    container
                    justifyContent="center"
                    style={{ position: "relative", marginTop: "1rem", gap: '5px' }}
                >
                    <div>
                        {listingPictures.map((picture, index) => {
                            return (
                                <div key={index}>
                                    {index === currentPicture ? (
                                        <img
                                            alt={`aa${index}`}
                                            src={picture}
                                            style={{ width: "40rem" }}
                                        />
                                    ) : (
                                        ""
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {!isPhotoPopUp &&
                        <div style={{width: '900px', height: '900px', backgroundColor: 'rgb(255,255,255)', position: 'fixed', top: '30px', zIndex: '100000', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', border: '1px solid black', gap:'20px', borderRadius: '20px'}}>
                            <Typography variant="h5">{state.listingInfo.title}</Typography>
                            <button onClick={(e) => handlePhotoPopUp(e)} style={{backgroundColor: 'transparent', border:'unset',  color: 'rgb(189,0,0)', position: 'absolute', top: '35px', right: '30px', fontSize: '25px', fontWeight: '200'}}><FaTimesCircle/></button>


                            {listingPictures.map((picture, index) => {
                                return (
                                    <div key={index}>
                                        {index === currentPicture ? (
                                            <img
                                                alt={`aa${index}`}
                                                src={picture}
                                                style={{ width: "40rem"}}
                                            />
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                );
                            })}
                            <ArrowCircleLeftIcon
                                onClick={PreviousPicture}
                                style={{
                                    position: "absolute",
                                    cursor: "pointer",
                                    fontSize: "3rem",
                                    color: "white",
                                    top: "50%",
                                    left: "17.5%",
                                }}
                            />
                            <ArrowCircleRightIcon
                                onClick={NextPicture}
                                style={{
                                    position: "absolute",
                                    cursor: "pointer",
                                    fontSize: "3rem",
                                    color: "white",
                                    top: "50%",
                                    right: "17.5%",
                                }}
                            />
                        </div>

                    }


                    {isScreenW >= 1200 &&
                        <div style={{filter: !isPhotoPopUp? "blur(2px)" : ''}}>
                            {listingPictures.length >= 2 ? (
                                <div style={{display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <img src={listingPictures[0]} style={{ width: "19.7rem"}} alt={'showcase'}/>
                                    <img src={listingPictures[1]} style={{ width: "19.7rem"}} alt={'showcase1'}/>
                                    <Button onClick={(e) => handlePhotoPopUp(e)} style={{position:'relative', top:'-50px', border:'1px solid white', color: 'white', width: '340px'}}>See All Photos</Button>
                                </div>
                            ):(
                                <div style={{display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <img src={listingPictures[0]} style={{ width: "19.7rem"}} alt={'showcase'}/>
                                    <img src={listingPictures[0]} style={{ width: "19.7rem"}} alt={'showcase1'}/>
                                    <Button onClick={(e) => handlePhotoPopUp(e)} style={{position:'relative', top:'-50px', border:'1px solid white', color: 'white', width: '340px'}}>See All Photos</Button>
                                </div>

                                )}

                        </div>

                    }
                </Grid>
            ) : (
                ""
            )}

            {/* More information */}

            <Grid
                item
                container
                style={{
                    paddingLeft: "10rem",
                    paddingRight: "10rem",
                    marginTop: "1rem",
                    filter: !isPhotoPopUp? "blur(2px)" : ''
                }}
            >
                <Grid item container xs={7} direction="column" spacing={1}>
                    <Grid item>
                        <Typography variant="h5">{state.listingInfo.title}</Typography>
                    </Grid>
                    <Grid item>
                        <Typography varaiant="h6" style={{color: "blue"}}><RoomIcon style={{color: 'black'}}/> {state.listingInfo.borough}, London, Uk</Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid
                item
                container
                justifyContent="flex-start"
                style={{
                    paddingLeft: "10rem",
                    paddingRight: "10rem",
                    marginTop: "3rem",
                    filter: !isPhotoPopUp? "blur(2px)" : ''
                }}
            >
                <Grid item container xs={5} alignItems="center" style={{filter: !isPhotoPopUp? "blur(2px)" : ''}}>
                    <Typography
                        variant="h6"
                        style={{ fontWeight: "bolder", color: "black", letterSpacing: '2px' }}
                    >
                        {state.listingInfo.property_status === "Sale"
                            ? `$${state.listingInfo.price
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                            : `$${state.listingInfo.price
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/${
                                state.listingInfo.rental_frequency
                            }`}
                        <br/><p style={{fontWeight: '300', margin: '0', padding: '0', letterSpacing: '1px', fontSize: '14px'}}>Est. $8,012/moGet pre-approved</p>
                    </Typography>
                </Grid>
                {state.listingInfo.rooms ? (
                    <Grid item xs={2} style={{ display: "flex" }}>
                        <Typography variant="h6">
                            {state.listingInfo.rooms}<br/><p style={{fontWeight: '300', margin: '0', padding: '0', letterSpacing: '1px', fontSize: '14px'}}>Beds</p>
                        </Typography>
                    </Grid>
                ) : (
                    ""
                )}

                <Grid item xs={2} style={{ display: "flex" }}>
                    <Typography variant="h6">
                        2.5<br/><p style={{fontWeight: '300', margin: '0', padding: '0', letterSpacing: '1px', fontSize: '14px'}}>Baths</p>
                    </Typography>
                </Grid>

                <Grid item xs={2} style={{ display: "flex" }}>
                    <Typography variant="h6">
                        2,500<br/><p style={{fontWeight: '300', margin: '0', padding: '0', letterSpacing: '1px', fontSize: '14px'}}>Sq Ft</p>
                    </Typography>
                </Grid>

                <Grid style={{width: '100%', height: '150px', borderTop: '1px solid grey', borderBottom: '1px solid grey'}}>
                    <div>
                        <div>
                            <Typography variant={"h6"} marginTop={3}>Bothell is a hot market</Typography>
                            <p style={{fontWeight: '300', margin: '0', padding: '0', letterSpacing: '1px', fontSize: '14px'}}>50% of homes accept an offer within a week. Tour it before it's gone!</p>
                        </div>

                    </div>
                    <div style={{display: "flex", marginTop: '10px'}}>
                        <p>Today: </p>
                        <ul style={{display: 'flex', flexDirection: 'row', gap: '20px',fontWeight: '700', color: 'darkblue'}}>
                            <li>5:00</li>
                            <li>6:00</li>
                            <li>7:00</li>
                            <li>8:00</li>
                            <li>9:00</li>
                            <li style={{textDecoration: 'underline', cursor: 'pointer'}}>Need a different time?</li>
                        </ul>
                    </div>

                </Grid>

                {/*<Grid container marginTop={5} style={{borderTop: '1px solid black'}}>*/}
                {/*    {state.listingInfo.furnished ? (*/}
                {/*        <Grid item xs={2} style={{ display: "flex" }}>*/}
                {/*            <CheckBoxIcon style={{ color: "blue", fontSize: "2rem" }} />{" "}*/}
                {/*            <Typography variant="h6">Furnished</Typography>*/}
                {/*        </Grid>*/}
                {/*    ) : (*/}
                {/*        ""*/}
                {/*    )}*/}

                {/*    {state.listingInfo.pool ? (*/}
                {/*        <Grid item xs={2} style={{ display: "flex" }}>*/}
                {/*            <CheckBoxIcon style={{ color: "blue", fontSize: "2rem" }} />{" "}*/}
                {/*            <Typography variant="h6">Pool</Typography>*/}
                {/*        </Grid>*/}
                {/*    ) : (*/}
                {/*        ""*/}
                {/*    )}*/}

                {/*    {state.listingInfo.elevator ? (*/}
                {/*        <Grid item xs={2} style={{ display: "flex" }}>*/}
                {/*            <CheckBoxIcon style={{ color: "blue", fontSize: "2rem" }} />{" "}*/}
                {/*            <Typography variant="h6">Elevator</Typography>*/}
                {/*        </Grid>*/}
                {/*    ) : (*/}
                {/*        ""*/}
                {/*    )}*/}

                {/*    {state.listingInfo.cctv ? (*/}
                {/*        <Grid item xs={2} style={{ display: "flex" }}>*/}
                {/*            <CheckBoxIcon style={{ color: "blue", fontSize: "2rem" }} />{" "}*/}
                {/*            <Typography variant="h6">Cctv</Typography>*/}
                {/*        </Grid>*/}
                {/*    ) : (*/}
                {/*        ""*/}
                {/*    )}*/}

                {/*    {state.listingInfo.parking ? (*/}
                {/*        <Grid item xs={2} style={{ display: "flex" }}>*/}
                {/*            <CheckBoxIcon style={{ color: "blue", fontSize: "2rem" }} />{" "}*/}
                {/*            <Typography variant="h6">Parking</Typography>*/}
                {/*        </Grid>*/}
                {/*    ) : (*/}
                {/*        ""*/}
                {/*    )}*/}
                {/*</Grid>*/}

            </Grid>

            {/* Description */}
            {state.listingInfo.description ? (
                <Grid
                    item
                    style={{
                        paddingLeft: "10rem",
                        paddingRight: "10rem",
                        marginTop: '40px',
                        paddingTop: '0',
                        filter: !isPhotoPopUp? "blur(2px)" : ''
                    }}
                >
                    <Typography variant="h5" fontWeight={600}>About this home</Typography>
                    <p style={{fontWeight: '300', margin: '0', padding: '0', letterSpacing: '1px', fontSize: '18px'}}>{state.listingInfo.description.substring(0, 319)}</p>
                    <Button style={{marginTop: '5px', color: 'darkblue'}}>Show more <ArrowDropDown/></Button>
                </Grid>
            ) : (
                ""
            )}

            {/* Seller Info */}
            <Grid
                container
                style={{
                    paddingLeft: "10rem",
                    paddingRight: "10rem",
                    marginTop: '2rem',
                    gap: '5px',
                    filter: !isPhotoPopUp? "blur(2px)" : ''
                }}
            >
                <Grid item>
                    <img
                        alt={'profile-img'}
                        style={{ height: "6rem", cursor: "pointer", clipPath: 'circle()'  }}
                        src={
                            state.sellerProfileInfo.profile_picture !== null
                                ? state.sellerProfileInfo.profile_picture
                                : defaultProfilePicture
                        }
                        onClick={() =>
                            navigate(`/agencies/${state.sellerProfileInfo.seller}`)
                        }
                    />
                </Grid>
                <Grid item container xs={5} justifyContent={"flex-start"} alignItems={"center"} paddingLeft={'10px'}>
                    <Grid item>
                        <p style={{ textAlign: "center", marginTop: "1rem" }}>
                            Listed by &nbsp;
							<span style={{ color: "darkblue", fontWeight: "bolder" }}>
								Agent {state.sellerProfileInfo.agency_name} &nbsp;
							</span>
                        </p>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container style={{paddingLeft: "10rem", paddingRight: "10rem", marginTop: "0", marginBottom: '1rem',}}>
                <p style={{fontWeight: '300', margin: '0', marginTop: '10px', padding: '0', letterSpacing: '1px', fontSize: '18px'}}>Redfin checked: <span style={{color: 'darkblue', fontWeight: 'bold'}}>just now</span> ({new Date().toISOString().split('T')[0]} at 7:57am) Source: <span style={{letterSpacing: '2px', fontSize: '16px', color: 'grey'}}>NWMLS #2127458</span>
                </p>
            </Grid>
            <Grid paddingLeft={'10rem'} paddingRight={'10rem'} marginBottom={'5rem'}>
                <div style={{width: '100%', borderBottom: '1px solid black'}}/>
            </Grid>

            {/* Map */}

            <Grid>
                <Typography variant={'h5'} fontWeight={'600'} paddingLeft={'10rem'} paddingRight={'10rem'}>
                    Home Location:
                </Typography>
            </Grid>

            <Grid
                item
                container
                style={{
                    paddingLeft: "10rem",
                    paddingRight: "10rem",
                    marginTop: "1rem",
                    filter: !isPhotoPopUp? "blur(2px)" : '' }}
                spacing={1}
                justifyContent="space-between"
            >
                {/*<Grid item xs={3} style={{ overflow: "auto", height: "35rem" }}>*/}
                {/*    {state.listingInfo.listing_pois_within_10km.map((poi) => {*/}
                {/*        function DegreeToRadian(coordinate) {*/}
                {/*            return (coordinate * Math.PI) / 180;*/}
                {/*        }*/}

                {/*        function CalculateDistance() {*/}
                {/*            const latitude1 = DegreeToRadian(state.listingInfo.latitude);*/}
                {/*            const longitude1 = DegreeToRadian(state.listingInfo.longitude);*/}

                {/*            const latitude2 = DegreeToRadian(poi.location.coordinates[0]);*/}
                {/*            const longitude2 = DegreeToRadian(poi.location.coordinates[1]);*/}
                {/*            // The formula*/}
                {/*            const latDiff = latitude2 - latitude1;*/}
                {/*            const lonDiff = longitude2 - longitude1;*/}
                {/*            const R = 6371000 / 1000;*/}

                {/*            const a =*/}
                {/*                Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +*/}
                {/*                Math.cos(latitude1) **/}
                {/*                Math.cos(latitude2) **/}
                {/*                Math.sin(lonDiff / 2) **/}
                {/*                Math.sin(lonDiff / 2);*/}
                {/*            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));*/}

                {/*            const d = R * c;*/}

                {/*            const dist =*/}
                {/*                Math.acos(*/}
                {/*                    Math.sin(latitude1) * Math.sin(latitude2) +*/}
                {/*                    Math.cos(latitude1) **/}
                {/*                    Math.cos(latitude2) **/}
                {/*                    Math.cos(lonDiff)*/}
                {/*                ) * R;*/}
                {/*            return dist.toFixed(2);*/}
                {/*        }*/}
                {/*        return (*/}
                {/*            <div*/}
                {/*                key={poi.id}*/}
                {/*                style={{ marginBottom: "0.5rem"}}*/}
                {/*            >*/}
                {/*                <Typography variant="h6">{poi.name}</Typography>*/}
                {/*                <Typography variant="subtitle1">*/}
                {/*                    {poi.type} |{" "}*/}
                {/*                    <span style={{ fontWeight: "bolder", color: "green" }}>*/}
				{/*						{CalculateDistance()} Kilometers*/}
				{/*					</span>*/}
                {/*                </Typography>*/}
                {/*            </div>*/}
                {/*        );*/}
                {/*    })}*/}
                {/*</Grid>*/}
                <Grid item xs={12} style={{ height: "35rem", filter: !isPhotoPopUp? "blur(2px)" : '' }}>
                    <MapContainer
                        center={[state.listingInfo.latitude, state.listingInfo.longitude]}
                        zoom={16}
                        scrollWheelZoom={true}
                    >
                        <TileLayer
                            attribution="Google Maps"
                            url="https://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
                        />
                        <Marker
                            position={[
                                state.listingInfo.latitude,
                                state.listingInfo.longitude,
                            ]}
                        >
                            <Popup>{state.listingInfo.title}</Popup>
                        </Marker>
                        {state.listingInfo.listing_pois_within_10km.map((poi) => {
                            function PoiIcon() {
                                if (poi.type === "Stadium") {
                                    return stadiumIcon;
                                } else if (poi.type === "Hospital") {
                                    return hospitalIcon;
                                } else if (poi.type === "University") {
                                    return universityIcon;
                                }
                            }
                            return (
                                <Marker
                                    key={poi.id}
                                    position={[
                                        poi.location.coordinates[0],
                                        poi.location.coordinates[1],
                                    ]}
                                    icon={PoiIcon()}
                                >
                                    <Popup>{poi.name}</Popup>
                                </Marker>
                            );
                        })}
                    </MapContainer>
                </Grid>
            </Grid>

            <Grid container paddingLeft={'10rem'} paddingRight={'10rem'} marginBottom={'5rem'} marginTop={'1rem'} flexDirection={"column"}>
                <Grid item><Typography variant={'h6'} fontWeight={'500'}>Your Comments</Typography> </Grid>
                <Grid container item flexDirection={'row'} flexWrap={'unset'} gap={'20px'} justifyContent={"center"} alignItems={'center'} marginTop={'1rem'}>
                    <div style={{width: '100%', height: '60px', border:'1px solid black', borderRadius: '10px'}}/>
                    <Button style={{width: '150px', height: '55px',backgroundColor: 'rgb(190,9,9)', color: 'white'}}>Save</Button>
                </Grid>
                <Grid item marginTop={'10px'}>
                    <FaLock/> Only you can see this. | <span style={{color: 'darkblue'}}>Add a search partner</span>
                </Grid>

            </Grid>


            {GlobalState.userId == state.listingInfo.seller ? (
                <Grid item container justifyContent={"center"} marginTop={'10rem'} gap={'5rem'}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleClickOpen}
                        style={{width: '250px'}}
                    >
                        Update
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        style={{width: '250px'}}
                        onClick={DeleteHandler}
                        disabled={state.disabledBtn}
                    >
                        Delete
                    </Button>
                    <Dialog open={open} onClose={handleClose} fullScreen>
                        <ListingUpdate
                            listingData={state.listingInfo}
                            closeDialog={handleClose}
                        />
                    </Dialog>
                </Grid>
            ) : (
                ""
            )}

            <div style={{height: '50px', width: '100%'}}/>


            <Snackbar
                open={state.openSnack}
                message="You have successfully deleted the property!"
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
            />
        </div>
    );
}

export default ListingDetail;