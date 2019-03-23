import React, {Component} from 'react';
import {UserContext} from "./User";
import { Redirect } from "react-router-dom";

class Account extends Component
{

    static contextType = UserContext;

    render()
    {
        return(
            this.context.user.actions.checkLogin() ? "Hello "+this.context.user.account.name+"!" : <Redirect to={"/auth"} />
        );
    }
}

export default Account;