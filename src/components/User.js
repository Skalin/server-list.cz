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
            loader: false,
            user: {
                    account: {
                        name: null,
                        surname: null,
                    },
                    actions: {
                        checkExpiration: this.checkExpiration,
                        checkLogin: this.checkLogin,
                        isOwner: this.isOwner,
                        login: this.login,
                        storeToken: this.storeToken,
                        register: this.register,
                        getUser: this.getUser,
                    }
                }
        }
    }

    componentDidMount() {
        this.setState({user: { ...this.state.user, account: this.getUser()}})
    }

    checkExpiration = ( date ) => {
        return (new Date(date).getTime() / 1000 >= new Date().getTime() / 1000);
    };

    checkIat = ( date ) => {
        return (new Date(date).getTime() / 1000 <= new Date().getTime() / 1000);
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

        if (!this.checkLogin() && user)
        {
            let loginUrl = normalizeUrl(apiUserUrl + '/login');
            axios.post(loginUrl, {user: user})
                .then(res => this.storeToken(res.data))
                .then(res => {
                    this.setState({user: { ...this.state.user, account: this.getUser()}})
                });
        }
    };


    getUser = () => {
        return jwt.decode(localStorage.getItem('user'));
    };

    register = (user) => {
        axios.post(config.apiUserUrl+'/register', {user: user})
            .then((res) => this.storeToken(res.data), (res) => console.log(res));

        return this.checkLogin();

    };

    storeToken = ( token ) => {
        let decodedToken = jwt.decode(token);

        if (this.checkExpiration(decodedToken.exp) && this.checkIat(decodedToken.iat))
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
        {
            return false;
        }

        if (!this.checkExpiration(user.exp) || !this.checkIat(user.iat))
        {
            this.removeToken();
            return false;
        }

        return true;
    };


    logout()
    {
        let user = this.getUser();
        if (!user)
            return false;

        if (!this.checkLogin())
            return false;

        axios.post(config.apiUserUrl, )

        this.removeToken()
    }


    removeToken()
    {
        localStorage.removeItem('user');
    }

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