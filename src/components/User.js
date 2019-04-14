import axios from "axios";
import * as config from "../config/config";
import {apiUserUrl} from "../config/config";
import React, { Component } from 'react';
import jwt from 'jsonwebtoken';
import {Redirect} from "react-router-dom";

const normalizeUrl = require('normalize-url');
export const UserContext = React.createContext();

const timestampSync = 60;

export class UserProvider extends Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            loader: false,
            user: {
                    account: null,
                    actions: {
                        checkExpiration: this.checkExpiration,
                        checkLogin: this.checkLogin,
                        checkIssueDate: this.checkIssueDate,
                        isOwner: this.isOwner,
                        login: this.login,
                        storeToken: this.storeToken,
                        register: this.register,
                        getUser: this.getUser,
                        tryLogin: this.tryLogin,
                        getRawToken: this.getRawToken,
                        logout: this.logout,
                    }
            }
        };
    }


    tryLogin = () =>
    {
        return true;
    };

    componentDidMount() {
        if (this.state.user.actions.tryLogin())
        {
            this.setState({user: { ...this.state.user, account: this.getUser()}})
        }
    }

    checkExpiration = ( date ) => {
        let timestamp = (Date.now() / 1000)+timestampSync;
        return (date > timestamp);
    };

    checkIssueDate = ( date ) => {
        let timestamp = (Date.now() / 1000)+timestampSync;
        return (date <= timestamp);
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

    regenerateToken = ( user ) => {

    };


    login = ( user ) => {

        let errors = [];
        if (!this.checkLogin() && user)
        {
            let loginUrl = normalizeUrl(apiUserUrl + '/login', {stripAuthentication: false});
            axios.post(loginUrl, {user: user})
                .then((res) => {
                    this.storeToken(res.data);
                    let acc = {...this.state.user.account};
                    acc = {name: this.getUser().name, surname: this.getUser().surname};
                    this.setState({user: {...this.state.user, account: acc}});
                    }, (res) => {errors = res.data});

            return this.checkLogin();
        }
        return errors;
    };


    getRawToken = () => {
        return localStorage.getItem('user');
    };


    getUser = () => {
        return jwt.decode(this.getRawToken());
    };

    register = (user) => {
        axios.post(config.apiUserUrl+'/register', {user: user})
            .then((res) => this.storeToken(res.data), (res) => {return(res)});

        return this.checkLogin();

    };

    storeToken = ( token )  =>{
        let decodedToken = jwt.decode(token);

        if (this.checkExpiration(decodedToken.exp) && this.checkIssueDate(decodedToken.iat))
        {
            localStorage.setItem('user', token);
            return true;
        }
        return false;
    };

    isOwner = ( server ) => {

        if (!this.checkLogin())
        {
            return false;
        }
        let user = this.getUser();

        let url = normalizeUrl(apiUserUrl+'/server/'+server, {stripAuthentication: false});
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
        {
            return false;
        }

        if (!this.checkExpiration(user.exp) || !this.checkIssueDate(user.iat))
        {
            this.removeToken();
            return false;
        }

        return true;
    };


    removeUser = () => {
        this.setState({user: {...this.state.user, account: null}}, () => {
            this.removeToken();
            return true;
        })
    };

    logout = () => {
        let user = this.getUser();
        if (!user)
            return false;

        if (!this.checkLogin())
        {
            this.removeUser();
            return false;
        }

        let logoutUrl = normalizeUrl(config.apiUserUrl+'/logout', {stripAuthentication: false});
        axios.post(logoutUrl, {login_token: this.getRawToken()});
        this.removeUser();
    };


    removeToken = () => {
        localStorage.removeItem('user');
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