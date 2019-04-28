import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';
import {Switch, Link, Route, Redirect, Link as RouterLink} from "react-router-dom";
import * as config from '../config/config.js';
import {Input, SupervisorAccount, DateRange, AttachFile } from '@material-ui/icons';
import { Grid, Card, Button, Paper, CardContent, CardMedia, Typography, Chip, Avatar, Tabs, Tab, Snackbar, SnackbarContent, FormGroup } from '@material-ui/core/'
import {withRouter} from "react-router-dom";
import { MetaTags } from 'react-meta-tags';
import withStyles from "@material-ui/core/es/styles/withStyles";
import classNames from 'classnames';
import {
    FacebookShareButton,
    FacebookIcon,
    TwitterShareButton,
    TwitterIcon
} from 'react-share';


import {
    XYPlot,
    XAxis,
    YAxis,
    VerticalGridLines,
    HorizontalGridLines,
    AreaSeries,
} from 'react-vis';


const styles = theme => ({
    heroUnit: {
        color: theme.palette.background.paper,
        backgroundColor: "#02182B",
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
    header: {
        margin: "1em",
    },
    dark: {
        color: "black",
    },
    cardGrid: {
        padding: `${theme.spacing.unit * 8}px 0`,
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardMedia: {
        backgroundColor: "#55595c"
    },
    cardContent: {
        flexGrow: 1,
    },
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
});

import {UserContext} from "./User";
import {
    CardActions,
    ExpansionPanel,
    ExpansionPanelDetails,
    InputLabel, MenuItem,
    Select
} from "@material-ui/core";
import TextField from "@material-ui/core/es/TextField/TextField";
import Image from "react-bootstrap/Image";

const normalizeUrl = require('normalize-url');


function servers (props) {
    return(
        <Switch>
            <Route exact path={props.match.url} component={withStyles(styles) (withRouter(Servers))}/>
            <Route path={`${props.match.url}/servers/:serverId`} component={withStyles(styles)(Server)}/>
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
            serviceLoaded: false,
            serviceLoading: false,
            serversLoaded: false,
            serversLoading: false,
            service: this.props.match.params.id,
            servers: [],
            serviceObject: (typeof this.props.location.state !== 'undefined') ? this.props.location.state.service : null
        };
    }

    componentDidMount() {

        if (!this.state.serviceObject)
        {
            this.setState({serviceLoading: true});
            axios.get(this.url)
                .then((res) => {
                    this.setState({serviceLoaded: true, serviceObject: res.data}, () => (
                        this.setState({serviceLoading: false})
                    ));
                });

        }
        else
        {
            this.setState({serviceLoaded: true})
        }

        this.setState({serversLoading: true});
        axios.get(this.ApiUrl)
            .then((res) => {
                    this.setState({serversLoaded: true, servers: res.data}, () => (this.setState({serversLoading: false})))
                },
                (error) => {
                    this.setState({serversLoaded: true, error})
            });
    }

    loadServers()
    {
        if (!this.state.serversLoading)
        {
            this.setState({serversLoading: true});
            this.setState({page: (1+this.state.page)});
            axios.get(this.ApiUrl+'?page='+this.state.page)
                .then((res) => {
                    this.setState({serversLoaded: true, servers: [...this.state.servers, ...res.data]},
                        () => {
                                this.setState({serversLoading: false})
                        })
                }, (error) => {
                    this.setState({serversLoaded: true, error})
                });
        }
    }



    renderBackgroundCardImage( server )
    {
        const { classes } = this.props;
        if (server.imageUrl)
        {
            return (

                <CardMedia
                    className={classes.cardMedia} title={server.name}>
                    <Image src={server.imageUrl} fluid />
                </CardMedia>
            );
        }
        else
        {
            return (
                <CardMedia
                className={classes.cardMedia}
                title={server.name}
                >
                    <Image fluid src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_164edaf95ee%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_164edaf95ee%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.32500076293945%22%20y%3D%22118.8%22%3EThumbnail%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"
                         />
                </CardMedia>)
        }
    }

    renderPlayersBadge (server)
    {
        if (server.stats.StatusStat.value && server.stats.PlayersStat != null && server.stats.PlayersStat.value !== null && server.stats.PlayersStat.maxValue !== null) {
            let data = server.stats.PlayersStat.value+"/"+server.stats.PlayersStat.maxValue;
            return (
                <Chip avatar={<Avatar><SupervisorAccount/></Avatar>} clickable={false} label={data}/>
            )
        }
    }

    renderStatusBadge(server) {

        return (
            <Chip clickable={false} color={server.stats.StatusStat.value ? "primary" : "secondary"} label={server.stats.StatusStat.value ? "Online" : "Offline"}/>
        );
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

    generateSeo()
    {
        if (this.state.serviceObject)
        {
            return (
                <MetaTags>
                    <title>{this.state.serviceObject.name + " servery" + config.titlePageName}</title>
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
                    <Grid item xs={12} md={6} key={server.id}>
                            <Card>
                                <Link to={this.props.match.url + "/servers/" + server.id} className={styles.serverItem}>
                                {
                                    this.renderBackgroundCardImage(server)
                                }
                                </Link>
                                <CardContent>
                                    <Grid container>
                                        <Grid item xs={6}>
                                            <Link to={this.props.match.url + "/servers/" + server.id} className={styles.serverItem}>
                                                <Typography component={"h5"}>
                                                    {server.name}
                                                </Typography>
                                            </Link>
                                        </Grid>
                                        <Grid item xs={6}>
                                        {
                                            this.renderStats(server)
                                        }
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography>
                                                {server.domain.length ? server.domain : server.ip+":"+server.port}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                                <CardActions>
                                    <Button size={"small"}><Link to={this.props.match.url + "/servers/" + server.id}>Otevřít</Link></Button>
                                </CardActions>
                            </Card>
                    </Grid>
                )))
        }
    }

    renderLoadButton()
    {
        const {servers} = this.state;
        const { classes } = this.props;

        if (servers.length > 0 && servers.length < this.state.serviceObject.serverCount) {
            return (
                <Button variant={"contained"} size={"large"} color={"primary"} onClick={this.loadServers.bind(this)} disabled={this.state.serversLoading} className={classes.button}>
                    Načíst další
                </Button>
            )
        }

    }

    renderService = (classes) => {
        return (
            <>
                {this.generateSeo()}
                <div className={classes.heroUnit}>
                    <div className={classes.heroContent}>
                        <Typography component="h1" variant="h2" align="center" color={"inherit"} gutterBottom>
                            {this.state.serviceObject.name}
                        </Typography>
                        <Typography variant={"h6"} align={"center"} color={"inherit"} paragraph>
                            {this.state.serviceObject.description}
                        </Typography>
                    </div>
                </div>
            </>
        )
    }


    render() {
        const {classes} = this.props;
        return (
            <UserContext.Consumer>
                {
                    content => {
                        const { error } = this.state;
                        let servers, service = null;
                        if (error)
                        {
                            servers = <Grid>Error: {error.message}</Grid>;
                        }
                        else if (!this.state.serversLoaded)
                        {
                            servers = <Grid>Loading...</Grid>;
                        }
                        else {
                            servers = (this.renderServers())
                        }

                        if (!this.state.serviceLoaded)
                        {
                            service = <Grid>Loading...</Grid>;
                        }
                        else {
                            service = (this.renderService(classes));
                        }

                        return (
                            <main>
                                {service}
                                <div className={classNames(classes.layout, classes.cardGrid)}>
                                    <Grid container spacing={40}>
                                        {servers}
                                    </Grid>
                                    <Grid item xs={12}>
                                        {this.renderLoadButton()}
                                    </Grid>
                                </div>
                            </main>

                        )
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
                                                    <InputLabel htmlFor="service-select">Služba</InputLabel>
                                                    <Select
                                                        value={this.state.server.service}
                                                        onChange={this.onChange.bind(this)}
                                                        inputProps={{
                                                            name: 'service',
                                                            id: 'service-select'
                                                        }}
                                                    >
                                                        <MenuItem value={"none"}>
                                                            <em>Nevybrána</em>
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
                {this.context.user.account ? this.renderForm() : <Redirect to={"/auth"} />}
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
                                this.reduceStats();
                                this.setState({stats: {...this.state.stats, isLoaded: true}})
                            });
                        });
                    });
            }), (error) => this.setState({isLoaded: true, error}));

    }

    reduceStats = () => {

    };

    changeStat(event, value)
    {
        console.log(value);
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
        const {classes} = this.props;
        if (this.state.stats.isLoaded)
        {
            return (
                <>
                <Tabs className={classes.dark} value={this.state.stats.selected} onChange={this.changeStat.bind(this)}>
                    {
                        this.state.stats.keys.map((key, id) =>
                            {
                                let keyTitle = key.slice(0, key.indexOf("Stat"));
                                if (this.state.stats.values[id].length > 0)
                                    return(<Tab label={keyTitle} value={id} key={id}/>)
                            }
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


    renderServerImage()
    {
        if (this.state.server.imageUrl)
        {
             return (
                 <Grid item xs={12}>
                    <Image src={this.state.server.imageUrl}/>
                </Grid>
            );
        }
    }


    renderPlayersBadge ()
    {
        if (this.state.server.stats.StatusStat.value && this.state.server.stats.PlayersStat != null && this.state.server.stats.PlayersStat.value !== null && this.state.server.stats.PlayersStat.maxValue !== null) {
            let data = this.state.server.stats.PlayersStat.value+"/"+this.state.server.stats.PlayersStat.maxValue;
            return (
                <Chip avatar={<Avatar><SupervisorAccount/></Avatar>} clickable={false} label={data}/>
            )
        }
    }

    renderStatusBadge() {

        return (
            <Chip clickable={false} color={this.state.server.stats.StatusStat.value ? "primary" : "secondary"} label={this.state.server.stats.StatusStat.value ? "Online" : "Offline"}/>
        );
    }

    renderBadges()
    {
        let {classes} = this.props;
        let data =
            <>
                <div className={classes.header}>
                    {this.renderStatusBadge()}
                    {this.renderPlayersBadge()}
                </div>
            </>;
        return(data)
    }

    renderSocialBadges = () =>
    {
        let { server } = this.state;
        let {classes} = this.props;
        let quote = "Bavím se na serveru: "+server.name+"! Připoj se taky! "+this.getServerAddress();
        let data =
            <>
                <div className={classes.header}>
                    <Grid container justify={"center"}>
                        <Grid item>
                            <FacebookShareButton url={window.location.href} quote={quote}>
                                <FacebookIcon size={64} round={true}/>
                            </FacebookShareButton>
                        </Grid>
                        <Grid item>
                            <TwitterShareButton url={window.location.href} quote={quote}>
                                <TwitterIcon size={64} round={true}/>
                            </TwitterShareButton>
                        </Grid>
                    </Grid>
                </div>
            </>;


        return data;
    }

    getServerAddress()
    {
        let {server} = this.state;
        return (server.domain.length ? server.domain : server.ip+":"+server.port);
    }

    renderDate = () =>
    {
        let {server} = this.state;
        let {classes} = this.props;
        return (
            <div className={classes.header}>
                <Chip clickable={false} avatar={<Avatar><DateRange/></Avatar>} label={new Date(server.createdAt).toLocaleDateString('cs', {year: "numeric", month: "2-digit", day: "numeric"})} />
            </div>
        )
    }

    clipAddress = () =>
    {
        var doc = document.createElement('textarea');
        doc.value = this.getServerAddress();
        document.body.appendChild(doc);
        doc.select();
        document.execCommand("copy");
        document.body.removeChild(doc);
    }

    render() {

        const {classes} = this.props;
        const { error, isLoaded, server } = this.state;
        let data = null;
        if (error)
        {
            data = (<div>Error: {error.message}</div>);
        }
        else if (!isLoaded)
        {
            data = (<div>Loading...</div>);
        }
        else
        {
            data = (
                <Paper className={classes.paper}>
                    {this.generateSeo()}
                    <Grid container justify={"center"} spacing={16}>
                        <Grid item xs={12}>
                            <Grid container>
                                <Grid item xs={6}>
                                    <Grid container justify={"flex-start"}>
                                        {this.renderDate()}
                                    </Grid>
                                </Grid>
                                <Grid item xs={6}>
                                    <Grid container justify={"flex-end"}>
                                    {
                                        this.renderBadges()
                                    }
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container justify={"center"}>
                                <Grid item xs={12}>
                                    <Typography variant={"h1"}>
                                        {server.name}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container>
                                        <Grid item xs={12}>
                                            <Typography variant={"h5"}>{this.getServerAddress()}</Typography>
                                            <Chip clickable={true} avatar={<Avatar><AttachFile/></Avatar>} onClick={this.clipAddress.bind(this)} label={"Zkopírovat"}/>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        {
                            this.renderServerImage()
                        }
                        <Grid item xs={10}>
                            <Grid container justify={"flex-start"}>
                                <Typography variant={"body1"}>
                                    {server.description}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container justify={"flex-end"}>
                                <Grid item>
                                {
                                    this.renderSocialBadges()
                                }
                                </Grid>
                            </Grid>
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
            );
        }

        return (
            <Grid container justify={"center"} spacing={40} style={{marginTop: '25px'}}>
                <Grid item xs={10} sm={10} md={8}>
                    {data}
                </Grid>
            </Grid>
        );
    }
}

export default servers;
