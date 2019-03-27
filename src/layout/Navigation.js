import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import {AppBar, Toolbar, IconButton, Typography, Button, Drawer, List, LinearProgress, Divider } from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import {UserContext} from "../components/User";
import ListItem from '@material-ui/core/ListItem';
import * as config from "../config/config";
import axios from "axios";
import ListItemText from "@material-ui/core/es/ListItemText/ListItemText";
import withStyles from "@material-ui/core/es/styles/withStyles";


const normalizeUrl = require('normalize-url');

const styles = {
    root: {
        flex: 1,
    },
    grow: {
        flex: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
};


// TODO add printing name in navigation bar, store info in tokens, get info about user for server
class Navigation extends Component
{

    static contextType = UserContext;

    constructor(props)
    {
        super(props);

        this.classes = props;
        this.state = {
            isOpened: false,
            services: [],
        };
        this.serviceUrl = "/services/";
        this.endpoint = normalizeUrl(config.apiUrl+'/services', {stripAuthentication: false});
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
            this.context.user.actions.checkLogin()
                ?
                <Link to={"/account"}>
                    <Typography style={{color: "white"}} >
                        {this.context.user.account.name}
                        <AccountCircleOutlinedIcon />
                    </Typography>
                </Link>
                :
                <Button component={Link} color={"inherit"} to={"/auth"} style={{color: "white", flex: 1}} >
                    LOGIN
                </Button>
        );
    }

    render()
    {
        var services = this.state.services;

        return (
            <div className={this.classes.root}>
            <AppBar position={"static"}>
                <Toolbar>
                    <IconButton color={"inherit"} onClick={this.toggleDrawer.bind(this)} className={this.classes.menuButton} aria-label={"Open menu"}>
                        <MenuIcon/>
                    </IconButton>
                    <Link to={"/"} >
                        <Typography className={this.classes.grow} variant={"h6"} color={"inherit"}>
                            Server-List
                        </Typography>
                    </Link>
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
                        this.state.services.map( (service) => (
                            <ListItem key={service.id}>
                                <Link to={"/services/" + service.id} value={service.name}>
                                    <ListItemText primary={service.name}/>
                                </Link>
                            </ListItem>
                            )
                        )
                    }
                </List>
            </Drawer>
            </div>
        )
    }

}

export default withStyles(styles) (Navigation);
