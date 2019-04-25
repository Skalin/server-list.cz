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
import classNames from 'classnames';


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

        if (servers.length > 0 && servers.length < 50) {
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


export class ServerWidgetGenerator extends Component
{
    static contextType = UserContext;

    constructor(props)
    {
        super(props);
        this.state = {
            servers: [],
            languages: ['JavaScript', 'PHP'],
            generator: {
                language: "",
                server: "",
            }
        };
    }

    componentDidMount()
    {

        axios.post(config.apiUserUrl+'/servers', {login_token: this.context.user.actions.getRawToken()})
            .then((res) => {this.setState({servers: res.data})});
    }

    generateSeo()
    {
        if (this.state.server)
        {
            return (
                <MetaTags>
                    <title>{"Vygenerovat status widget" + config.titlePageName}</title>
                    <meta name="description" content={this.state.server.description} />
                    <meta property="og:title" content={this.state.server.name} />
                </MetaTags>
            )
        }
    }


    onChange(formData)
    {
        let generator = {...this.state.generator};
        let property = formData.target.name;
        generator[property] = formData.target.value;
        this.setState({generator});
    }


    renderForm = () => {
        return (
            <>
                <Grid container justify={"center"} style={{marginTop: '25px'}}>
                    {this.generateSeo()}
                    <Grid item xs={10} >
                        <Grid container justify={"center"} spacing={16}>
                            <Grid item xs={12}>
                                <Typography style={styles.white} variant={"h3"}>Generátor widgetů</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <ExpansionPanel expanded={true} xs={6}>
                                    <ExpansionPanelDetails xs={6}>
                                        <Grid container justify={"center"} spacing={16}>
                                            <Grid item>
                                                <form style={{marginTop: '25px'}}>
                                                    <FormGroup style={{margin: "1em"}}>
                                                        <InputLabel htmlFor="server-select">Server</InputLabel>
                                                        <Select
                                                            value={this.state.generator.server}
                                                            displayEmpty
                                                            onChange={this.onChange.bind(this)}
                                                            inputProps={{
                                                                name: 'server',
                                                                id: 'server-select'
                                                            }}
                                                        >
                                                            <MenuItem disabled selected value={""}>
                                                                <em>Nevybrán</em>
                                                            </MenuItem>
                                                            {
                                                                this.state.servers.map( (server) => (
                                                                        <MenuItem key={server.id} value={server}>
                                                                            <em>{server.name} - {server.ip}:{server.port}</em>
                                                                        </MenuItem>
                                                                    )
                                                                )
                                                            }
                                                        </Select>
                                                    </FormGroup>
                                                    <FormGroup style={{margin: "1em"}}>
                                                        <InputLabel htmlFor="language-select">Jazyk</InputLabel>
                                                        <Select
                                                            displayEmpty
                                                            value={this.state.generator.language}
                                                            onChange={this.onChange.bind(this)}
                                                            inputProps={{
                                                                name: 'language',
                                                                id: 'language-select'
                                                            }}
                                                        >
                                                            <MenuItem disabled selected value={""}>
                                                                <em>Nevybrán</em>
                                                            </MenuItem>
                                                            {
                                                                this.state.languages.map( (key, value) => (
                                                                        <MenuItem key={value} value={value}>
                                                                            <em>{key}</em>
                                                                        </MenuItem>
                                                                    )
                                                                )
                                                            }
                                                        </Select>
                                                    </FormGroup>
                                                    <FormGroup>
                                                        <Typography>

                                                        </Typography>
                                                    </FormGroup>
                                                </form>
                                            </Grid>
                                            <Grid item>
                                                {this.renderWidget()}
                                            </Grid>
                                        </Grid>
                                    </ExpansionPanelDetails>
                                </ExpansionPanel>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </>
        )
    }

    renderWidget = () => {
        if (this.state.generator.server !== "" && this.state.generator.language !== "")
        {
            var data = null;
            if (this.state.languages[this.state.generator.language] === 'PHP')
            {
                data =
                    <pre style={{textAlign: 'left', whiteSpace: 'pre-wrap'}}><code>{`
                    <?php

                    class Widget
                    {

                        public $name = null;
                        public $address = null;
                        public $status = null;
                        public $ping = null;
                        public $players = null;

                        private function parseOutput($c)
                        {
                            $this->name = $c['name'];
                            $this->address = (isset($c['domain']) && !empty($c['domain'])) ? $c['domain'] : ($c['ip'].":".$c['port']);
                            $this->status = (isset($c['stats']['StatusStat']['value']) && $c['stats']['StatusStat']['value']) ? "Online" : "Offline";
                            $this->ping = isset($c['stats']['PingStat']['value']) ? $c['stats']['PingStat']['value'] : null;
                            $this->players = (isset($c['stats']['PlayersStat']['value']) && isset($c['stats']['PlayersStat']['maxValue'])) ? $c['stats']['PlayersStat']['value']."/".$c['stats']['PlayersStat']['maxValue'] : null;
                        }

                        private function get()
                        {

                            $url = "https://api.server-list.cz/v1/services/`+this.state.generator.server.service_id+`/servers/`+this.state.generator.server.id+`";
                            $ch = curl_init();
                            curl_setopt($ch, CURLOPT_URL, $url);
                            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

                            $contents = curl_exec($ch);
                            $contents = json_decode($contents, true);
                            $this->parseOutput($contents);

                            curl_close($ch);
                        }

                        public function render()
                        {
                            $this->get();
                            return "
                                <div style=\"box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2); transition: 0.3s;\">
                                    <div style=\"padding: 2px 16px;\">
                                        <h4><b>{$this->name}</b></h4>
                                        <p>IP: {$this->address}</p>
                                        <p>Status: {$this->status}</p>
                                        <?php if (!$this->status): ?>
                                            <p>Počet hráčů: {$this->players}</p>
                                            <p>Ping: {$this->ping}</p>
                                        <?php endif;>
                                    </div>
                                </div>
                            ";
                        }
                    }

                    $widget = new Widget;
                    echo $widget->render();

                    ?>
                    `}</code></pre>;
                console.log(data);
            }
            return (
                data
            )
        }
    }

    render()
    {
        return (
            <>
            {this.renderForm()}
            </>
        )
    }
}

export default servers;
