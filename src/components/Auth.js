import React, {Component} from 'react';
import { TextField, FormGroup, Grid, Button, FormControlLabel, Checkbox } from "@material-ui/core";
import { UserContext } from "./User";
import { Redirect } from "react-router-dom";

const signUp = 1;
const signIn = 2;

export class Auth extends Component
{

    static contextType = UserContext;

    constructor(props)
    {
        super(props);
        let login = true;
        this.state = { isLoginOpen: login, isRegisterOpen: !login};
    }

    switchBox( type )
    {
        if ((type === signIn && !this.state.isLoginOpen) || (type === signUp && !this.state.isRegisterOpen))
            this.setState({isRegisterOpen: !this.state.isRegisterOpen, isLoginOpen: !this.state.isLoginOpen})

    }

    renderForm()
    {
        if (!this.context.user.actions.checkLogin())
        {

            let data = null;
            if (this.state.isLoginOpen)
                data = <Login/>;

            if (this.state.isRegisterOpen)
                data = <Register/>;

            return(
                data
            )
        }
        else
        {
            return  (
                <Redirect to={"/account"}/>
            );
        }
    }

    renderButtons()
    {
        let data =
            <Grid container spacing={16} style={{marginTop: "3em", marginBottom: "3em"}}>
                <Grid item>
                    <Button variant={"contained"} size={"large"} color={"primary"} onClick={this.switchBox.bind(this, signIn)}>
                        Přihlásit se
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant={"contained"} size={"large"} color={"secondary"} onClick={this.switchBox.bind(this, signUp)}>
                        Registrovat
                    </Button>
                </Grid>
            </Grid>;

        return(
            data
        )
    }

    render()
    {
        return(
            <React.Fragment>
                {this.context.user.actions.checkLogin() ? <Redirect to={"/"} /> :
                    <Grid container justify={"center"} alignItems={"center"} direction={"column"}>
                        <Grid>
                            {this.renderButtons()}
                            {this.renderForm()}
                        </Grid>
                    </Grid>}
            </React.Fragment>
        );
    }
}

class Login extends Component
{
    static contextType = UserContext;

    constructor(props)
    {
        super(props);
        this.state = {
            user:
                {
                    username: null,
                    password: null
                },
            loggedIn: false,
            errors: []
        };
    }

    onChange(formData)
    {
        let user = {...this.state.user};
        let property = formData.target.name;
        user[property] = formData.target.value;
        this.setState({user})
    }

    submitForm(e)
    {
        e.preventDefault();
        if (this.context.user.actions.login(this.state.user))
        {
            this.setState({loggedIn: true});
        }
    }

    renderForm()
    {
        return (
            <form onSubmit={this.submitForm.bind(this)} >
                <h1>Login</h1>
                <FormGroup>
                    <TextField autoFocus={true} autoComplete={"username"} label={"Username"} type="text" name="username" onChange={this.onChange.bind(this)} />
                </FormGroup>
                <FormGroup>
                    <TextField label={"Password"} autoComplete={"current-password"} type="password" onChange={this.onChange.bind(this)} name="password" />
                </FormGroup>
                <Button variant={"contained"} color={"primary"} type="submit" style={{marginTop: "2em"}}>Sign in</Button>
            </form>
        )
    }

    render()
    {
        return(
            this.state.loggedIn ? <Redirect to={"/account"}/> : this.renderForm()
        )
    }
}

class Register extends Component
{

    static contextType = UserContext;

    constructor(props)
    {
        super(props);
        this.state = {
            user: {
                username: null,
                password: null,
                name: null,
                surname: null,
                mail: null,
                tos_agreement: "0",

            },
            loggedIn: false,
            errors: [],
        };
    }

    onChange(formData)
    {
        let user = {...this.state.user};
        let property = formData.target.name;
        user[property] = formData.target.value;
        this.setState({user});
    }

    submitForm(e)
    {
        e.preventDefault();
        if (this.context.user.actions.register(this.state.user))
            this.setState({loggedIn: true});

    }

    renderForm()
    {
        return (
            <form onSubmit={this.submitForm.bind(this)}>
                <h1>Registration</h1>
                <FormGroup>
                    <TextField autoFocus={true} label={"Username"} type="text" name="username" onChange={this.onChange.bind(this)}/>
                </FormGroup>
                <FormGroup>
                    <TextField label={"Password"} autoComplete={"new-password"} type="password" name="password" onChange={this.onChange.bind(this)}/>
                </FormGroup>
                <FormGroup>
                    <TextField label={"Name"} type="text" name="name" onChange={this.onChange.bind(this)}/>
                </FormGroup>
                <FormGroup>
                    <TextField label={"Surname"} type="text" name="surname" onChange={this.onChange.bind(this)}/>
                </FormGroup>
                <FormGroup>
                    <TextField label={"E-mail"} type="text" name="mail" onChange={this.onChange.bind(this)}/>
                </FormGroup>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={this.state.tos}
                                onChange={this.onChange.bind(this)}
                                value={"1"}
                                name="tos_agreement"
                                color="primary"
                            />
                        }
                        label="ToS Agreement"
                    />
                </FormGroup>
                <Button variant={"contained"} color={"secondary"} type="submit" style={{marginTop: "2em"}}>Sign up</Button>
            </form>
        );
    }

    render()
    {
        return(
            this.state.loggedIn ? <Redirect to={"/account"}/> : this.renderForm()
        )
    }
}