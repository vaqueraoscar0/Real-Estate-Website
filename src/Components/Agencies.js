import React, { useEffect} from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { useImmerReducer } from "use-immer";
import iconCustomer2 from './Assets/1205851511652415486.svg'
import iconCustomer3 from './Assets/10712162641640754941.svg'
import iconCustomer5 from './Assets/9359695971668214040.svg'


// Assets
import defaultProfilePicture from "./Assets/defaultProfilePicture.jpg";

// MUI
import {
    Grid,
    Typography,
    Button,
    Card,
    CardMedia,
    CardContent,
    CircularProgress,
    CardActions,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

const Agencies = () => {
    const navigate = useNavigate();

    const initialState = {
        dataIsLoading: true,
        agenciesList: [],
    };

    function ReducerFuction(draft, action) {
        switch (action.type) {
            case "catchAgencies":
                draft.agenciesList = action.agenciesArray;
                break;

            case "loadingDone":
                draft.dataIsLoading = false;
                break;
        }
    }

    const [state, dispatch] = useImmerReducer(ReducerFuction, initialState);

    useEffect(() => {
        async function GetAgencies() {
            try {
                const response = await Axios.get(
                    `https://listingbuddy-d88c1ed5b70e.herokuapp.com/api/profiles/`
                );

                dispatch({
                    type: "catchAgencies",
                    agenciesArray: response.data,
                });
                dispatch({ type: "loadingDone" });
            } catch (e) {}
        }
        GetAgencies();
    }, []);

    return (
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <section id={'homesection'}>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-end',
                        width: '50%',
                        height: '90%',
                        color: 'white',
                        fontWeight: 'bolder',
                        padding: '40px'
                    }}
                >
                    <p style={{fontSize: '30px', fontFamily: 'Times'}}>ListingBuddy <br/> <span style={{fontSize: '20px',}}>Unleash Exceptional Service with ListingBuddy's Elite Agents</span></p>

                </div>

            </section>
            <section id={'introagent'} style={{width: '80%',display: "flex", justifyContent: 'space-between', alignItems: 'center', marginTop: '30px', padding: '80px', backgroundColor: "white"}}>
                <div>
                    <p style={{fontSize: '40px', fontWeight: '600', marginBottom: '0'}}>Learn More About Our Agents</p>
                    <p style={{width: '80%', fontWeight: '500', fontSize: '20px', color: "gray"}}>Experience Unmatched Excellence with ListingBuddy's Premier Agents. Trust in our seasoned
                        professionals who specialize in buying and selling luxury homes. Our stringent qualifications
                        ensure that only the best agents become ListingBuddy Premier agents, providing you with exceptional
                        expertise and personalized service.</p>
                </div>
                <div>
                    <img src={require('../Components/Assets/bgmg.jpg')} style={{width: '500px'}} alt={'bgmg'}/>
                </div>

            </section>

            <section id={'introagent'} style={{width: '100%', display: "flex", flexDirection: 'column', alignItems: 'flex-start', marginTop: '50px', marginBottom: '50px', gap: '40px', paddingLeft: '120px'}}>
                <div>
                    <p style={{fontSize: '40px', fontWeight: '600', marginBottom: '0'}}>Why Choose a ListingBuddy Agent?</p>
                </div>
                <div style={{display: 'flex', flexDirection: 'row', gap: '50px'}}>
                    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', padding: '30px', width: '250px', height: '250px', backgroundColor: 'white', boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px"}}>
                        <img src={iconCustomer5} width={50} alt={'customer-icon'}/>
                        <p style={{fontWeight: '600', paddingTop: '10px',}}>Happier Customers</p>
                        <p style={{color: 'grey'}}>ListingBuddy: Exceptional Service, Guaranteed. Our agents deliver exceptional service, backed by customer surveys.</p>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', padding: '30px', width: '250px', height: '250px', backgroundColor: 'white', boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px"}}>
                        <img src={iconCustomer2} width={50} alt={'customer-icon2'}/>
                        <p style={{fontWeight: '600', paddingTop: '10px',}}>The best service at a better price</p>
                        <p style={{color: 'grey'}}>ListingBuddy: Value and Results. Our agents sell homes for $1,800 more on average while charging less.</p>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', padding: '30px', width: '250px', height: '250px', backgroundColor: 'white', boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px"}}>
                        <img src={iconCustomer3} width={50} alt={'customer-icon2'}/>
                        <p style={{fontWeight: '600', paddingTop: '10px',}}>Local agents to guide you</p>
                        <p style={{color: 'grey'}}>ListingBuddy: Unmatched Service, Competitive Pricing. Experience superior service and maximize your profits.</p>
                    </div>
                </div>

            </section>


            {state.dataIsLoading &&
                    <Grid container justifyContent="center" alignItems="center" style={{ height: "90vh" }}><CircularProgress /></Grid>
            }

            <section style={{width: '85%', marginTop: '30px', padding: '80px', gap: '120px', backgroundColor: "white"}}>
                <p style={{fontSize: '40px', fontWeight: '600', marginBottom: '30px', marginTop: '0'}}>Real Estate Agents</p>
                <div

                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '50%',
                        height: '60px',
                        color: 'grey',
                        backgroundColor: 'white',
                        borderRadius: '10px',
                        border: '1px solid black',
                        paddingLeft: '10px',
                        paddingRight: '10px',
                        marginBottom: '50px',
                        cursor: 'text'
                    }}>
                    <p>Enter an Address, Neighborhood, city, or Zip code</p>
                    <SearchOutlinedIcon style={{borderLeft: '1px solid black'}}/>

                </div>
                <Typography variant={"h5"}>Find the best local agents</Typography>
                <p style={{fontSize: '18px', fontWeight: '200', marginBottom: '30px'}}>ListingBuddy Agents: Leaders in Excellence. Join the ranks of our top 1%
                    agents nationwide, recognized for their unparalleled experience in the industry.
                    Backed by powerful technology and armed with local expertise, our agents excel in writing
                    winning offers and maximizing the value of your home sale. Trust ListingBuddy for a proven
                    track record of success and exceptional results.</p>
                <label htmlFor={'sortagent'} style={{fontWeight: '500', fontSize: '20px', color: 'black'}}>Sort: </label>
                <Button id={'sortagent'} style={{color: 'grey'}}>Name <ArrowDropDownIcon/></Button>
                <Grid
                    container
                    justifyContent="center"
                    spacing={2}
                    style={{ padding: "20px", marginTop: '30px'}}
                >
                    {state.agenciesList.map((agency) => {
                        function PropertiesDisplay() {
                            switch (agency.seller_listings.length) {
                                case 0:
                                    return (<Button disabled size="small">No Property</Button>)
                                case 1:
                                    return (
                                        <Button size="small" onClick={() => navigate(`/agencies/${agency.seller}`)}>
                                            1 Property listed
                                        </Button>
                                    )
                                default:
                                    return (
                                        <Button size="small" onClick={() => navigate(`/agencies/${agency.seller}`)}>
                                            {agency.seller_listings.length} Properties
                                        </Button>
                                    )
                            }
                        }

                        if (agency.agency_name && agency.phone_number)
                            return (
                                <Grid
                                    key={agency.id}
                                    item
                                    style={{display: 'flex', justifyContent: 'center', marginTop: "1rem", width: "20rem", height: '28rem', marginBottom: '5px'}}
                                >
                                    <Card>
                                        <CardMedia
                                            component="img"
                                            height="250"
                                            image={
                                                agency.profile_picture
                                                    ? agency.profile_picture
                                                    : defaultProfilePicture
                                            }
                                            alt="Profile Picture"
                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="div">
                                                {agency.agency_name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {agency.bio.substring(0, 100)}...
                                            </Typography>
                                        </CardContent>
                                        <CardActions>{PropertiesDisplay()}</CardActions>
                                    </Card>
                                </Grid>
                            );
                    })}
                </Grid>

            </section>

        </div>
    );
};

export default Agencies;