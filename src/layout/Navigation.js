import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import {AppBar, Toolbar, IconButton, Typography, Button, Drawer, List} from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import {UserContext} from "../components/User";

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
        }
    }

    toggleDrawer()
    {
         this.setState({
             isOpened: !this.state.isOpened,
         })
    }

    printUserSection()
    {
        return (
            this.context.user.actions.checkLogin() ?
                <Typography>{this.context.user.account.name} <AccountCircleOutlinedIcon style={{color: "white"}} /></Typography> :
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
                        Server-list.cz
                    </Typography>
                    {
                        this.printUserSection()
                    }
                </Toolbar>
            </AppBar>
            <Drawer open={this.state.isOpened} onClose={this.toggleDrawer.bind(this)}>
                <div>
                    <ul>
                        <li>Test</li>
                        <li>Test 2</li>
                    </ul>
                </div>
            </Drawer>
            </div>
        )
    }

}

export default Navigation;