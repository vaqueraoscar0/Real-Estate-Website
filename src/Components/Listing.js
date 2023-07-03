import React, {useEffect, useState} from 'react';
import {MapContainer, TileLayer, Marker, Popup, useMap} from 'react-leaflet'
import {
    Grid,
    AppBar,
    Typography,
    Button,
    Card,
    CardHeader,
    CardMedia,
    CardContent,
    CircularProgress,
    IconButton, CardActions
} from "@mui/material";
import {Icon} from 'leaflet'
import houseiconpng from './Assets/Mapicons/house.png'
import officeiconpng from './Assets/Mapicons/office.png'
import condoiconpng from './Assets/Mapicons/apartment.png'
import RoomIcon from '@mui/icons-material/Room';
import axios from "axios";
import {useImmerReducer} from "use-immer";
import {useNavigate} from "react-router-dom";

function Listing(){
    const navigate = useNavigate()
    const [allListings, setAllListings] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() =>{
        const source = axios.CancelToken.source()
        let url = 'https://listingbuddy-d88c1ed5b70e.herokuapp.com/api/listings'
        async function GetAllListings(){
            try {
                let res = await axios.get(url, {cancelToken: source.token})
                setAllListings(res.data)
                setIsLoading(false)
            }catch (error){
                console.log(error.response)
            }
        }

        GetAllListings();
        return () =>{
            source.cancel()
        }
    }, [])


    const houseIcon = new Icon({
        iconUrl: houseiconpng,
        iconSize: [40,40],
    })

    const officeIcon = new Icon({
        iconUrl: officeiconpng,
        iconSize: [40,40],
    })

    const condoIcon = new Icon({
        iconUrl: condoiconpng,
        iconSize: [40,40],
    })


    const [latitude, setLatitude] = useState(51.505)
    const [longitude, setLongitude] = useState(-0.09)

    const initialState = {
        mapInstance: null,
    }

    function ReducerFunction(draft, action){
        switch (action.type) {
            case "getMap":
                draft.mapInstance = action.mapData
                break;
            default:
                break;
        }
    }

    const [state, dispatch] = useImmerReducer(ReducerFunction, initialState)

    function TheMapComponent(){
        const map = useMap()
        dispatch({type: 'getMap', mapData: map})
        return null
    }


    return (
        <Grid container>
            <Grid item xs={4}>
                {isLoading && <CircularProgress style={{position: "relative", left: "40%", top: '20%'}}/>}
                {allListings.map((listing) => {
                    return (
                            <Card
                                key={listing.id}
                                style={{
                                    margin: '0.5rem',
                                    border: '1px solid black'
                                }}
                            >
                            <CardHeader
                            action={
                                <IconButton aria-label="settings" onClick={() => state.mapInstance.flyTo([listing.latitude, listing.longitude], 16)}>
                                    <RoomIcon />
                                </IconButton>
                            }
                            title={listing.title}
                            // subheader="September 14, 2016"
                            />
                            {
                                listing.property_status === 'Sale'? (
                                    <Typography
                                        style={{
                                            position:'relative',
                                            width: '200px',
                                            backgroundColor: 'green',
                                            zIndex: '1000',
                                            color: "white",
                                            left: '21px',
                                            top: '34px',
                                            padding: '5px'

                                        }}
                                    >
                                        {listing.listing_type}{": "}
                                        ${listing.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    </Typography>
                                ): (
                                    <Typography
                                        style={{
                                            position:'relative',
                                            width: '250px',
                                            backgroundColor: 'green',
                                            zIndex: '1000',
                                            color: "white",
                                            left: '21px',
                                            top: '34px',
                                            padding: '5px'

                                        }}
                                    >
                                        {listing.listing_type}{": "}
                                        ${listing.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "} / {listing.rental_frequency}
                                    </Typography>
                                )
                            }
                            <CardMedia
                            component="img"
                            image={listing.picture1}
                            style={{
                                paddingRight: '1rem',
                                paddingLeft: '1.3rem',
                                width: '90%',
                                cursor: 'pointer'
                            }}
                            alt={listing.title}
                            onClick={() => navigate(`/listing/${listing.id}`)}
                            />
                            <CardContent>
                            <Typography variant="body2">
                                {listing.description.substring(0,200)}...
                            </Typography>
                            </CardContent>
                            <CardActions disableSpacing>
                                <IconButton aria-label="add to favorites">
                                    {listing.seller_agency_name.toUpperCase()}
                                </IconButton>
                            </CardActions>
                            </Card>
                    )
                })}
            </Grid>
            <Grid item xs={8} style={{marginTop: '0.5rem'}}>
                <AppBar position={'sticky'}>
                    <div style={{height: "100vh"}}>
                        <MapContainer
                            key={state.keyMAP}
                            center={[51.505, -0.09]}
                            zoom={14}
                            scrollWheelZoom={true}>
                            <TileLayer
                                attribution="Google Maps"
                                url="https://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
                            />
                            <TheMapComponent/>

                            {isLoading && <CircularProgress/>}
                            {
                                allListings.map((listings) =>{
                                    let iconDisplay = () => {
                                        if(listings.listing_type === 'House'){
                                            return houseIcon;
                                        }else if(listings.listing_type === 'Apartment'){
                                            return condoIcon;
                                        }else if(listings.listing_type === "Office"){
                                            return officeIcon;
                                        }
                                    }
                                    return (
                                        <Marker
                                            key={listings.id}
                                            icon={iconDisplay()}
                                            position={[listings.latitude? listings.latitude: latitude, listings.longitude? listings.longitude: longitude]}
                                        >
                                            <Popup>
                                                <Typography variant={'h5'}>{listings.title}</Typography>
                                                <img onClick={() => navigate(`/listing/${listings.id}`)}  src={listings.picture1} style={{height:'14rem', width: '18rem', cursor: 'pointer'}} alt={'uploads'}/>
                                                <Typography variant={'body1'}>{listings.description.substring(0,150)}....</Typography>
                                                <Button onClick={() => navigate(`/listing/${listings.id}`)} variant={'contained'} fullWidth style={{backgroundColor: 'blue', color: 'white'}}>Details</Button>
                                            </Popup>


                                        </Marker>
                                    )
                                })
                            }

                        </MapContainer>
                    </div>
                </AppBar>
            </Grid>
        </Grid>
    );
}

export default Listing;