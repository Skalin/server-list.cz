import React, { Component } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import { TextField, FormGroup, Grid, Button, FormControlLabel, Checkbox } from "@material-ui/core";
import * as config from '../config/config.js';
import jwt from 'jsonwebtoken';

const signUp = 1;
const signIn = 2;

export class Auth extends Component
{
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
        let data = null;
        if (this.state.isLoginOpen)
            data = <Login/>;

        if (this.state.isRegisterOpen)
            data = <Register/>;

        return(
            data
        )
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
                <Grid container justify={"center"} alignItems={"center"} direction={"column"}>
                    <Grid>
                        {this.renderButtons()}
                        {this.renderForm()}
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }
}

class Login extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            user:
                {
                    username: null,
                    password: null
                },
            errors: []
        };
    }

    onChange(formData)
    {
        var user = {...this.state.user};
        var property = formData.target.name;
        user[property] = formData.target.value;
        this.setState({user})
    }

    submitForm(formData)
    {
        console.log(this.state.user);
       // user.login(this.state.user);
    }

    render()
    {
        return(
            <form>
                <h1>Login</h1>
                <FormGroup>
                    <TextField autoComplete={"username"} label={"Username"} type="text" name="username" onChange={this.onChange.bind(this)} />
                </FormGroup>
                <FormGroup>
                        <TextField label={"Password"} autoComplete={"current-password"} type="password" onChange={this.onChange.bind(this)} name="password" />
                </FormGroup>
                <Button variant={"contained"} color={"primary"} type="button" onClick={this.submitForm.bind(this)} style={{marginTop: "2em"}}>Sign in</Button>
            </form>
        )
    }
}

class Register extends Component
{

    constructor(props)
    {
        super(props);
        this.state = {
            user: {
                username: null,
                password: null,
                name: null,
                surname: null,
                tos_agreement: 0,

            },
            errors: [],
        };
    }

    onChange(formData)
    {
        var user = {...this.state.user};
        var property = formData.target.name;
        user[property] = formData.target.value;
        this.setState({user});
        console.log(user);
    }

    submitForm()
    {
        //this.setState({user: {...this.state.user, confirmPassword: null}});
        /*
        axios.post(config.apiUserUrl+'/register', this.state.user)
            .then((res) => localStorage.setItem("jwtToken", res));*/
        let token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiRG9taW5payIsInN1cm5hbWUiOiJTa1x1MDBlMWxhIiwiaXNzIjoiaHR0cDpcL1wvYXBpLnNlcnZlci1saXN0LmN6IiwiYXVkIjoiaHR0cDpcL1wvc2VydmVyLWxpc3QuY3oiLCJpYXQiOiIxNTUzMTk5OTk4IiwicXVlcnlOYW1lc3BhY2UiOiJhcHBcXGNvbXBvbmVudHNcXHF1ZXJpZXMiLCJtYXhpbXVtVGltZW91dHMiOjZ9.pAIsxHX8SV_eUmrbENuCpUCSCB3T1MU9ekDE0TSqCoE";
        let decoded = jwt.decode(token);
        console.log(decoded.expiration);

    }

    render()
    {
        return(
            <form>
                <h1>Registration</h1>
                <FormGroup>
                    <TextField label={"Username"} type="text" name="username" onChange={this.onChange.bind(this)}/>
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
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={this.state.tos}
                                onChange={this.onChange.bind(this)}
                                value={1}
                                name="tos_agreement"
                                color="primary"
                            />
                        }
                        label="ToS Agreement"
                    />
                </FormGroup>
                <Button variant={"contained"} color={"secondary"} type="button" onClick={this.submitForm.bind(this)}  style={{marginTop: "2em"}}>Sign up</Button>
            </form>
        )
    }
}