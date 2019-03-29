import React, { Component } from 'react';
import {AppBar, Toolbar, IconButton, Typography, Button, Drawer, List, LinearProgress, Divider, Link } from "@material-ui/core";
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
    heading: {
        backgroundColor: "rgba(0, 120, 255, 1)",
        color: 'white',
    }
};


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
                <Link href={"/account"}>
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
        const {classes} = this.props;
        let services = this.state.services;

        return (
            <div className={classes.root}>
            <AppBar position={"static"} className={classes.heading}>
                <Toolbar>
                    <IconButton color={"inherit"} onClick={this.toggleDrawer.bind(this)} className={classes.menuButton} aria-label={"Open menu"}>
                        <MenuIcon/>
                    </IconButton>
                    <Typography className={classes.grow} variant={"h6"} style={styles.heading}>
                        <Link href={"/"} color={"primary"} variant={"inherit"}>
                            Server-List
                        </Link>
                    </Typography>
                    <div>
                        {this.printUserSection()}
                    </div>

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
                                <Link href={"/services/" + service.id} value={service.name}>
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
