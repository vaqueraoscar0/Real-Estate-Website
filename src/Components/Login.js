import React, {useContext, useEffect} from 'react';
import {Alert, Button, Grid, Snackbar, TextField, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useImmerReducer} from "use-immer";
import axios from "axios";

import DispatchContext from "../Context/DispatchContext";

const Login = () => {
    const navigate = useNavigate()
    const GlobalDispatch = useContext(DispatchContext)

    const initialState = {
        username: "",
        password: "",
        sendRequest: 0,
        token: "",
        openSnack: false,
        disabledBtn: false,
        serverError: false,
    }

    function ReducerFunction(draft, action){
        switch (action.type) {
            case "catchUsernameChange":
                draft.username = action.usernameChosen
                draft.serverError = false
                break;
            case "catchPasswordChange":
                draft.password = action.passwordChosen
                draft.serverError = false
                break;
            case "changeSendRequest":
                draft.sendRequest = draft.sendRequest + 1
                break;
            case "catchToken":
                draft.token = action.tokenValue
                break;
            case "openTheSnack":
                draft.openSnack = true
                break;
            case 'disabledTheButton':
                draft.disabledBtn = true
                break;
            case 'enabledTheButton':
                draft.disabledBtn = false
                break;
            case 'catchServerError':
                draft.serverError = true
                break;
        }
    }

    const [state, dispatch] = useImmerReducer(ReducerFunction, initialState)

    function FormSubmit(e) {
        e.preventDefault()
        dispatch({type: 'changeSendRequest'})
        dispatch({type: 'disabledTheButton'})
    }


    useEffect(() =>{
        if(state.sendRequest){
            const source = axios.CancelToken.source()
            async function SignIn(){
                try {
                    let res = await axios.post(
                        'https://listingbuddy-d88c1ed5b70e.herokuapp.com/api-auth-djoser/token/login/',
                        {
                            username: state.username,
                            password: state.password,
                        },
                        {
                            cancelToken: source.token,

                        })

                    dispatch({type: 'catchToken', tokenValue: res.data.auth_token})
                    GlobalDispatch({type: 'catchToken', tokenValue: res.data.auth_token})
                }catch (error){
                    dispatch({type: 'enabledTheButton'})
                    dispatch({type: 'catchServerError'})
                }
            }

            SignIn();
            return() => {
                source.cancel();
            }
        }
    }, [state.sendRequest])

    useEffect(() =>{
        if(state.token !== ''){
            const source = axios.CancelToken.source()
            async function GetUserInfo(){
                try {
                    let res = await axios.get(
                        'https://listingbuddy-d88c1ed5b70e.herokuapp.com/api-auth-djoser/users/me/',
                        {
                            headers: {Authorization: "Token ".concat(state.token)}
                        },
                        {
                            cancelToken: source.token,

                        })

                    dispatch({type: 'openTheSnack'})
                    GlobalDispatch({type: 'userSignsin', usernameInfo: res.data.username, emailInfo: res.data.email, idInfo: res.data.id })
                }catch (error){
                    console.log(error.response)
                }
            }

            GetUserInfo();
            return() => {
                source.cancel();
            }
        }
    }, [state.token])

    useEffect(() => {
        if(state.openSnack){
            setTimeout(() => {
                navigate("/")
            }, 1500 )
        }
    }, [state.openSnack])

    return (
        <div>
            <div
                style={{
                    width: "35%",
                    height: '500px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    marginTop: '6rem',
                    marginBottom: '6rem',
                    border: '1px solid whitesmoke',
                    padding: '5rem',
                    borderRadius: "20px",
                    backgroundColor: "white",
                    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px"
                    // boxShadow: "rgba(136, 165, 191, 0.48) 6px 2px 16px 0px, rgba(255, 255, 255, 0.8) -6px -2px 16px 0px"
                }}
            >
                <form onSubmit={FormSubmit}>
                    <Grid item container justifyContent={'center'}>
                        <Typography variant={'h4'} fontWeight={500}>Sign In</Typography>
                    </Grid>

                    {state.serverError ? (
                        <Alert severity={'error'} style={{marginTop: '2rem'}}>Incorrect username or password!</Alert>
                    ):('')}

                    <Grid item container style={{marginTop: !state.serverError ? '4rem' : '1rem'}}>
                        <TextField
                            onChange={(e) => dispatch({type: 'catchUsernameChange', usernameChosen: e.target.value})}
                            id="username"
                            label="Username"
                            variant="outlined"
                            fullWidth
                            error={state.serverError? true: false}
                        />
                    </Grid>
                    <Grid item container style={{marginTop: '1rem'}}>
                        <TextField
                            onChange={(e) => dispatch({type: 'catchPasswordChange', passwordChosen: e.target.value})}
                            id="password"
                            label="Password"
                            variant="outlined"
                            type={'password'}
                            fullWidth
                            error={state.serverError? true: false}
                        />
                    </Grid>

                    <Grid item container style={{marginTop: '4rem', marginRight: 'auto', marginLeft: 'auto'}} xs={8} justifyContent={"center"}>
                        <Button
                            disabled={state.disabledBtn}
                            type={'submit'}
                            variant="contained"
                            fullWidth
                            style={{height: "60px", backgroundColor: state.disabledBtn? 'white' : 'black'}}>LOGIN</Button>
                    </Grid>

                    <Grid item container style={{marginTop: '1.5rem', marginRight: 'auto', marginLeft: 'auto'}} xs={8} justifyContent={"center"}>
                        <Typography variant={'small'}>Don't have an account? <span onClick={() => navigate('/register')} style={{cursor: 'pointer', color: "blue", paddingLeft: '3px'}}>Sign up</span></Typography>
                    </Grid>
                    <Snackbar
                        open={state.openSnack}
                        message="You've Successfully logged in!"
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: "center"
                        }}
                    />
                </form>

            </div>
        </div>
    );
};

export default Login;