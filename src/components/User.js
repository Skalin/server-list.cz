
import {BrowserRouter as Redirect} from "react-router-dom";
import axios from "axios";
import * as config from "../config/config";
import {apiUserUrl} from "../config/config";
import normalizeUrl from "normalize-url";

export const checkExpiration = ( user ) => {
    return (user.expiration >= new Date().getTime() / 1000);
};


export const loginUser = ( user, email = null, password = null) => {
    if (user)
    {
        if (!checkExpiration(user))
        {
            reauthenticate(user)
        }
    }

};

const reauthenticate = ( user ) => {

};


export const login = ( user ) => {

    if (!checkLogin())
    {
        let loginUrl = normalizeUrl(apiUserUrl + '/login');
        axios.post(loginUrl, {user})
            .then(res => storeToken(res.data));
    }

    return true;
};


export const getUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};


const storeToken = ( token ) => {
    token.expiration = new Date(token.expiration).getTime() / 1000;
    localStorage.setItem('user', JSON.stringify(token));
};

export const isOwner = ( server ) => {

    if (!checkLogin())
    {
        return false;
    }
    let user = getUser();

    let url = normalizeUrl(apiUserUrl+'/server/'+server);
    var state = false;
    axios.post(url, {"login_token": user.token})
        .then(res => state = res.data);

    return state;

};

/**
 * get login status (from token that was stored in cookies, if cookies are empty, user is not logged in, thus returning false)
 * @returns boolean
 */
export const checkLogin = () => {

    // get login status (from token that was stored in cookies, if cookies are empty, user is not logged in, thus returning false
    let user = getUser();
    if (!user)
        return false;

    return checkExpiration(user);

};

export const getAttribute = ( attribute ) => {
    let user = getUser();
    if (user)
    {
        let data = JSON.parse(user);
        return data[attribute];
    }
};