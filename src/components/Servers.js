import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';
import normalizeUrl from "normalize-url";
import {Switch, Link, Route} from "react-router-dom";
import * as config from '../config/config.js';
import { SupervisorAccount } from '@material-ui/icons';
import { Grid, Card, Button, Icon, Paper, CardHeader, CardContent, CardMedia, Typography, Chip } from '@material-ui/core/'
import {withRouter} from "react-router-dom";
import { ReactTitle } from 'react-meta-tags';


import {UserContext} from "./User";

const renderPlayersBadge = (server) => {

    if (server.stats.PlayersStat != null && server.stats.PlayersStat.value !== null && server.stats.PlayersStat.maxValue !== null) {
        return (
            <Chip clickable={false} label={server.stats.PlayersStat.value+"/"+server.stats.PlayersStat.maxValue}>
                <SupervisorAccount />
            </Chip>
        )
    }
};

const renderStatusBadge = (server) => {

    return (
        <Chip clickable={false} color={server.stats.StatusStat.value ? "primary" : "secondary"} label={server.stats.StatusStat.value ? "Online" : "Offline"}/>
    );
};

const servers = (props) => (
    <Switch>
        <Route exact path={props.match.url} component={withRouter(Servers)} />
        <Route path={`${props.match.url}/servers/:serverId`} component={Server}/>
    </Switch>
);

class Servers extends Component
{
    constructor(props)
    {
        super(props);
        this.url = normalizeUrl(config.apiUrl+"/"+this.props.match.url);
        this.ApiUrl = normalizeUrl(this.url+"/servers");
        this.state = {
            page: 2,
            error: null,
            isLoaded: false,
            isLoading: false,
            service: this.props.match.params.id,
            serviceObject: null,
            servers: [],
        };
    }

    componentDidMount() {

        axios.get(this.url)
            .then((res) => {this.setState({serviceObject: res.data}); console.log(res.data)});


        axios.get(this.ApiUrl)
            .then((res)=> this.setState({isLoaded: true, servers: res.data}), (error) => this.setState({isLoaded: true, error}));
    }

    loadServers()
    {
        if (!this.state.isLoading)
        {
            this.setState({isLoading: true});
            this.setState({page: (1+this.state.page)});
            axios.get(this.ApiUrl+'?page='+this.state.page)
                .then((res) => this.setState({isLoaded: true, servers: [...this.state.servers, ...res.data]}), (error) => this.setState({isLoaded: true, error}))
                .then((res) => this.setState({isLoading: false}))
        }
    }

    renderBackgroundCardImage( server )
    {
        if (server.imageUrl)
        {
            return (

                <CardMedia image={server.imageUrl} title={server.name}/>
            );
        }
    }

    generateSeoTitle()
    {
        if (this.state.serviceObject)
        {
            return (<ReactTitle title={this.state.serviceObject.name + " servers" + config.titlePageName}/>)
        }
    }

    renderStats( server )
    {

        let data =
            <>
                {renderStatusBadge(server)}
                {renderPlayersBadge(server)}
            </>;
        return(data)
    }

    render() {
        return (
            <UserContext.Consumer>
                {
                    content => {
                        const { error, isLoaded, servers } = this.state;
                        this.generateSeoTitle();
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
                                                                {this.renderStats(server)}
                                                                <Typography>{server.description}</Typography>
                                                                </CardContent>
                                                            </Card>
                                                    </Link>
                                                </Grid>
                                            ))
                                        }
                                    </Grid>

                                    <div>
                                        <Button variant={"contained"} size={"large"} color={"primary"} onClick={this.loadServers.bind(this)} disabled={this.state.isLoading} style={{marginTop: '5em', marginBottom: '5em'}}>Load more</Button>
                                    </div>
                                </Grid>
                            )
                        }
                    }

                }
            </UserContext.Consumer>
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



    generateSeoTitle()
    {
        if (this.state.server)
        {
            return (<ReactTitle title={this.state.server.name + " servers" + config.titlePageName}/>)
        }
    }

    render() {
        const { error, isLoaded, server } = this.state;
        this.generateSeoTitle();
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
                        <Grid>
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