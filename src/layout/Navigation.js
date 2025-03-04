import React, {Component} from 'react';
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Button,
    Drawer,
    List,
    LinearProgress,
    Divider,
    Link, Grid
} from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import {Link as RouterLink} from 'react-router-dom';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import {UserContext} from "../components/User";
import ListItem from '@material-ui/core/ListItem';
import * as config from "../config/config";
import axios from "axios";
import ListItemText from "@material-ui/core/es/ListItemText/ListItemText";
import withStyles from "@material-ui/core/es/styles/withStyles";
import CssBaseline from '@material-ui/core/CssBaseline';
import classNames from 'classnames';
import {Notification} from "../components/Notification";


const normalizeUrl = require('normalize-url');

const styles = {
    loginLink: {
        color: "white",
        flex: 1,
        '&:hover': {
            textDecoration: "inherit",
            color: "rgb(72,72,72)",
        },
    },
    root: {
        flex: 1,
    },
    grow: {
        flex: 1,
    },
    menuSection: {
        position: "absolute",
        height: "auto",
        bottom: "10px",
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
        '&:hover': {
            textDecoration: "none",
            color: "rgb(72,72,72)",
        },
    },
    navigationButton: {
        transition: "all .2s ease-in-out",
        '&:hover': {
            marginLeft: "0.5em",
            fontWeight: "bold",
            textDecoration: "none",
            color: "rgb(72,72,72)",
            transform: "scale(1.1, 1.1)"
        }
    },
    heading: {
        backgroundColor: "rgba(0, 120, 255, 1)",
        color: 'white',
    },
    link: {
        color: 'white',
    }
};


// TODO add printing name in navigation bar, store info in tokens, get info about user for server
class Navigation extends Component {

    static contextType = UserContext;

    constructor(props) {
        super(props);

        this.state = {
            isOpened: false,
            services: [],
        };
        this.serviceUrl = "/services/";
        this.endpoint = normalizeUrl(config.apiUrl + '/services', {stripAuthentication: false});
    }

    componentDidMount() {
        axios.get(this.endpoint)
            .then(res => this.setState({services: res.data}));
    }

    toggleDrawer() {
        this.setState({
            isOpened: !this.state.isOpened,
        })
    }


    renderLoader() {
        if (this.state.loader)
            return (<LinearProgress color="secondary"/>);
    }


    printUserSection() {
        const {classes} = this.props;
        return (
            this.context.user.account
                ?
                <>
                    <Link component={RouterLink} className={classes.loginLink} to={"/account"}>
                        <Typography className={classes.loginLink}>
                            {this.context.user.account.name}
                            <AccountCircleOutlinedIcon/>
                        </Typography>
                    </Link>
                </>
                :
                <Link component={RouterLink} color={"inherit"} to={"/auth"} className={classes.loginLink}>
                    LOGIN
                </Link>
        );
    }

    printNotifications() {
        const {classes} = this.props;
        return (
            this.context.user.account
                ?
                <Notification/>
                :
                ""
        )
    }

    render() {
        const {classes} = this.props;
        let services = this.state.services;

        return (
            <div className={classes.root}>
                <CssBaseline/>
                <AppBar position={"static"} className={classes.heading}>
                    <Toolbar>
                        <IconButton color={"inherit"} onClick={this.toggleDrawer.bind(this)}
                                    className={classes.menuButton} aria-label={"Open menu"}>
                            <MenuIcon/>
                        </IconButton>
                        <Typography className={classNames(classes.grow, classes.heading)} variant={"h6"}>
                            <Link component={RouterLink} to={"/"} className={classes.menuButton} color={"inherit"}
                                  variant={"inherit"}>
                                Server-List
                            </Link>
                        </Typography>
                        <div>
                            {this.printUserSection()}
                        </div>
                        <div>
                            {this.printNotifications()}
                        </div>

                    </Toolbar>
                </AppBar>
                <Drawer open={this.state.isOpened} onClose={this.toggleDrawer.bind(this)}>
                    <Divider/>
                    <List>
                        <ListItem>
                            <Typography variant={"h4"}>{"Aplikace"}</Typography>
                        </ListItem>
                        <Divider/>
                        {
                            this.state.services.map((service) => (
                                    <ListItem key={service.id} onClick={this.toggleDrawer.bind(this)}>
                                        <Link className={classes.navigationButton} component={RouterLink}
                                              to={{pathname: "/services/" + service.id, state: {service: service}}}>
                                            <ListItemText primary={service.name}/>
                                        </Link>
                                    </ListItem>
                                )
                            )
                        }
                        <Divider/>
                    </List>
                    <List className={classes.menuSection}>
                        <ListItem>
                            <Link className={classes.navigationButton} component={RouterLink}
                                  to={{pathname: "/conditions", state: {}}}><ListItemText primary={"Podmínky"}/></Link>
                    </ListItem>
                    </List>
                </Drawer>
            </div>
        )
    }

}

export default withStyles(styles)(Navigation);
