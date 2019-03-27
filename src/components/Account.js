import React, {Component} from 'react';
import {UserContext} from "./User";
import { Redirect } from "react-router-dom";
import Paper from '@material-ui/core/Paper';

class Account extends Component
{

    static contextType = UserContext;

    renderAccount()
    {
        return (
            <Paper>
                {
                   "Hello " + this.context.user.account.name + "!"
                }
            </Paper>
        )
    }

    render()
    {
        return(
            this.context.user.actions.checkLogin() ? this.renderAccount() : <Redirect to={"/auth"} />
        );
    }
}

export default Account;