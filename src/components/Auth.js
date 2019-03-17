import React, { Component } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import FormGroup from "react-bootstrap/FormGroup";
import Button from "react-bootstrap/Button";

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

    renderButtonValue()
    {
        if (this.state.isLoginOpen) return 'Sign in';
        if (this.state.isRegisterOpen) return 'Sign up';
    }

    render()
    {
        return(
            <React.Fragment>
                <div className="auth">
                    <div className="auth__buttons">
                        <Button onClick={this.switchBox.bind(this, signIn)}>
                            Sign in
                        </Button>
                        <Button onClick={this.switchBox.bind(this, signUp)}>
                            Sign up
                        </Button>
                    </div>
                </div>

                <Form>
                    {this.state.isLoginOpen && <Login/>}
                    {this.state.isRegisterOpen && <Register/>}
                </Form>
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
                <Button type="submit" onClick={this.submitForm.bind(this)}>Sign in</Button>
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
                <Button type="button" className="btn" onClick={this.submitForm.bind(this)}>Sign up</Button>
            </div>
        )
    }
}