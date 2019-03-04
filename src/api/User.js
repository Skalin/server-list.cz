
import {BrowserRouter as Redirect} from "react-router-dom";

export const checkExpiration = ( user ) => {
    return (user.expiration >= new Date().getTime() / 1000);
};


export const loginUser = ( ) => {
    let user = getUser();
    if (user)
    {
        checkExpiration(user);
    }

};

export const getUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};


export const getServers = ( ) => {

    if (checkLogin())
    {

    }
};

export const checkLogin = ( authorize ) => {

    // get login status (from token that was stored in cookies, if cookies are empty, user is not logged in and user has to log in using login url
    //let user = {'login_token': 'aklfjwakfarwa7fa45869z', 'expiration': '12345789'};
    //localStorage.setItem('user', JSON.stringify(user));
    let user = JSON.parse(localStorage.getItem('user'));
    try {
        if (!user)
            throw new DOMException();

        if (!checkExpiration(user))
        {
            throw new DOMException();
        }

    }
    catch (e)
    {
        return false;
    }
    return true;
};