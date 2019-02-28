import React, { Component } from 'react';
import '../App.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class ServerItem extends Component
{
    state = {
        server: this.props.server,
        url: "server/"+this.props.server.id
    };

    render() {

        return (
            <Link to={this.state.url}>
            <div className="service">
                <h2>Server {this.state.server.name}</h2>
            </div>
            </Link>
        )
    }
}

export default ServerItem