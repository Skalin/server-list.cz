
import {BrowserRouter as Redirect} from "react-router-dom";
import axios from "axios";
import * as config from "../config/config";
import {apiUserUrl} from "../config/config";
import normalizeUrl from "normalize-url";
import React, { Component } from 'react';
import jwt from 'jsonwebtoken';


export const UserContext = React.createContext();

export class UserProvider extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            user: {
                    account: this.getUser(),
                    actions: {
                        checkExpiration: this.checkExpiration,
                        checkLogin: this.checkLogin,
                        isOwner: this.isOwner,
                        login: this.login,
                        storeToken: this.storeToken,
                    }
                }
        }
    }

    checkExpiration = ( user ) => {
        return (user.expiration >= new Date().getTime() / 1000);
    };


    loginUser = ( user, email = null, password = null) => {
        if (user)
        {
            if (!this.checkExpiration(user))
            {
                this.reauthenticate(user)
            }
        }

    };

    reauthenticate = ( user ) => {

    };


    login = ( user ) => {

        if (!this.checkLogin() && user)
        {
            console.log(user);
            let loginUrl = normalizeUrl(apiUserUrl + '/login');
            axios.post(loginUrl, {user})
                .then(res => this.storeToken(res.data));
        }

        return true;
    };


    getUser = () => {
        return jwt.decode(localStorage.getItem('user'));
    };


    storeToken = ( token ) => {
        token.expiration = new Date(jwt.decode(token).expiration).getTime() / 1000;
        localStorage.setItem('user', JSON.stringify(token));
    };

    isOwner = ( server ) => {

        if (!this.checkLogin())
        {
            return false;
        }
        let user = this.getUser();

        let url = normalizeUrl(apiUserUrl+'/server/'+server);
        let state = false;
        axios.post(url, {"login_token": user.token})
            .then((res) => state = res.data);

        return state;

    };

    /**
     * get login status (from token that was stored in cookies, if cookies are empty, user is not logged in, thus returning false)
     * @returns boolean
     */
    checkLogin = () => {

        // get login status (from token that was stored in cookies, if cookies are empty, user is not logged in, thus returning false
        let user = this.getUser();
        if (!user)
            return false;

        return this.checkExpiration(user);

    };

    getAttribute = ( attribute ) => {
        let user = this.getUser();
        if (user)
        {
            let data = JSON.parse(user);
            return data[attribute];
        }
    };

    render()
    {
        return (
            <UserContext.Provider value={{
                user: this.state.user,
            }}>
                {this.props.children}
            </UserContext.Provider>
        )
    }

}