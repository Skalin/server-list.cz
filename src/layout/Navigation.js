import React, { Component } from 'react';
import {Link, Route, Router} from 'react-router-dom'
import {AppBar, Toolbar, IconButton, Typography, Button, Drawer, List, LinearProgress, Divider} from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import {UserContext} from "../components/User";
import ListItem from '@material-ui/core/ListItem';
import normalizeUrl from "normalize-url";
import * as config from "../config/config";
import axios from "axios";
import ListItemText from "@material-ui/core/es/ListItemText/ListItemText";
import servers from "../components/Servers";

const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

// TODO add printing name in navigation bar, store info in tokens, get info about user for server
class Navigation extends Component
{

    static contextType = UserContext;

    constructor(props)
    {
        super(props);
        this.state = {
            isOpened: false,
            services: [],
        };
        this.serviceUrl = "/services/";
        this.endpoint = normalizeUrl(config.apiUrl+'/services');
    }

    componentDidMount() {
        axios.get(this.endpoint)
            .then(res => this.setState({services: res.data}));
    }

    toggleDrawer()
    {
         this.setState({
             isOpened: !this.state.isOpened,
         })
    }


    renderLoader()
    {
        if (this.state.loader)
            return (<LinearProgress color="secondary" />);
    }


    printUserSection()
    {
        return (
            this.context.user.actions.checkLogin() ?
                <Link to={"/account"}><Typography>{this.context.user.account.name} <AccountCircleOutlinedIcon style={{color: "white"}} /></Typography></Link> :
            <Button component={Link} color={"inherit"} to={"/auth"}>
                LOGIN
            </Button>
        );
    }

    render()
    {
        return (
            <div>
            <AppBar position={"static"}>
                <Toolbar>
                    <IconButton color={"inherit"} aria-label="Menu" onClick={this.toggleDrawer.bind(this)}>
                        <MenuIcon/>
                    </IconButton>
                    <Typography>
                        <Link to={"/"}>
                        Server-list.cz
                        </Link>
                    </Typography>
                    {
                        this.printUserSection()
                    }
                </Toolbar>
            </AppBar>
            <Drawer open={this.state.isOpened} onClose={this.toggleDrawer.bind(this)}>
                <Divider />
                <List>
                    <ListItem>
                        <Typography variant={"h4"}>Services</Typography>
                    </ListItem>
                    <Divider/>
                    {
                        this.state.services.map((service) => (
                            <ListItem key={service.id}>
                            <Link to={"/services/"+service.id} value={service.name}>
                                <ListItemText primary={service.name}/>
                            </Link>
                            </ListItem>
                        ))}
                </List>
            </Drawer>
            </div>
        )
    }

}

export default Navigation;