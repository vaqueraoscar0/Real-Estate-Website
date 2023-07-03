import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { useImmerReducer } from "use-immer";

// Contexts
import stateContext from "../Context/StateContext";

// Assets
import defaultProfilePicture from "./Assets/defaultProfilePicture.jpg";

// Components
import ProfileUpdate from "./ProfileUpdate";

// MUI
import {
    Grid,
    Typography,
    Button,
    CircularProgress,
} from "@mui/material";

//Icons
import {FaKey} from 'react-icons/fa'
import {FaUserSecret} from "react-icons/fa";
import {FaScreenpal} from "react-icons/fa6";
import {FaBell} from "react-icons/fa";
import {BsHouse} from "react-icons/bs";


function Profile() {
    const navigate = useNavigate();
    const GlobalState = useContext(stateContext);


    const initialState = {
        userProfile: {
            agencyName: "",
            phoneNumber: "",
            profilePic: "",
            bio: "",
            sellerId: "",
            sellerListings: [],
        },
        dataIsLoading: true,
    };

    function ReducerFuction(draft, action) {
        switch (action.type) {
            case "catchUserProfileInfo":
                draft.userProfile.agencyName = action.profileObject.agency_name;
                draft.userProfile.phoneNumber = action.profileObject.phone_number;
                draft.userProfile.profilePic = action.profileObject.profile_picture;
                draft.userProfile.bio = action.profileObject.bio;
                draft.userProfile.sellerListings = action.profileObject.seller_listings;
                draft.userProfile.sellerId = action.profileObject.seller;
                break;

            case "loadingDone":
                draft.dataIsLoading = false;
                break;
            default:
                console.log('oops this is embarrassing!')
        }
    }

    const [state, dispatch] = useImmerReducer(ReducerFuction, initialState);

    // request to get profile info
    useEffect(() => {
        async function GetProfileInfo() {
            try {
                const response = await Axios.get(
                    `https://listingbuddy-d88c1ed5b70e.herokuapp.com/api/profiles/${GlobalState.userId}/`
                );

                dispatch({
                    type: "catchUserProfileInfo",
                    profileObject: response.data,
                });
                dispatch({ type: "loadingDone" });
            } catch (e) {}
        }
        GetProfileInfo();
    }, []);

    function WelcomeDisplay() {
        if (
            state.userProfile.agencyName === null ||
            state.userProfile.agencyName === "" ||
            state.userProfile.phoneNumber === null ||
            state.userProfile.phoneNumber === ""
        ) {
            return (
                <div>
                    <div style={{width: '100%', display: 'flex', justifyContent: 'center', marginTop: '5rem'}}>
                        <img src={defaultProfilePicture} style={{width: '80%' }} alt={'default-img'}/>
                    </div>
                    <Typography
                        variant={"h6"}
                        fontWeight={400}
                        style={{ textAlign: "center", margin: "2rem", marginTop: '1rem'}}
                    >

                        please submit the form to update your profile.
                    </Typography>
                </div>
            );
        } else {
            return (
                <Grid container>
                    <Grid item container style={{height: '100%', display: 'flex', justifyContent: 'center', marginTop: '100px'}}>
                        <img
                            style={{height: "15rem"}}
                            alt={'profile'}
                            src={
                                state.userProfile.profilePic !== null
                                    ? state.userProfile.profilePic
                                    : defaultProfilePicture
                            }
                        />
                    </Grid>
                    <Grid
                        item
                        container
                        style={{flexDirection: 'column', width: '100%', marginTop: '50px'}}
                    >
                        <Grid item style={{borderTop: '1px solid rgb(215,215,215)', textAlign: 'left'}}>
                            <Button style={{textAlign: "center", marginTop: "1rem",}}>
                                <BsHouse style={{fontSize: '20px', paddingLeft: '10px'}}/>&nbsp;&nbsp; Account

                            </Button>
                        </Grid>

                        <Grid item style={{borderTop: '1px solid rgb(215,215,215)', textAlign: 'left'}}>
                            <Button style={{textAlign: "center", marginTop: "1rem",}}>
                                <FaKey style={{fontSize: '20px', paddingLeft: '10px'}}/>&nbsp;&nbsp;Password
                            </Button>
                        </Grid>

                        <Grid item style={{borderTop: '1px solid rgb(215,215,215)', textAlign: 'left'}}>
                            <Button style={{textAlign: "center", marginTop: "1rem",}}>
                                <FaUserSecret style={{fontSize: '20px', paddingLeft: '10px'}}/>&nbsp;&nbsp;Security
                            </Button>
                        </Grid>

                        <Grid item style={{borderTop: '1px solid rgb(215,215,215)', textAlign: 'left'}}>
                            <Button onClick={() => navigate(`/agencies/${state.userProfile.sellerId}`)} style={{textAlign: "center", marginTop: "1rem",}}>
                                <FaScreenpal style={{fontSize: '20px', paddingLeft: '10px'}} />&nbsp;&nbsp;My Listings
                            </Button>
                        </Grid>

                        <Grid item style={{borderTop: '1px solid rgb(215,215,215)', borderBottom: '1px solid rgb(215,215,215)', textAlign: 'left'}}>
                            <Button style={{textAlign: "center", marginTop: "1rem",}}>
                                <FaBell style={{fontSize: '20px', paddingLeft: '10px'}}/>&nbsp;&nbsp;Notifications
                            </Button>
                        </Grid>

                    </Grid>
                </Grid>
            );
        }
    }

    if (state.dataIsLoading === true) {
        return (
            <Grid
                container
                justifyContent="center"
                alignItems="center"
                style={{ height: "100vh" }}
            >
                <CircularProgress />
            </Grid>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',  backgroundColor: 'rgb(232 236 240)', width: '100%'}}>
            <section id={'profilesection'}>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-end',
                        width: '50%',
                        height: '90%',
                        color: 'white',
                        fontWeight: 'bolder',
                        padding: '40px',
                    }}
                >
                    <p style={{fontSize: '30px', fontFamily: 'Times'}}>ListingBuddy <br/> <span style={{fontSize: '20px',}}>Welcome,&nbsp; Agent&nbsp;{GlobalState.username.substring(0,1).toUpperCase()}{GlobalState.username.substring(1)}</span></p>

                </div>

            </section>
            <div style={{
                display: 'flex',
                width: '80%',
                marginTop: '50px',
                marginBottom: '50px',
                backgroundColor: 'white'

            }}>
                <div style={{height: '100%', display: 'flex', alignItems: "flex-start", width: '300px'}}>
                    {WelcomeDisplay()}
                </div>

                <ProfileUpdate userProfile={state.userProfile} />
            </div>
        </div>
    );
}

export default Profile;