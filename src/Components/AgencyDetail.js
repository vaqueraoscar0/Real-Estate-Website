import React, { useEffect} from "react";
import { useNavigate, useParams } from "react-router-dom";
import Axios from "axios";
import { useImmerReducer } from "use-immer";
import Rating from '../Components/Rating'

// Assets
import defaultProfilePicture from "./Assets/defaultProfilePicture.jpg";

// MUI
import {
    Grid,
    Typography,
    Card,
    CardMedia,
    CardContent,
    CircularProgress,
    CardActions, Button,
} from "@mui/material";


function AgencyDetail() {
    const navigate = useNavigate();
    const randomStar = Math.round(Math.random() * (5) * 10)/10

    const params = useParams();

    const initialState = {
        userProfile: {
            agencyName: "",
            phoneNumber: "",
            profilePic: "",
            bio: "",
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
                break;

            case "loadingDone":
                draft.dataIsLoading = false;
                break;
        }
    }

    const [state, dispatch] = useImmerReducer(ReducerFuction, initialState);

    // request to get profile info
    useEffect(() => {
        async function GetProfileInfo() {
            try {
                const response = await Axios.get(
                    `https://listingbuddy-d88c1ed5b70e.herokuapp.com/api/profiles/${params.id}/`
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


    return (
        <div style={{display: 'flex', gap: '10px',  marginTop: '20px', padding: '50px'}}>
            {state.dataIsLoading === true &&
                <Grid container justifyContent="center" alignItems="center" style={{ height: "90vh" }}>
                    <CircularProgress />
                </Grid>
            }
            <Grid
                container
                alignContent={"flex-start"}
                style={{
                    width: "50%",
                    padding: "5px",
                    backgroundColor: 'white',
                    paddingLeft: "60px",
                }}
            >
                <Grid item marginBottom={5}>
                    <img
                        alt={'profile'}
                        style={{ width: "22rem", marginTop: '2rem'}}
                        src={
                            state.userProfile.profilePic !== null
                                ? state.userProfile.profilePic
                                : defaultProfilePicture
                        }
                    />
                </Grid>
                <Grid item xs={8}>
                    <Grid item width={"100%"} marginBottom={3} fontWeight={300}>
                        <Typography
                            variant="h6"
                            style={{ textAlign: "left", color: 'rgba(141,141,141,0.75)'}}
                        >
                            <span>ListingBuddy Agent</span>
                        </Typography>

                    </Grid>
                    <Grid item width={"100%"} marginBottom={7} style={{borderBottom: '1px solid black'}}>
                        <Typography
                            variant="h4"
                            style={{ textAlign: "left", marginTop: "1rem", }}
                        >
							<span style={{ color: "black", fontWeight: "bolder" }}>
								{state.userProfile.agencyName}
							</span>
                        </Typography>
                        <div style={{marginTop: '20px', display: 'flex', justifyContent: 'space-between'}}>
                            <span>License # {Math.floor(Math.random() * (54554544 - 100000) + 1000000)}</span>
                            <Rating value={randomStar} color={'#f8e825'} text={randomStar}/>

                        </div>
                    </Grid>
                    <Grid item width={"100%"} marginBottom={2}>
                        <Typography
                            variant="h5"
                            style={{ textAlign: "left", marginTop: "1rem", color: 'lightskyblue' }}
                        >
                            ({state.userProfile.phoneNumber.substring(0,3)}) { state.userProfile.phoneNumber.substring(3)}
                        </Typography>
                        <Button style={{border: '1px solid black', backgroundColor: 'black', color: 'white', width: '200px', marginTop: '10px'}}>Call Now</Button>
                    </Grid>
                </Grid>

                <Grid item width={'70%'} style={{ marginTop: "2rem", padding: "5px" }}>
                    <span style={{fontSize: "22px", color: 'black'}}>{Math.floor(Math.random() * 100)} Homes Closed In:</span>
                    <Typography style={{ textAlign: "left", marginTop: "0.5rem", }}>

                        Bothell · Seattle · Bellevue · Kirkland · Woodinville · Issaquah ·...

                    </Typography>
                    <a style={{color: 'blue', cursor: 'pointer', fontSize: '18px'}}>View more</a>
                </Grid>


                <Grid item width={'70%'} style={{ marginTop: "5rem", padding: "5px" }}>
                    <span style={{fontSize: "26px", color: 'black'}}>About Me:</span>
                    <Typography style={{ textAlign: "left", marginTop: "1rem", marginBottom: '50px' }}>

                        {state.userProfile.bio}

                    </Typography>
                </Grid>
            </Grid>
            <Grid
                container
                style={{ padding: "0", display: 'flex', alignContent: 'flex-start', marginTop: '5px'}}
            >
                {state.userProfile.sellerListings.map((listing) => {
                    return (
                        <Grid
                            key={listing.id}
                            item
                            style={{  width: "100%", marginBottom: '10px'}}
                        >
                            <Card>
                                <CardMedia
                                    component="img"
                                    height={"250"}
                                    image={
                                    	`https://listingbuddy-d88c1ed5b70e.herokuapp.com${listing.picture1}`
                                    		? `https://listingbuddy-d88c1ed5b70e.herokuapp.com${listing.picture1}`
                                    		: defaultProfilePicture
                                    }
                                    // image={
                                    //
                                    //     listing.picture1 ? listing.picture1 : defaultProfilePicture
                                    // }
                                    alt="Listing Picture"
                                    onClick={() => navigate(`/listing/${listing.id}`)}
                                    style={{ cursor: "pointer" }}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {listing.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {listing.description.substring(0, 100)}...
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    {listing.property_status === "Sale"
                                        ? `${listing.listing_type}: $${listing.price
                                            .toString()
                                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                                        : `${listing.listing_type}: $${listing.price
                                            .toString()
                                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/${
                                            listing.rental_frequency
                                        }`}
                                </CardActions>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        </div>
    );
}

export default AgencyDetail;