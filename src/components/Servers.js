import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';
import normalizeUrl from "normalize-url";
import {BrowserRouter as Switch, Link, Route} from "react-router-dom";
import * as config from '../config/config.js';
import { SupervisorAccount } from '@material-ui/icons';
import { Grid, Card, Button, Icon, Paper, CardHeader, CardContent, CardMedia, Typography, Chip } from '@material-ui/core/'


import {Context} from "./User";

const renderPlayersBadge = (server) => {

    if (server.players !== null && server.maxPlayers !== null) {
        return (
            <Chip clickable={false} label={server.players+"/"+server.maxPlayers}>
                <SupervisorAccount />
            </Chip>
        )
    }
};

const renderStatusBadge = (server) => {

    return (
        <Chip clickable={false} color={server.status ? "primary" : "secondary"} label={server.status ? "Online" : "Offline"}/>
    );
}

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
            page: 1,
            error: null,
            isLoaded: false,
            loading: false,
            service: this.props.match.params.id,
            servers: [],
        };
    }

    componentDidMount() {
        axios.get(this.ApiUrl)
            .then((res)=> this.setState({isLoaded: true, servers: res.data}), (error) => this.setState({isLoaded: true, error}));
    }

    loadServers()
    {
        if (!this.state.loading)
        {
            this.setState({loading: true});
            this.state.page = this.state.page+1;
            axios.get(this.ApiUrl+'?page='+this.state.page)
                .then((res) => this.setState({isLoaded: true, servers: [...this.state.servers, ...res.data]}), (error) => this.setState({isLoaded: true, error}))
                .then((res) => this.setState({loading: false}))
        }
    }

    renderBackgroundCardImage(server)
    {
        if (server.imageUrl)
        {
            return (

                <CardMedia image={server.imageUrl} title={server.name}/>
            );
        }
    }

    render() {
        return (
            <Context.Consumer>
                {
                    content => {
                        const { error, isLoaded, servers } = this.state;
                        const { user, logIn, logOut } = content;

                        if (error)
                        {
                            return <Grid>Error: {error.message}</Grid>;
                        }
                        else if (!isLoaded)
                        {
                            return <Grid>Loading...</Grid>;
                        }
                        else {
                            return (
                                <Grid>
                                    <h1>Servers</h1>
                                    <Grid container spacing={16}>
                                            {
                                                servers.map((server) => (
                                                    <Grid item xs={12} lg={6} key={server.id}>
                                                        <Link to={this.props.match.url + "/servers/" + server.id}>
                                                                <Card>
                                                                    {
                                                                        this.renderBackgroundCardImage(server)
                                                                    }
                                                                    <CardContent>
                                                                    <Typography component={"h5"}>
                                                                        {server.name}
                                                                    </Typography>
                                                                    {
                                                                        renderStatusBadge(server)
                                                                    }
                                                                    {
                                                                        renderPlayersBadge(server)
                                                                    }
                                                                    <Typography>{server.description}</Typography>
                                                                    </CardContent>
                                                                </Card>
                                                        </Link>
                                                    </Grid>
                                                ))
                                            }
                                    </Grid>

                                    <div>
                                        <Button variant={"contained"} size={"large"} color={"primary"} onClick={this.loadServers.bind(this)} disabled={this.state.loading} style={{marginTop: '5em', marginBottom: '5em'}}>Load more</Button>
                                    </div>
                                </Grid>
                            )
                        }
                    }

                }
            </Context.Consumer>
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
            isOwner: false,
        };
        this.ApiUrl = normalizeUrl(config.apiUrl+this.state.match.url);
    }


    componentDidMount() {
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
                    <Paper>
                        <Grid xs={12}>
                            <h1>{server.name}</h1>
                            <h3>{server.ip}:{server.port}</h3>
                            <p>{server.description}
                            </p>
                        </Grid>
                    </Paper>
            );
        }
    }
}


export default servers;