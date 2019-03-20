import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom'
import {AppBar, Toolbar, IconButton, Typography, Button} from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';

// TODO add printing name in navigation bar, store info in tokens, get info about user for server
class Navigation extends Component
{

    render()
    {
        return (
            <div>
            <AppBar position={"static"}>
                <Toolbar>
                    <IconButton color={"inherit"} aria-label="Menu">
                        <MenuIcon/>
                    </IconButton>
                    <Typography>
                        Server-list.cz
                    </Typography>
                    <Button component={Link} color={"inherit"} to={"/auth"}>
                        Login
                    </Button>
                </Toolbar>
            </AppBar>
            </div>
        )
    }

}

export default Navigation;