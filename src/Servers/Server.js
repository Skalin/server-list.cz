import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';
import normalizeUrl from "normalize-url";

class Server extends Component
{
    ApiUrl = 'http://localhost/serverlist-api/v1/';
    state = {
        error: null,
        isLoaded: false,
        url: this.props.match.url,
        server: null,
    };

    componentDidMount() {
        this.ApiUrl = normalizeUrl(this.ApiUrl+this.state.url);
        axios.get(this.ApiUrl)
            .then((res) => this.setState({isLoaded: true, server: res.data}), (error) => this.setState({isLoaded: true, error}))
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
                <React.Fragment>
                    <div className="server">
                        <h1>{server.name}</h1>
                        <h3>{server.ip}:{server.port}</h3>
                        <p>

                        </p>
                    </div>
                </React.Fragment>
            );
        }
    }
}

export default Server;