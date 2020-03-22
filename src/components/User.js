import axios from "axios";
import * as config from "../config/config";
import {apiUserUrl} from "../config/config";
import React, {Component} from 'react';
import jwt from 'jsonwebtoken';
import {Redirect} from "react-router-dom";

export const UserContext = React.createContext();

const timestampSync = 60;

export class UserProvider extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hasErrors: false,
            errors: {},
            loader: false,
            error: null,
            loadingError: false,
            user: {
                account: null,
                actions: {
                    checkToken: this.checkToken,
                    checkExpiration: this.checkExpiration,
                    checkLogin: this.checkLogin,
                    checkIssueDate: this.checkIssueDate,
                    isOwner: this.isOwner,
                    login: this.login,
                    storeToken: this.storeToken,
                    register: this.register,
                    getUser: this.getUser,
                    getRawToken: this.getRawToken,
                    logout: this.logout,
                    logoutAll: this.logoutAll,
                    updateUser: this.updateUser
                }
            }
        }
    }


    checkToken = () => {
        let user = this.getUser();
        if (!user)
            return false;

        this.storeUserInfo();

        if (!this.checkExpiration(user.exp)) {
            this.removeUser();
            return false;
        }

        if ((user.exp - 7 * 24 * 3600) < ((Date.now() / 1000) + timestampSync)) {
            let loginUrl = config.normalizeUrl(apiUserUrl + '/relogin', {stripAuthentication: false});
            axios.put(loginUrl, {'login_token': this.getRawToken()})
                .then((res) => this.storeUser(res.data), () => {
                    this.removeUser()
                });
        }

        return true;
    };

    updateUser = (user) => {

        let url = config.normalizeUrl(config.apiUrl + "/users/" + user.id, {stripAuthentication: false});
        let data = {"login_token": this.getRawToken(), "user": user};
        console.log(data);

        axios.put(url, data)
            .then((res) => {
                this.setState({
                    redirect: true,
                    redirectUrl: "/account"
                }, () => (this.setState({redirect: true, redirectUrl: null})))
            })
            .catch();

    };

    logoutAll = () => {
        let user = this.getUser();
        if (!user)
            return false;

        if (!this.checkLogin()) {
            this.removeUser();
            return false;
        }

        const _this = this;
        let logoutUrl = config.normalizeUrl(config.apiUserUrl + '/logoutall', {stripAuthentication: false});
        axios.post(logoutUrl, {login_token: this.getRawToken()})
            .then(() => _this.removeUser());
    };

    componentDidMount() {
        this.state.user.actions.checkToken();
    }

    checkExpiration = (date) => {
        let timestamp = (Date.now() / 1000) + timestampSync;
        return (date > timestamp);
    };

    checkIssueDate = (date) => {
        let timestamp = (Date.now() / 1000) + timestampSync;
        return (date <= timestamp);
    };

    login = (user) => {

        const _this = this;

        if (!this.checkLogin() && user) {
            let loginUrl = config.normalizeUrl(apiUserUrl + '/login', {stripAuthentication: false});
            axios.post(loginUrl, {user: user})
                .then((res) => {
                    this.storeUser(res.data);
                }, (error) => _this.setState({loadingError: true, error: error.response}));
            return this.checkLogin();
        }
        return false;
    };

    storeUserInfo = () => {

        let acc = {...this.state.user.account};
        acc = {name: this.getUser().name, surname: this.getUser().surname};
        this.setState({user: {...this.state.user, account: acc}});
    };

    storeUser = (data) => {
        this.storeToken(data);
        this.storeUserInfo();
    };


    getRawToken = () => {
        return localStorage.getItem('user');
    };


    getUser = () => {
        return jwt.decode(this.getRawToken());
    };

    register = (user) => {

        const _this = this;

        if (!this.checkLogin() && user) {
            axios.post(config.apiUserUrl + '/register', {user: user})
                .then((res) => this.storeUser(res.data), (error) => {
                    _this.setState({loadingError: true, error: error.response});
                });

            return this.checkLogin();
        }

    };

    storeToken = (token) => {
        let decodedToken = jwt.decode(token);

        if (this.checkExpiration(decodedToken.exp) && this.checkIssueDate(decodedToken.iat)) {
            localStorage.setItem('user', token);
            return true;
        }
        return false;
    };

    isOwner = (server) => {

        if (!this.checkLogin()) {
            return false;
        }
        let user = this.getUser();

        let url = config.normalizeUrl(apiUserUrl + '/server/' + server, {stripAuthentication: false});
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
        if (!user) {
            return false;
        }

        if (!this.checkExpiration(user.exp) || !this.checkIssueDate(user.iat)) {
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

        if (!this.checkLogin()) {
            this.removeUser();
            return false;
        }

        const _this = this;
        let logoutUrl = config.normalizeUrl(config.apiUserUrl + '/logout', {stripAuthentication: false});
        axios.post(logoutUrl, {login_token: this.getRawToken()})
            .then(() => _this.removeUser());
    };


    removeToken = () => {
        localStorage.removeItem('user');
    };

    getAttribute = (attribute) => {
        let user = this.getUser();
        if (user) {
            let data = JSON.parse(user);
            return data[attribute];
        }
    };

    render() {
        return (
            <UserContext.Provider value={{
                user: this.state.user
            }}>
                {this.props.children}
            </UserContext.Provider>
        )
    }

}