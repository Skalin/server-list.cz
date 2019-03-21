import React, { Component } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import { FormControl, FormControlLabel, FormGroup, Grid, Button } from "@material-ui/core";

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

    onChange(e)
    {
        var user = {...this.state.user};
        var property = e.target.name;
        user[property] = e.target.value;
        this.setState({user})
    }

    submitForm(e)
    {
        //user.login(this.state.user);
    }

    render()
    {
        return(
            <div>
                <h1>Login</h1>
                <FormGroup>
                    <Form.Label>
                        Username
                    <Form.Control type="text" name="username" onChange={this.onChange.bind(this)} />
                </Form.Label>
                </FormGroup>
                <FormGroup>
                    <Form.Label>
                        Password
                        <Form.Control type="password" onChange={this.onChange.bind(this)} name="password" />
                    </Form.Label>
                </FormGroup>
                <Button variant={"contained"} color={"primary"} type="submit" onClick={this.submitForm.bind(this)} style={{marginTop: "2em"}}>Sign in</Button>
            </div>
        )
    }
}

class Register extends Component
{

    constructor(props)
    {
        super(props);
        this.state = { errors: [] };
    }

    submitForm(e)
    {
        axios.post()

    }

    render()
    {
        return(
            <div>
                <h1>Registration</h1>
                <FormGroup>
                    <Form.Label>
                        Username
                        <Form.Control type="text" name="username" />
                    </Form.Label>
                </FormGroup>
                <FormGroup>
                    <Form.Label>
                        Password
                        <Form.Control type="password" name="Password" />
                    </Form.Label>
                </FormGroup >
                <FormGroup>
                    <Form.Label>
                        Confirm password
                        <Form.Control type="password" name="Confirm password" />
                    </Form.Label>
                </FormGroup>
                <Button variant={"contained"} color={"secondary"} type="button" onClick={this.submitForm.bind(this)}>Sign up</Button>
            </div>
        )
    }
}