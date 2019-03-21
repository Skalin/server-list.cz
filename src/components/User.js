
import {BrowserRouter as Redirect} from "react-router-dom";
import axios from "axios";
import * as config from "../config/config";
import {apiUserUrl} from "../config/config";
import normalizeUrl from "normalize-url";
import React, { Component } from 'react';


export const Context = React.createContext();

export class Provider extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            user: this.getUser()
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
        return JSON.parse(localStorage.getItem('user'));
    };


    storeToken = ( token ) => {
        token.expiration = new Date(token.expiration).getTime() / 1000;
        localStorage.setItem('user', JSON.stringify(token));
    };

    isOwner = ( server ) => {

        if (!this.checkLogin())
        {
            return false;
        }
        let user = this.getUser();

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
            <Context.Provider value={{
                user: this.state,
                actions: {
                    loginUser: this.login()
                }
            }}>
                {this.props.children}
            </Context.Provider>
        )
    }

}