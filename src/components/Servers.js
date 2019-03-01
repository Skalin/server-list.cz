import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';
import normalizeUrl from "normalize-url";
import {BrowserRouter as Switch, Link, Route} from "react-router-dom";
import * as config from '../config/config.js';
import * as user from '../api/User';


const servers = (props) => (
    <Switch>
        <div>
            <Route exact path={props.match.url} component={Servers} />
            <Route path={`${props.match.url}/servers/:serverId`} component={Server}/>
        </div>
    </Switch>
);

class Servers extends Component
{
    constructor(props)
    {
        super(props);
        this.ApiUrl = normalizeUrl(config.apiUrl+"/"+this.props.match.url+"/servers");
        this.state = {
            service: this.props.match.params.id,
            servers: [],
        };
    }

    componentDidMount() {
        axios.get(this.ApiUrl)
            .then(res => this.setState({servers: res.data}))
    }

    render() {
        return (
            <div className="servers">
                <h2>Servers</h2>
                    {
                    this.state.servers.map((server) => (
                        <div key={server.id}>
                            <Link to={this.props.match.url+"/servers/"+server.id}>
                                <div className="service">
                                    <h2>Server {server.name}</h2>
                                </div>
                            </Link>
                        </div>
                    ))
                    }
            </div>
        );
    }
}

class Server extends Component
{

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            match: this.props.match,
            server: null,
            isLoggedIn: false,
        };
        this.ApiUrl = normalizeUrl(config.apiUrl+this.state.match.url);
    }


    componentDidMount() {
        axios.get(this.ApiUrl)
            .then((res) => this.setState({isLoaded: true, server: res.data}), (error) => this.setState({isLoaded: true, error}));

        this.setState({isLoggedIn: user.checkLogin()});
    }

    render() {
        const { error, isLoaded, server } = this.state;
        if (error)
        {
            return <div>Error: {error.message}</div>;
        }
        else if (!isLoaded)
        {
            return <div>Loading...</div>;
        }
        else
        {
            return (
                    <div className="server">
                        <h1>{server.name}</h1>
                        <h3>{server.ip}:{server.port}</h3>
                        <p>

                        </p>
                    </div>
            );
        }
    }
}

export default servers;