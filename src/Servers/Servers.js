import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';
import ServerItem from "../Servers/ServerItem";
import normalizeUrl from "normalize-url";

class Servers extends Component
{
    ApiUrl = 'http://localhost/serverlist-api/v1/';
    state = {
        service: this.props.match.params.id,
        servers: [],
    };

    componentDidMount() {
        this.ApiUrl += "services/"+this.state.service+"/servers";
        this.ApiUrl = normalizeUrl(this.ApiUrl);
        axios.get(this.ApiUrl)
            .then(res => this.setState({servers: res.data}))
    }

    render() {
        return (
            <div className="servers">
                <h2>Servers</h2>
                {
                    this.state.servers.map((server) => (
                        <ServerItem key={server.id} root={this.props.match.url} server={server}/>
                    ))
                }
            </div>
        );
    }
}

export default Servers;