import React, {Component} from 'react';
import {
    TextField,
    FormGroup,
    Grid,
    Button,
    FormControlLabel,
    Checkbox,
    Snackbar,
    Link,
    ExpansionPanel, ExpansionPanelDetails
} from "@material-ui/core";
import {UserContext} from "./User";
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import amber from '@material-ui/core/colors/amber';
import {Redirect} from "react-router-dom";

const signUp = 1;
const signIn = 2;


const styles = {
    root: {
        width: '100%'
    },
    heading: {
        backgroundColor: "rgba(0, 120, 255, 1)",
        color: 'white',
        marginTop: "2em"
    },
    headingRed: {
        backgroundColor: "rgba(209, 10, 60, 1)",
        color: 'white',
        marginTop: "2em"
    }
};


export class Auth extends Component {

    static contextType = UserContext;

    constructor(props) {
        super(props);
        let login = true;
        this.state = {isLoginOpen: login, isRegisterOpen: !login};
    }

    switchBox(type) {
        if ((type === signIn && !this.state.isLoginOpen) || (type === signUp && !this.state.isRegisterOpen))
            this.setState({isRegisterOpen: !this.state.isRegisterOpen, isLoginOpen: !this.state.isLoginOpen})

    }

    renderForm() {
        if (!this.context.user.actions.checkLogin()) {

            let data = null;
            if (this.state.isLoginOpen)
                data = <Login/>;

            if (this.state.isRegisterOpen)
                data = <Register/>;

            return (
                <>
                    <Grid item xs={12}>
                        {data}
                    </Grid>
                </>
            )
        } else {
            return (
                <Redirect to={"/account"}/>
            );
        }
    }

    renderButtons() {
        let data =
            <>
                <Grid item xs={6}>
                    <Button variant={"contained"} style={styles.heading} size={"large"} color={"primary"}
                            onClick={this.switchBox.bind(this, signIn)}>
                        Přihlášení
                    </Button>
                </Grid>
                <Grid item xs={6}>
                    <Button variant={"contained"} style={styles.headingRed} size={"large"} color={"secondary"}
                            onClick={this.switchBox.bind(this, signUp)}>
                        Registrace
                    </Button>
                </Grid>
            </>;

        return (
            data
        )
    }

    render() {
        return (
            <React.Fragment>
                {this.context.user.actions.checkLogin() ? <Redirect to={"/"}/> :
                    <Grid container justify={"center"} alignItems={"center"} direction={"column"}>
                        <Grid item xs={12}>
                            <ExpansionPanel expanded={true} xs={6} style={{marginTop: "25px"}}>
                                <ExpansionPanelDetails>
                                    <Grid container justify={"center"} alignItems={"center"}>
                                        {this.renderButtons()}
                                        {this.renderForm()}
                                    </Grid>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        </Grid>
                    </Grid>}
            </React.Fragment>
        );
    }
}

class Login extends Component {
    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = {
            user:
                {
                    username: null,
                    password: null
                },
            loggedIn: false,
            state: null,
            snackOpen: false
        };
    }

    onChange(formData) {
        let user = {...this.state.user};
        let property = formData.target.name;
        user[property] = formData.target.value;
        this.context.error = null;
        this.setState({user})
    }

    submitForm(e) {
        e.preventDefault();
        let state = this.context.user.actions.login(this.state.user);

        if (typeof (state) == "boolean" && state) {
            this.setState({loggedIn: true});
        } else {
            this.setState({snackOpen: true})
        }
    }

    renderForm() {
        return (
            <form onSubmit={this.submitForm.bind(this)}>
                <h1>Login</h1>
                <FormGroup>
                    <TextField autoFocus={true} autoComplete={"username"} label={"Uživatelské jméno"} type="text"
                               name="username" onChange={this.onChange.bind(this)}/>
                </FormGroup>
                <FormGroup>
                    <TextField label={"Heslo"} autoComplete={"current-password"} type="password"
                               onChange={this.onChange.bind(this)} name="password"/>
                </FormGroup>
                <Button variant={"contained"} color={"primary"} type="submit" style={styles.heading}>Přihlásit
                    se</Button>
            </form>
        )
    }

    render() {
        return (
            this.state.loggedIn ? <Redirect to={"/account"}/> : this.renderForm()
        )
    }
}

class Register extends Component {

    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = {
            user: {
                username: null,
                password: null,
                name: null,
                surname: null,
                mail: null,
                tos_agreement: "0"

            },
            loggedIn: false,
            errors: []
        };
    }

    onChange(formData) {
        let user = {...this.state.user};
        let property = formData.target.name;
        user[property] = formData.target.value;
        this.setState({user});
    }

    submitForm(e) {
        e.preventDefault();
        if (this.context.user.actions.register(this.state.user))
            this.setState({loggedIn: true});
        else {

        }

    }

    renderForm() {
        return (
            <form onSubmit={this.submitForm.bind(this)}>
                <h1>Registration</h1>
                <FormGroup>
                    <TextField autoFocus={true} label={"Uživatelské jméno"} type="text" name="username"
                               onChange={this.onChange.bind(this)}/>
                </FormGroup>
                <FormGroup>
                    <TextField label={"Heslo"} autoComplete={"new-password"} type="password" name="password"
                               onChange={this.onChange.bind(this)}/>
                </FormGroup>
                <FormGroup>
                    <TextField label={"Jméno"} type="text" name="name" onChange={this.onChange.bind(this)}/>
                </FormGroup>
                <FormGroup>
                    <TextField label={"Příjmení"} type="text" name="surname" onChange={this.onChange.bind(this)}/>
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
                        label={
                            <>
                                {"Souhlasím s "}
                                <Link to={'/conditions'}>podmínkami služby Server-List.cz</Link>
                            </>
                        }
                    />
                </FormGroup>
                <Button style={styles.headingRed} variant={"contained"} color={"secondary"} type="submit">Registrovat
                    se</Button>
            </form>
        );
    }

    render() {
        return (
            this.state.loggedIn ? <Redirect to={"/account"}/> : this.renderForm()
        )
    }
}