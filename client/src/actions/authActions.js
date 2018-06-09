import axios from "axios";
import jwt_decode from "jwt-decode";
import { GET_ERRORS, SET_CURRENT_USER } from "./types";
import setAuthToken from "../utils/setAuthToken";

//Register user

export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/api/users/register", userData)
    .then(res => history.push("/login"))
    .catch(err => dispatch({ type: GET_ERRORS, payload: err.response.data }));
};

//Login User = Get User Token

export const loginUser = userData => dispatch => {
  axios
    .post("/api/users/login", userData)
    .then(res => {
      //Save to local storage
      const { token } = res.data;

      //set token to local storage
      localStorage.setItem("jwtToken", token);

      //Set TOken to auth header
      setAuthToken(token);

      //Decode token to get user data
      const decoded = jwt_decode(token);

      //Set Curent User
      dispatch(setCurrentUser(decoded));
    })
    .catch(err => dispatch({ type: GET_ERRORS, payload: err.response.data }));
};

//Set Logged in user

export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

//Log user out

export const logoutUser = () => dispatch => {
  //Remove token from local storage
  localStorage.removeItem("jwtToken");

  //Remove AUth Header for fture requests
  setAuthToken(false);

  //Set the current user to an empty object
  //Which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};
