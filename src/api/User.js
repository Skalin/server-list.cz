
import {BrowserRouter as Redirect} from "react-router-dom";

export const checkExpiration = ( user ) => {

    if (user.expiration < new Date().getTime()/1000)
        return false;
    return true
};

export const checkLogin = () => {

    // get login status (from token that was stored in cookies, if cookies are empty, user is not logged in and user has to log in using login url
    let user = {'login_token': 'aklfjwakfarwa7fa45869z', 'expiration': '12345789'};
    localStorage.setItem('user', JSON.stringify(user));
    user = JSON.parse(localStorage.getItem('user'));
    if (!user)
        return false;

    try {
        if (!checkExpiration(user))
            return false;
    }
    catch (e)
    {

    }
    return true;
}