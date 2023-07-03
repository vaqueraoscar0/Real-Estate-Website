import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Listing from "./Components/Listing";
import {StyledEngineProvider} from "@mui/system";
import Header from "./Components/Header";
import Register from "./Components/Register";
import {useImmerReducer} from "use-immer";

//Context
import DispatchContext from "./Context/DispatchContext";
import StateContext from "./Context/StateContext";
import {useEffect} from "react";
import Profile from "./Components/Profile";
import Agencies from "./Components/Agencies";
import AgencyDetail from "./Components/AgencyDetail";
import ListingDetail from "./Components/ListingDetail";
import AddProperty from "./Components/AddProperty";
import {Footer} from "./Components/Footer";
import {Copyright} from "@mui/icons-material";
import CopyrightPage from "./Components/CopyrightPage";

function App(key, value) {
  const initialState = {
    username: localStorage.getItem('theUsername'),
    userEmail: localStorage.getItem('theUserEmail'),
    userId: localStorage.getItem('theUserId'),
    userToken: localStorage.getItem('theUserToken'),
    userIsLogged: !!localStorage.getItem('theUsername'),
    isHomepage: localStorage.getItem('isHomepage'),
  }

  function ReducerFunction(draft, action){
    switch (action.type) {
      case "catchToken":
        draft.userToken = action.tokenValue;
        break;
      case "userSignsin":
        draft.username = action.usernameInfo
        draft.userEmail = action.emailInfo
        draft.userId = action.idInfo
        draft.userIsLogged = true
        break;
      case "logout":
        draft.userIsLogged = false
        break;
      case "isHomepage":
        draft.isHomepage = true
        break;
      case "isNotHomepage":
        draft.isHomepage = true
        break;
    }
  }

  const [state, dispatch] = useImmerReducer(ReducerFunction, initialState)

  useEffect(() =>{
    if(state.userIsLogged){
      console.log(state.username, 'yse')
      localStorage.setItem('theUsername', state.username)
      localStorage.setItem('theUserEmail', state.userEmail)
      localStorage.setItem('theUserId', state.userId)
      localStorage.setItem('theUserToken', state.userToken)
    }else{
      localStorage.removeItem('theUsername')
      localStorage.removeItem('theUserEmail')
      localStorage.removeItem('theUserId')
      localStorage.removeItem('theUserToken')
    }

  }, [state.userIsLogged])

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <StyledEngineProvider injectFirst>
            <BrowserRouter basename={"/Real-Estate-Website"}>
              <Header/>
              <Routes>
                <Route path={'/'} element={<Home/>}/>
                <Route path={'/login'} element={<Login/>}/>
                <Route path={'/listing'} element={<Listing/>}/>
                <Route path={'/register'} element={<Register/>}/>
                <Route path={'/profile'} element={<Profile/>}/>
                <Route path={'/about'} element={<CopyrightPage/>}/>
                <Route path={'/addproperty'} element={<AddProperty/>}/>
                <Route path={'/agencies'} element={<Agencies/>}/>
                <Route path={'/agencies/:id'} element={<AgencyDetail/>}/>
                <Route path={'/listing/:id'} element={<ListingDetail/>}/>

              </Routes>
              <Footer/>
            </BrowserRouter>
        </StyledEngineProvider>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

export default App;
