import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';
import ServerItem from "../Servers/ServerItem";

class Servers extends Component
{
    ApiUrl = 'http://localhost/serverlist-api/v1/services';
    state = {
        service: this.props.match.params.id,
        servers: [],
    };

    componentDidMount() {
        this.ApiUrl += "/"+this.state.service+"/servers";
        console.log(this.ApiUrl);
        axios.get(this.ApiUrl)
            .then(res => this.setState({servers: res.data}))
            .then(console.log(this.state.servers))
    }

    render() {
        return (
            <div className="servers">
                <h2>Servers</h2>
                {
                    this.state.servers.map((server) => (
                        <ServerItem key={server.id} server={server}/>
                    ))
                }
            </div>
        );
    }
}

export default Servers;