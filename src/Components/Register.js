import React, {useEffect} from 'react';
import {Alert, Button, Grid, Snackbar, TextField, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {useImmerReducer} from "use-immer";

const Register = () => {
    const navigate  = useNavigate()

    const initialState = {
        username: "",
        email: "",
        password: "",
        re_password: "",
        sendRequest: 0,
        openSnack: false,
        disabledBtn: false,
        usernameErrors:{
            hasErrors: false,
            errorMessage: '',
        },
        emailErrors:{
            hasErrors: false,
            errorMessage: '',
        },
        passwordErrors:{
            hasErrors: false,
            errorMessage: '',
        },
        re_passwordErrors:{
            hasErrors: false,
            errorMessage: '',
        },
        serverMessageUsername: '',
        serverMessageEmail: '',
        serverMessageSimilarPassword: '',
        serverMessageCommonPassword: '',
        serverMessageNumericPassword: '',
    }

    function ReducerFunction(draft, action){
        switch (action.type) {
            case "catchUsernameChange":
                draft.username = action.usernameChosen
                draft.usernameErrors.hasErrors = false
                draft.usernameErrors.errorMessage = ''
                draft.serverMessageUsername = ''
                break;
            case "catchEmailChange":
                draft.email = action.emailChosen
                draft.emailErrors.hasErrors = false
                draft.emailErrors.errorMessage = ""
                draft.serverMessageEmail = ''
                break;
            case "catchPasswordChange":
                draft.password = action.passwordChosen
                draft.passwordErrors.hasErrors = false
                draft.passwordErrors.errorMessage = ""
                draft.serverMessageSimilarPassword = ''
                draft.serverMessageCommonPassword = ''
                draft.serverMessageNumericPassword = ''
                break;
            case "catchRePasswordChange":
                draft.re_password = action.re_passwordChosen
                if(action.re_passwordChosen !== draft.password){
                    draft.re_passwordErrors.hasErrors = true
                    draft.re_passwordErrors.errorMessage = "passwords do not match"
                }else{
                    draft.re_passwordErrors.errorMessage = ""
                    draft.re_passwordErrors.hasErrors = false
                }
                break;
            case "changeSendRequest":
                draft.sendRequest = draft.sendRequest + 1
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
            case 'catchUsernameError':
                if(action.usernameChosen.length === 0){
                    draft.usernameErrors.hasErrors = true
                    draft.usernameErrors.errorMessage = "This field must not be empty"
                }else if(action.usernameChosen.length < 5){
                    draft.usernameErrors.hasErrors = true
                    draft.usernameErrors.errorMessage = "username must have at least 5 characters"
                }else if(!/^([a-zA-Z0-9]+)$/.test(action.usernameChosen)){
                    draft.usernameErrors.hasErrors = true
                    draft.usernameErrors.errorMessage = "this field must not have special characters"
                }
                break;
            case 'catchEmailError':
                if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(action.emailChosen)) {
                    draft.emailErrors.hasErrors = true
                    draft.emailErrors.errorMessage = "please enter a valid email!"
                }
                break;
            case 'catchPasswordError':
                if(action.passwordChosen.length < 8){
                    draft.passwordErrors.hasErrors = true
                    draft.passwordErrors.errorMessage = "password must have at least 8 characters"
                }
                break;
            case "catchRePasswordError":
                if(action.re_passwordChosen.length < 8){
                    draft.re_passwordErrors.hasErrors = true
                    draft.re_passwordErrors.errorMessage = "password must have at least 8 characters"
                }
                break;
            case 'usernameExist':
                draft.serverMessageUsername = 'This username already exists!'
                break;
            case 'emailExist':
                draft.serverMessageEmail = 'This email is already registered!'
                break;
            case 'similarPassword':
                draft.serverMessageSimilarPassword = 'The Password is too similar to the username'
                break;
            case 'commonPassword':
                draft.serverMessageCommonPassword = 'The Password is too common'
                break;
            case 'numericPassword':
                draft.serverMessageNumericPassword = 'The Password must not contain purely numerical values'
                break;
        }
    }

    const [state, dispatch] = useImmerReducer(ReducerFunction, initialState)

    function FormSubmit(e) {
        e.preventDefault()
        if(!state.usernameErrors.hasErrors &&
            !state.emailErrors.hasErrors &&
            !state.passwordErrors.hasErrors &&
            !state.re_passwordErrors.hasErrors
        ){
            dispatch({type: 'changeSendRequest'})
            dispatch({type: 'disabledTheButton'})
        }
    }

    // The password is too similar to the username.
    //This password is too common.
    //This password is too common.
    //This password is entirely numeric.

    useEffect(() =>{
        if(state.sendRequest){
            const source = axios.CancelToken.source()
            async function Signup(){
                try {
                    await axios.post(
                        'https://listingbuddy-d88c1ed5b70e.herokuapp.com/api-auth-djoser/users/',
                        {
                            username: state.username,
                            email: state.email,
                            password: state.password,
                            re_password: state.re_password,
                        },
                        {
                            cancelToken: source.token,

                        })

                    dispatch({type: 'openTheSnack'})
                }catch (error){
                    dispatch({type: 'enabledTheButton'})
                    if(error.response.data.username){
                        dispatch({type: 'usernameExist'})
                    }else if(error.response.data.email){
                        dispatch({type: 'emailExist'})
                    }else if(error.response.data.password.length > 1 || error.response.data.password[1] === 'This password is entirely numeric.'){
                        dispatch({type: 'numericPassword'})
                    }else if(error.response.data.password[0] === 'The password is too similar to the username.'){
                        dispatch({type: 'similarPassword'})
                    }else if(error.response.data.password[0] === 'This password is too common.'){
                        dispatch({type: 'commonPassword'})
                    }
                }
            }

            Signup();
            return() => {
                source.cancel();
            }
        }
    }, [state.sendRequest])

    useEffect(() => {
        if(state.openSnack){
            setTimeout(() => {
                navigate("/login")
            }, 1500 )
        }
    }, [state.openSnack])

    return (
        <div
            style={{
                width: "45%",
                height: "800px",
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: '6rem',
                marginBottom: '6rem',
                border: '1px solid whitesmoke',
                padding: '4rem',
                borderRadius: "20px",
                backgroundColor: "white",
                boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px"
            }}
        >
            <form onSubmit={FormSubmit}>
                <Grid item container justifyContent={'center'}>
                    <Typography variant={'h4'} fontWeight={500}>CREATE AN ACCOUNT</Typography>
                </Grid>

                {state.serverMessageUsername &&
                    <Alert severity={'error'} style={{marginTop: '2rem'}}>{state.serverMessageUsername}</Alert>
                }

                {state.serverMessageEmail &&
                    <Alert severity={'error'} style={{marginTop: '2rem'}}>{state.serverMessageEmail}</Alert>
                }

                {state.serverMessageSimilarPassword &&
                    <Alert severity={'error'} style={{marginTop: '2rem'}}>{state.serverMessageSimilarPassword}</Alert>
                }

                {state.serverMessageCommonPassword &&
                    <Alert severity={'error'} style={{marginTop: '2rem'}}>{state.serverMessageCommonPassword}</Alert>
                }

                {state.serverMessageNumericPassword &&
                    <Alert severity={'error'} style={{marginTop: '2rem'}}>{state.serverMessageNumericPassword}</Alert>
                }

                <Grid item container style={{marginTop: state.serverMessageUsername ? '1rem': '3rem'}}>
                    <TextField
                        onChange={(e) => dispatch({type: 'catchUsernameChange', usernameChosen: e.target.value})}
                        onBlur={(e) => dispatch({type: 'catchUsernameError', usernameChosen: e.target.value})}
                        id="username"
                        label="Username"
                        error={state.usernameErrors.hasErrors}
                        helperText={state.usernameErrors.errorMessage}
                        variant="outlined" fullWidth/>
                </Grid>
                <Grid item container style={{marginTop: '3rem'}}>
                    <TextField
                        onChange={(e) => dispatch({type: 'catchEmailChange', emailChosen: e.target.value})}
                        onBlur={(e) => dispatch({type: 'catchEmailError', emailChosen: e.target.value})}
                        error={state.emailErrors.hasErrors}
                        helperText={state.emailErrors.errorMessage}
                        id="email"
                        label="Email"
                        variant="outlined"
                        type={'email'} fullWidth/>
                </Grid>
                <Grid item container style={{marginTop: '3rem'}}>
                    <TextField
                        onChange={(e) => dispatch({type: 'catchPasswordChange', passwordChosen: e.target.value})}
                        onBlur={(e) => dispatch({type: 'catchPasswordError', passwordChosen: e.target.value})}
                        error={state.passwordErrors.hasErrors}
                        helperText={state.passwordErrors.errorMessage}
                        id="password"
                        label="Password"
                        variant="outlined"
                        type={'password'} fullWidth/>
                </Grid>
                <Grid item container style={{marginTop: '3rem'}}>
                    <TextField
                        onChange={(e) => dispatch({type: 'catchRePasswordChange', re_passwordChosen: e.target.value})}
                        onBlur={(e) => dispatch({type: 'catchRePasswordError', re_passwordChosen: e.target.value})}
                        error={state.re_passwordErrors.hasErrors}
                        helperText={state.re_passwordErrors.errorMessage}
                        id="password2"
                        label="Confirm Password"
                        variant="outlined"
                        type={'password'} fullWidth/>
                </Grid>

                <Grid item container style={{marginTop: '7rem', marginRight: 'auto', marginLeft: 'auto'}} xs={8} justifyContent={"center"}>
                    <Button disabled={state.disabledBtn} type={'submit'} variant="contained" fullWidth style={{height: "60px", backgroundColor: state.disabledBtn? 'white' : 'black'}}>SIGN UP</Button>
                </Grid>

                <Grid item container style={{marginTop: '1rem', marginRight: 'auto', marginLeft: 'auto'}} xs={8} justifyContent={"center"}>
                    <Typography variant={'small'}>Already have an account? <span onClick={() => navigate('/login')} style={{cursor: 'pointer', color: "blue"}}> Sign in</span></Typography>
                </Grid>
                <Snackbar
                    open={state.openSnack}
                    message="You've Successfully Registered!"
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: "center"
                    }}
                />
            </form>

        </div>
    );
};

export default Register;