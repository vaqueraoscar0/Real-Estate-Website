import React, {useEffect} from 'react';
import {Button, Typography} from "@mui/material";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import DispatchContext from "../Context/DispatchContext";
import {useContext} from "react";
import {useNavigate} from "react-router-dom";
import {textData1, textData2} from "./Assets/Data/HomeTextData";
import '../App.css'

const Home = () => {
    const navigate = useNavigate()
    const GlobalDispatch = useContext(DispatchContext)

    useEffect(() => {
        GlobalDispatch({type: "isHomepage"});
    }, []);

    return (
        <div className={'home'}>
            <section id={'home'} style={{display: 'flex', justifyContent:'space-around', alignItems:'center'}}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '60vw',
                    paddingLeft: '100px',
                    paddingRight: '120px',
                    marginBottom: '100px',
                    borderRadius: '30px',
                    color: 'black',
                    fontWeight: 'bolder',
                    opacity: '0.8',

                }}>
                    <Typography
                        variant={'h3'}
                        style={{
                            display: 'flex',
                            width: '100%',
                            color: 'white',
                            fontWeight: 'bolder',
                        }}
                    >FIND YOUR NEXT PROPERTY ON THE LISTINGBUDDY WEBSITE</Typography>
                    <div
                        onClick={() => navigate('/listing')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            paddingLeft: '20px',
                            paddingRight: '20px',
                            justifyContent: 'space-between',
                            marginTop: '30px',
                            width: '90%',
                            height: '60px',
                            color: 'grey',
                            backgroundColor: 'white',
                            borderRadius: '10px',
                            cursor: 'pointer'
                        }}>
                        <p>Enter an Address, Neighborhood, city, or Zip code</p>
                        <SearchOutlinedIcon/>

                    </div>

                </div>
                <div style={{
                    marginTop: '300px',
                    width: '50%',
                }}>
                    <img src={require('./assets1/phoneapp.png')} alt={'iphone'}/>
                </div>
            </section>
            <section
                style={{
                    display: 'flex',
                    justifyContent:'space-around',
                    alignItems:'center',
                    gap: '100px',
                    padding: '100px',
                    paddingTop: '180px'
            }}
            >
                <div><img src={require('./Assets/krakenimages-376KN_ISplE-unsplash.jpg')} width={550} alt={'bg-page'}/></div>
                <div>
                    <Typography variant={"h5"} fontWeight={600} fontFamily={'Helvetica'}>EXPERTISE IN LUXURY HOME</Typography>
                    <p style={{fontSize: '20px', fontFamily: 'Helvetica', lineHeight: '30px', fontWeight: '300'}}>Experience the expertise of ListingBuddy for luxury homes in your area.
                        {textData1.substring(0,255)}...
                    </p>
                    <Button variant={"outlined"}>Learn More</Button>
                </div>
            </section>
            <section
                style={{
                    display: 'flex',
                    justifyContent:'space-around',
                    alignItems:'center',
                    gap: '50px',
                    padding: '100px',
                }}
            >
                <div>
                    <Typography variant={"h5"} fontWeight={600} fontFamily={'Helvetica'}>FIND YOUR HOME IN SECONDS</Typography>
                    <p style={{fontSize: '20px', fontFamily: 'Helvetica', lineHeight: '30px', fontWeight: '300'}}>
                        Discover the limitless potential of joining ListingBuddy. Unlock exclusive opportunities
                        in the world of real estate, connect with premier agents, and tap into a wealth of resources.
                        Elevate your career, expand your network, and be part of a community dedicated to excellence.
                        Join ListingBuddy today and experience the difference!</p>
                </div>
                <div style={{ display: 'flex', justifyContent:'space-around', alignItems:'center', gap:' 5px'}} >
                    <img src={require('./Assets/Leonardo_Diffusion_Generate_a_real_like_photo_of_a_house_that_0 (1).jpg')} width={385} alt={'bg-page2'}/>
                    <img src={require('./Assets/Leonardo_Diffusion_Generate_a_real_like_photo_of_a_house_that_0 (3).jpg')} width={385} alt={'bg-page3'}/>
                    {/*<img src={require('./Assets/Leonardo_Diffusion_Generate_a_real_like_photo_of_a_house_that_0 (4).jpg')} width={385}/>*/}
                </div>
            </section>
            <section
                style={{
                    display: 'flex',
                    justifyContent:'space-around',
                    alignItems:'center',
                    gap: '50px',
                    padding: '100px',
                }}
            >
                <div>
                    <img src={require('./Assets/daniel-korpai-aUmq85-2V7I-unsplash.jpg')} width={550} alt={'bg-page3'}/></div>
                <div>
                    <Typography variant={"h4"} fontWeight={600} fontFamily={'Helvetica'}>GET THE LISTINGBUDDY APP</Typography>
                    <p style={{fontSize: '20px', fontFamily: 'Helvetica', lineHeight: '30px', fontWeight: '300', width: '80%'}}>Download our top-rated real estate app for iOS or Android to get alerts the
                        moment your dream home hits the market.</p>
                    <Button variant={"outlined"}>Download in appstore</Button>
                </div>
            </section>
            <section
                style={{
                    display: 'flex',
                    justifyContent:'space-around',
                    alignItems:'center',
                    gap: '50px',
                    padding: '100px',
                }}
            >
                <div>
                    <Typography variant={"h4"} fontWeight={600} fontFamily={'Helvetica'}>SELL YOUR HOME WITH US!</Typography>
                    <p style={{fontSize: '20px', fontFamily: 'Helvetica', lineHeight: '30px', fontWeight: '300', width: '80%'}}>
                        {textData2.substring(0,262)}...
                    </p>
                    <Button variant={"outlined"} onClick={() => navigate('/register')}>GET STARTED.</Button>
                </div>
                <div><img src={require('./Assets/img2.jpg')} width={600} alt={'bg-page3'}/></div>
            </section>
        </div>
    );
};

export default Home;