import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';
import {Switch, Link, Route, Redirect, Link as RouterLink} from "react-router-dom";
import * as config from '../config/config.js';
import {Input, SupervisorAccount} from '@material-ui/icons';
import { Grid, Card, Button, Paper, CardContent, CardMedia, Typography, Chip, Avatar, Tabs, Tab, Snackbar, SnackbarContent, FormGroup } from '@material-ui/core/'
import {withRouter} from "react-router-dom";
import { MetaTags } from 'react-meta-tags';
import withStyles from "@material-ui/core/es/styles/withStyles";


import {
    XYPlot,
    XAxis,
    YAxis,
    VerticalGridLines,
    HorizontalGridLines,
    AreaSeries,
} from 'react-vis';


const styles = {
    button: {
        marginTop: '5em',
        marginBottom: '5em',
        "&:hover": {
            textDecoration: "none",

        }
    },
    white: {
        color: "white",
    },
    serverItem: {

        textDecoration: "none",
    }
};

import {UserContext} from "./User";
import {
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    FormControl,
    InputLabel, MenuItem,
    Select
} from "@material-ui/core";
import TextField from "@material-ui/core/es/TextField/TextField";
import ListItemText from "../layout/Navigation";

const normalizeUrl = require('normalize-url');


function servers (props) {
    return(
        <Switch>
            <Route exact path={props.match.url} component={withStyles(styles) (withRouter(Servers))}/>
            <Route path={`${props.match.url}/servers/:serverId`} component={Server}/>
        </Switch>
    );
}

class Servers extends Component
{
    constructor(props)
    {
        super(props);
        this.url = normalizeUrl(config.apiUrl+"/"+this.props.match.url, {stripAuthentication: false});
        this.ApiUrl = normalizeUrl(this.url+"/servers", {stripAuthentication: false});
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
            .then((res) => {
                this.setState({serviceObject: res.data})
            });


        axios.get(this.ApiUrl)
            .then((res) => {
                    this.setState({isLoaded: true, servers: res.data})
                },
                (error) => {
                    this.setState({isLoaded: true, error})
            });
    }

    loadServers()
    {
        if (!this.state.isLoading)
        {
            this.setState({isLoading: true});
            this.setState({page: (1+this.state.page)});
            axios.get(this.ApiUrl+'?page='+this.state.page)
                .then((res) => {
                    this.setState({isLoaded: true, servers: [...this.state.servers, ...res.data]},
                        () => {
                                this.setState({isLoading: false})
                        })
                }, (error) => {
                    this.setState({isLoaded: true, error})
                });
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

    renderPlayersBadge (server)
    {
        if (server.stats.PlayersStat != null && server.stats.PlayersStat.value !== null && server.stats.PlayersStat.maxValue !== null) {
            let data = server.stats.PlayersStat.value+"/"+server.stats.PlayersStat.maxValue;
            return (
                <Chip avatar={<Avatar><SupervisorAccount/></Avatar>} clickable={false} label={data}/>
            )
        }
    }


    renderStats( server )
    {
        let data =
            <>
                {this.renderStatusBadge(server)}
                {this.renderPlayersBadge(server)}
            </>;
        return(data)
    }

    renderStatusBadge(server) {

        return (
            <Chip clickable={false} color={server.stats.StatusStat.value ? "primary" : "secondary"} label={server.stats.StatusStat.value ? "Online" : "Offline"}/>
        );
    }

    generateSeo()
    {
        if (this.state.serviceObject)
        {
            return (
                <MetaTags>
                    <title>{this.state.serviceObject.name + " servers" + config.titlePageName}</title>
                    <meta name="description" content={this.state.serviceObject.description} />
                    <meta property="og:title" content={this.state.serviceObject.name} />
                </MetaTags>
            )
        }
    }

    renderServers() {
        const {servers} = this.state;

        if (servers.length > 0)
        {
            return (
                servers.map((server) => (
                    <Grid item xs={12} lg={6} key={server.id}>
                        <Link to={this.props.match.url + "/servers/" + server.id} className={styles.serverItem}>
                            <Card>
                                {
                                    this.renderBackgroundCardImage(server)
                                }
                                <CardContent>
                                    <Typography component={"h5"}>
                                        {server.name}
                                    </Typography>
                                    {
                                        this.renderStats(server)
                                    }
                                    <Typography>{server.description}</Typography>
                                </CardContent>
                            </Card>
                        </Link>
                    </Grid>
                )))
        }
    }

    renderLoadButton()
    {
        const {servers} = this.state;
        const { classes } = this.props;

        if (servers.length > 0) {
            return (
                <Button variant={"contained"} size={"large"} color={"primary"} onClick={this.loadServers.bind(this)} disabled={this.state.isLoading} className={classes.button}>
                    Načíst další
                </Button>
            )
        }

    }


    render() {
        return (
            <UserContext.Consumer>
                {
                    content => {
                        const { error, isLoaded } = this.state;

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
                                <Grid container justify={"center"} spacing={40}>
                                    {this.generateSeo()}
                                    <Grid item xs={12}>
                                    <h1>{this.state.serviceObject.name}</h1>
                                    </Grid>
                                    <Grid item>
                                        <Grid container spacing={16}>
                                            {
                                                this.renderServers()
                                            }
                                        </Grid>
                                    </Grid>

                                    <Grid item xs={12}>
                                        {this.renderLoadButton()}
                                    </Grid>
                                </Grid>
                            )
                        }
                    }

                }
            </UserContext.Consumer>
        );
    }
}

export class ServerForm extends Component
{
    static contextType = UserContext;
    constructor(props)
    {
        super(props);
        this.state = {
            server: {
                service: "",
                name: null,
                description: null,
                ip: null,
                port: null,
                domain: null,
            },
            services: [],
        };
        this.apiUrl = normalizeUrl(config.apiUrl, {stripAuthentication: false});
    }

    generateSeo()
    {

        return (
            <MetaTags>
                <title>{"Přidat server" + config.titlePageName}</title>
                <meta property="og:title" content={"Přidat server"} />
            </MetaTags>
        )

    }


    onChange(formData)
    {
        let server = {...this.state.server};
        let property = formData.target.name;
        server[property] = formData.target.value;
        this.setState({server}, () => console.log(this.state));
    }


    submitForm(e)
    {
        e.preventDefault();
        if (this.state.server.service !== "")
        {
            let url = normalizeUrl(this.apiUrl+"/services/"+this.state.server.service+"/servers/", {stripAuthentication: false});
            axios.post(url, {"login_token": this.context.user.actions.getRawToken(), "server": this.state.server})
                .then((res) => {return (<Redirect to={"/services/"+this.state.server.service+"/servers/"+res.data.server.id} />)})
                .catch();
        }
    }

    componentDidMount() {
        axios.get(this.apiUrl+"/services")
            .then(res => this.setState({services: res.data}));
    }

    renderForm = () =>
    {
        return (
            <>
                <Grid container justify={"center"} style={{marginTop: '25px'}}>
                    {this.generateSeo()}
                    <Grid item xs={10} >
                        <Grid container justify={"center"} spacing={16}>
                            <Grid item xs={12}>
                                <Typography style={styles.white} variant={"h3"}>Nový server</Typography>
                            </Grid>
                            <Grid item xs={8} sm={6}>
                                <ExpansionPanel expanded={true} xs={6}>
                                    <ExpansionPanelDetails xs={6}>
                                        <Grid container justify={"center"} spacing={16}>
                                            <form onSubmit={this.submitForm.bind(this)} style={{marginTop: '25px'}}>
                                                <FormGroup>
                                                    <InputLabel>Služba</InputLabel>
                                                    <Select
                                                        value={this.state.server.service}
                                                        onChange={this.onChange.bind(this)}
                                                        inputProps={{
                                                            name: 'service',
                                                        }}
                                                    >
                                                        <MenuItem value={"none"}>
                                                            <em>None</em>
                                                        </MenuItem>
                                                        {
                                                            this.state.services.map( (service) => (
                                                                    <MenuItem key={service.id} value={service.id}>
                                                                        <em>{service.name}</em>
                                                                    </MenuItem>
                                                                )
                                                            )
                                                        }
                                                    </Select>
                                                </FormGroup>
                                                <FormGroup>
                                                <TextField name={"name"}
                                                            label={"Název"} autoFocus={true} onChange={this.onChange.bind(this)}/>
                                                </FormGroup>
                                                <FormGroup>
                                                    <TextField rows={4}
                                                                multiline name={"description"} label={"Popis"} onChange={this.onChange.bind(this)} />
                                                </FormGroup>
                                                <FormGroup>
                                                    <TextField
                                                         name={"ip"} label={"IP adresa"} onChange={this.onChange.bind(this)} />
                                                    <TextField
                                                         name={"port"} label={"Port"} onChange={this.onChange.bind(this)} />
                                                </FormGroup>
                                                <FormGroup>
                                                <TextField
                                                     name={"domain"} label={"Doména"} onChange={this.onChange.bind(this)} />
                                                </FormGroup>
                                                <FormGroup>
                                                    <Button variant={"contained"} color={"default"} type="submit" style={styles.button}>
                                                        Vytvořit
                                                    </Button>
                                                </FormGroup>

                                            </form>
                                        </Grid>
                                    </ExpansionPanelDetails>
                                </ExpansionPanel>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </>
        );
    }

    render = () =>
    {
        return (
            <>
                {this.renderForm()}
            </>
        )
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
            stats: {
                isLoaded: false,
                keys: [],
                values: [],
                selected: 0,
            },
        };
        this.ApiUrl = normalizeUrl(config.apiUrl+this.state.match.url, {stripAuthentication: false});
    }


    componentDidMount() {

        axios.get(this.ApiUrl)
            .then((res) => this.setState({isLoaded: true, server: res.data}, () => {

                let statsUrl = normalizeUrl(config.apiUrl + this.state.match.url + '/stats', {stripAuthentication: false});
                axios.get(statsUrl)
                    .then((res) => {
                        this.setState({stats: {...this.state.stats, keys: Object.keys(res.data)}}, () => {
                            this.setState({stats: {...this.state.stats, values: Object.values(res.data)}}, () => {
                                this.setState({stats: {...this.state.stats, isLoaded: true}})
                            });
                        });
                    });
            }), (error) => this.setState({isLoaded: true, error}));

    }

    changeStat(event, value)
    {
        this.setState({stats: {...this.state.stats, selected: value}});
    }

    renderGraph()
    {

        let data = this.state.stats.values[this.state.stats.selected];
        data = data.map((item) => {
            return {
                x: new Date(item.date),
                y: item.value,
            }
        });

        return (
            <Grid container justify={"center"}>
                <Grid item xs={12}>
                <XYPlot width={800} height={300} xType={"ordinal"}>
                    <VerticalGridLines />
                    <HorizontalGridLines />
                    <XAxis title={""} />
                    <YAxis />
                    <AreaSeries
                        data={data}
                    />
                </XYPlot>
                </Grid>
            </Grid>
        );
    }

    renderStats() {
        if (this.state.stats.isLoaded)
        {
            return (
                <>
                <Tabs value={this.state.stats.selected} onChange={this.changeStat.bind(this)}>
                    {

                        this.state.stats.keys.map((key) =>
                            <Tab label={key} key={key}>
                            </Tab>
                        )
                    }
                </Tabs>
                {this.renderGraph()}
                </>
            )
        }
    };

    generateSeo()
    {
        if (this.state.server)
        {
            return (
                <MetaTags>
                    <title>{this.state.server.name + config.titlePageName}</title>
                    <meta name="description" content={this.state.server.description} />
                    <meta property="og:title" content={this.state.server.name} />
                </MetaTags>
            )
        }
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
                <Grid container justify={"center"} spacing={40} style={{marginTop: '25px'}}>
                    <Grid item xs={10}>
                    <Paper>
                        {this.generateSeo()}
                        <Grid container justify={"center"} spacing={16}>
                            <Grid item xs={10}>
                            <h1>{server.name}</h1>
                            </Grid>
                            <Grid item xs={10}>
                            <h3>{server.ip}:{server.port}</h3>
                            </Grid>
                            <Grid item xs={10}>
                            {server.description}
                            </Grid>
                            <Grid item xs={10}>
                                <Grid container justify={"center"}>
                                    <Grid item>
                                        {this.renderStats()}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Paper>
                    </Grid>
                </Grid>
            );
        }
    }
}


export default servers;
