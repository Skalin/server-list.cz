import React, { Component } from 'react';
import {Badge, Button, Divider, Grid, IconButton, Menu, MenuItem, Typography} from "@material-ui/core";
import {Notifications} from "@material-ui/icons";
import * as config from "../config/config";
import axios from 'axios';
import {UserContext} from "./User";
import {Link, Redirect} from "react-router-dom";

const normalizeUrl = require('normalize-url');

export class Notification extends Component
{

    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = {
            apiUrl: normalizeUrl(config.apiUserUrl+"/notifications", {stripAuthentication: false}),
            apiReadUrl: normalizeUrl(config.apiUserUrl+"/notification", {stripAuthentication: false}),
            unreadCount: 0,
            notifications: [],
            showNotifications: false,
            redirect: false,
            redirectUrl: null,
            anchorEl: undefined
        }
    }

    countNotifications = () =>
    {
        let count = 0;
        this.state.notifications.map(notification => {
            if (!notification.read)
            {
                count++;
            }
        });
        this.setState({unreadCount: count})
    };


    fetchNotifications = () =>
    {
        axios.post(this.state.apiUrl, {login_token: this.context.user.actions.getRawToken()})
            .then((res) => (
                this.setState({notifications: res.data}, () => {
                    this.countNotifications();
                })
            ));
    }

    componentDidMount() {
        this.fetchNotifications();
    }


    buildUrl = (internalId) =>
    {
        let obj = this.state.notifications[internalId].objectArray;

        obj = JSON.parse(obj);
        let url = "";
        for (var key in obj)
        {
            if (obj.hasOwnProperty(key))
            {
                url += "/"+key+"/"+obj[key];
            }
        }
        console.log(url);
        this.setState({redirect: true, redirectUrl: url}, () => this.setState({redirect: false, redirectUrl: null}));
    }

    readNotification = (internalId) =>
    {

        let {id} = this.state.notifications[internalId];

        axios.post(this.state.apiReadUrl+"/"+id, {login_token: this.context.user.actions.getRawToken()})
            .then((res) => {
                let {notifications} = this.state;
                notifications[internalId] = res.data;
                this.setState({notifications: notifications}, () => {
                    this.countNotifications();
                    this.buildUrl(internalId)
                })
            })
    };

    openNotifications = (event) =>
    {
        this.setState({showNotifications: !this.state.showNotifications, anchorEl: event.currentTarget});
    };

    renderNotifications()
    {
        let {anchorEl} = this.state;
        return (
            <Menu open={this.state.showNotifications} anchorEl={anchorEl} onClose={this.openNotifications}
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
            {
                this.state.notifications.map((notification, internalId) =>
                    (
                        <div key={notification.id}>
                            <MenuItem  onClick={this.readNotification.bind(this, internalId)} style={{marginTop: "1em"}}>
                                <Grid container justify={"center"}>
                                    <Grid item xs={8}>
                                        <Typography variant={"h6"}>{notification.title}</Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography variant={"subtitle2"}>{new Date(notification.date).toLocaleDateString('cs', {year: "numeric", month: "2-digit", day: "numeric"})}</Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant={"caption"}>{notification.content}</Typography>
                                    </Grid>
                                </Grid>
                            </MenuItem>
                            <Divider/>
                        </div>))
            }
            </Menu>
        );

    }

    render()
    {
        let {anchorEl} = this.state;
        return (
            <>
                {this.state.redirect ? <Redirect to={this.state.redirectUrl}/> : ""}
                <IconButton aria-owns={anchorEl ? 'notifications-menu' : undefined} aria-haspopup="true" color="inherit" onClick={this.openNotifications.bind(this)}>
                    <Badge badgeContent={this.state.unreadCount} color="secondary">
                        <Notifications />
                    </Badge>
                    {this.renderNotifications()}
                </IconButton>
            </>
        )
    }
}