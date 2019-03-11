import React, { Component } from 'react';
import axios from 'axios';
import * as user from './User';

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
            <div>
                <div className="auth">
                    <div className="auth__buttons">
                        <div className="btn" onClick={this.switchBox.bind(this, signIn)}>
                            Sign in
                        </div>
                        <div className="btn" onClick={this.switchBox.bind(this, signUp)}>
                            Sign up
                        </div>
                    </div>
                </div>

                <form className="auth__form">
                    {this.state.isLoginOpen && <Login/>}
                    {this.state.isRegisterOpen && <Register/>}
                </form>
            </div>
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
        user.login(this.state.user);
    }

    render()
    {
        return(
            <div className="form__sign-in">
                <h1>Login</h1>
                <div className="form__input--group">
                    <label>
                        Username
                        <input type="text" name="username" onChange={this.onChange.bind(this)} />
                    </label>
                </div>
                <div className="form__input--group">
                    <label>
                        Password
                        <input type="password" onChange={this.onChange.bind(this)} name="password" />
                    </label>
                </div>
                <button type="submit" className="btn" onClick={this.submitForm.bind(this)}>Sign in</button>
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
        console.log(this);
        axios.post()

    }

    render()
    {
        return(
            <div className="form__sign-up">
                <h1>Registration</h1>
                <div className="form__input--group">
                    <input type="text" name="username" />
                </div>
                <div className="form__input--group">
                    <input type="password" name="Password" />
                </div>
                <div className="form__input--group">
                    <input type="password" name="Confirm password" />
                </div>
                <button type="button" className="btn" onClick={this.submitForm.bind(this)}>Sign up</button>
            </div>
        )
    }
}