import React, {Component} from 'react';
import '../App.css';
import Header from './../layout/Header';
import Footer from './../layout/Footer';
import Services from './Service';
import servers from './Servers/Index';
import {Create} from './Servers/Create';
import {Conditions} from './Conditions';
import ServerWidgetGenerator from './Generator';
import {UserProvider} from './User';
import ReactGA from 'react-ga';

import {Route} from "react-router-dom";
import {Auth} from "./Auth";

import axios from 'axios';
import Account from "./Account";
import {MetaTags} from 'react-meta-tags';
import * as config from "./../config/config";

axios.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';

ReactGA.initialize('UA-136848512-1');
ReactGA.pageview(window.location.pathname + window.location.search);

const styles = theme => ({
    heroUnit: {
        color: theme.palette.background.paper,
        backgroundColor: "#02182B",
    },
    progress: {
        margin: theme.spacing.unit * 2,
        color: "white"

    },

    heroContent: {
        maxWidth: 1000,
        margin: '0 auto',
        padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 6}px`,
    },
    heroButtons: {
        marginTop: theme.spacing.unit * 4,
    },
    layout: {
        width: 'auto',
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
            width: 1100,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        backgroundColor: "#2c2c36",
        color: "white",
        margin: "1em",
    },
    header: {
        margin: "1em",
    },
    dark: {
        color: "black",
    },
    paperHeader: {
        marginTop: "1em",
        marginLeft: "1em",
    },
    cardGrid: {
        padding: `${theme.spacing.unit * 8}px 0`,
    },
    card: {
        backgroundColor: "#2c2c36",
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardTitle: {
        color: "white",
        fontWeight: "bold",
        textDecoration: "none",
        "&:hover": {
            fontSize: "large",
            textDecoration: "inherit",
        }
    },
    cardMedia: {
        backgroundColor: "#55595c"
    },
    cardContent: {
        flexGrow: 1,
    },
    button: {
        backgroundColor: "#0078FF",
        marginTop: '5em',
        marginBottom: '5em',
        "&:hover": {
            textDecoration: "none",
            backgroundColor: "rgb(72,72,72)",

        }
    },
    white: {
        color: "white",
    },
    serverItem: {

        textDecoration: "none",
    }
});

class App extends Component {

    generateSeo() {
        return (
            <MetaTags>
                <meta charSet="utf-8"/>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width"
                />
                <title>{config.pageName}</title>
                <meta name="description"
                      content="Hledáte svůj vysněný herní server? Pak stačí hledat zde! ServerList Vám pomůže najít místo ke hraní!"/>
                <meta property="og:title" content={config.pageName}/>
                <meta property="keywords"
                      content="minecraft, counter-ctrike: global offensive, rust, csgo, cs:go, mc, server, serverlist, list, hry, servery"/>
                <meta name="robots" content="index,follow"/>

            </MetaTags>
        )
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return true;
    }

    render() {
        return (
            <UserProvider>
                {this.generateSeo()}
                <Header/>
                <div className="App">
                    <div className="content">
                        <Route exact path="/" render={props => (
                            <Services/>
                        )}/>
                        <Route path="/auth" component={Auth}/>
                        <Route path="/services/:id" component={servers}/>
                        <Route path="/account" component={Account}/>
                        <Route path="/servers/generator" component={ServerWidgetGenerator}/>
                        <Route path="/servers/add" component={Create}/>
                        <Route path="/conditions" component={Conditions}/>
                    </div>
                    <Footer/>
                </div>
            </UserProvider>
        );
    }
}

export default App;
