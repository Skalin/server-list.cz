import React, {Component} from 'react';
import '../App.css';
import {Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import LineChart from 'recharts/lib/chart/LineChart';
import Line from 'recharts/lib/cartesian/Line';
import Slider from '@material-ui/lab/Slider';
import axios from 'axios';
import {Switch, Link, Route, Redirect} from "react-router-dom";
import * as config from '../config/config.js';
import withWidth, {isWidthUp} from '@material-ui/core/withWidth';
import {SupervisorAccount, Visibility, VisibilityOff, DateRange, AttachFile, ArrowDownward} from '@material-ui/icons';
import {
    Grid,
    Card,
    Button,
    Paper,
    CardContent,
    CardMedia,
    Typography,
    Chip,
    Avatar,
    Tabs,
    Tab,
    Snackbar,
    SnackbarContent,
    FormGroup
} from '@material-ui/core/'
import {withRouter} from "react-router-dom";
import {MetaTags} from 'react-meta-tags';
import withStyles from "@material-ui/core/es/styles/withStyles";
import classNames from 'classnames';
import {
    FacebookShareButton,
    FacebookIcon,
    TwitterShareButton,
    TwitterIcon
} from 'react-share';


const styles = theme => ({
    heroUnit: {
        color: theme.palette.background.paper,
        backgroundColor: "#02182B",
    },
    progress: {
        margin: theme.spacing.unit * 2,
        color: "white"

    },
    heroContent: {
        maxWidth: 1000,
        margin: '0 auto',
        padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 6}px`,
    },
    headingLink: {
        "&:hover": {
            textDecoration: "none",
            color: "black"
        }
    },
    headingButton: {
        marginTop: "2em",
        backgroundColor: "rgba(0, 120, 255, 1)",
        color: 'white',
        "&:hover": {
            textDecoration: "none",
            color: "black"
        }
    },
    darkHover: {
        "&:hover": {
            textDecoration: "none",
            color: "white",
            backgroundColor: "#2c2c36"
        }
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
    paper: {
        backgroundColor: "#2c2c36",
        color: "white",
        margin: "1em",
        paddingBottom: "2em",
    },
    header: {
        margin: "1em",
    },
    dark: {
        color: "black",
    },
    paperHeader: {
        marginTop: "1em",
        marginLeft: "1em",
        paddingBottom: "0.3em",
    },
    cardGrid: {
        padding: `${theme.spacing.unit * 8}px 0`,
    },
    card: {
        backgroundColor: "#2c2c36",
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: "all .2s ease-in-out",
        "&:hover": {
            transform: "scale(1.1, 1.1)"
        }
    },
    cardTitle: {
        color: "white",
        fontWeight: "bold",
        textDecoration: "none",
        "&:hover": {
            textDecoration: "inherit",
        }

    },
    cardMedia: {
        backgroundColor: "#55595c"
    },
    cardContent: {
        flexGrow: 1,
    },
    button: {
        backgroundColor: "#0078FF",
        marginTop: '5em',
        marginBottom: '5em',
        "&:hover": {
            textDecoration: "none",
            backgroundColor: "rgb(72,72,72)",
        }
    },
    white: {
        color: "white",
    },
    serverItem: {

        textDecoration: "none",
    },
    title: {
        marginBottom: "1em",
    },
    clickable: {
        "&:hover": {cursor: "pointer"}
    }
});

import {UserContext} from "./User";
import {
    CardActions, Checkbox, CircularProgress,
    ExpansionPanel,
    ExpansionPanelDetails, FormControlLabel,
    InputLabel, MenuItem,
    Select
} from "@material-ui/core";
import TextField from "@material-ui/core/es/TextField/TextField";
import Image from "react-bootstrap/Image";
import CartesianGrid from "recharts/es6/cartesian/CartesianGrid";
import {Circle} from "react-circle";
import {isWidthDown} from "@material-ui/core/es/withWidth";

const normalizeUrl = require('normalize-url');

function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return map;
}

function servers(props) {
    return (
        <Switch>
            <Route exact path={props.match.url} component={withStyles(styles)(withRouter(Servers))}/>
            <Route exact path={`${props.match.url}/servers/:serverId`}
                   component={withWidth({resizeInterval: 20})(withStyles(styles)(Server))}/>
            <Route path={`${props.match.url}/servers/:serverId/review`}
                   component={withWidth()(withStyles(styles)(ServerReview))}/>
        </Switch>
    );
}


class ServerReview extends Component {

    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = {
            apiUrl: normalizeUrl(config.apiUrl + "/" + this.props.match.url + "s", {stripAuthentication: false}),
            redirect: this.props.match.url.split("/review")[0],
            review: {
                id: null,
                server: null,
                title: null,
                rating: 50,
                server_id: this.props.match.params["serverId"],
                text: null
            }
        };
    }

    onChange(formData) {
        let review = {...this.state.review};
        let property = formData.target.name;
        review[property] = formData.target.value;
        this.context.error = null;
        this.setState({review});
    }

    handleSlider = (event, data) => {
        const {review} = this.state;
        review.rating = data;
        this.setState({review: review});
    };

    submitForm = (e) => {
        e.preventDefault();
        const {apiUrl, review} = this.state;

        axios.post(apiUrl, {"login_token": this.context.user.actions.getRawToken(), "review": review})
            .then((res) => {
                this.setState({review: res.data})
            });
    };

    renderForm = () => {
        const {classes} = this.props;
        const {rating} = this.state.review;

        return (
            <form onSubmit={this.submitForm.bind(this)} style={{marginTop: '25px'}}>
                <FormGroup>
                    <TextField autoFocus={true} required label={"Titulek"} type="text" name="title"
                               onChange={this.onChange.bind(this)}/>
                </FormGroup>
                <FormGroup>
                    <TextField label={"Obsah recenze"} required rows={4} multiline={true} type="text" name="text"
                               onChange={this.onChange.bind(this)}/>
                </FormGroup>
                <FormGroup style={{marginTop: "1em"}}>
                    <Typography id={"slider"} style={{color: "#777777", fontSize: "15px"}} align={"left"}>
                        Hodnocení
                    </Typography>
                    <Slider value={rating} min={0} max={100} step={5} color={"inherit"}
                            onChange={this.handleSlider} aria-labelledby={"slider"} style={{marginTop: "1em"}}
                    />
                </FormGroup>
                <Button className={classNames(classes.headingButton, classes.darkHover)} variant={"contained"}
                        color={"primary"}
                        type="submit">Ohodnotit</Button>
            </form>
        );
    };

    render() {
        const {redirect, review} = this.state;

        return (
            !this.context.user.account ? <Redirect to={"/auth"}/> :
                review.id ?
                    <Redirect to={redirect}/>
                    :
                    <>
                        <Grid container justify={"center"} style={{marginTop: '25px'}}>
                            {//this.generateSeo()
                            }
                            <Grid item xs={10}>
                                <Grid container justify={"center"} spacing={16}>
                                    <Grid item xs={12}>
                                        <Typography style={{color: "white"}} variant={"h3"}>Recenze</Typography>
                                    </Grid>
                                    <Grid item xs={8} sm={6}>
                                        <ExpansionPanel expanded={true} xs={6}>
                                            <ExpansionPanelDetails xs={6}>
                                                <Grid container justify={"center"} spacing={16}>

                                                    {this.renderForm()}
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
}

class Servers extends Component {
    constructor(props) {
        super(props);
        this.url = normalizeUrl(config.apiUrl + "/" + this.props.match.url, {stripAuthentication: false});
        this.ApiUrl = normalizeUrl(this.url + "/servers", {stripAuthentication: false});
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

        if (!this.state.serviceObject) {
            this.setState({serviceLoading: true});
            axios.get(this.url)
                .then((res) => {
                    this.setState({serviceLoaded: true, serviceObject: res.data}, () => (
                        this.setState({serviceLoading: false})
                    ));
                });

        } else {
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

    loadServers() {
        if (!this.state.serversLoading) {
            this.setState({serversLoading: true});
            this.setState({page: (1 + this.state.page)});
            axios.get(this.ApiUrl + '?page=' + this.state.page)
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


    renderBackgroundCardImage(server) {
        const {classes} = this.props;
        if (server.imageUrl) {
            return (

                <CardMedia
                    className={classes.cardMedia} title={server.name}>
                    <Image src={server.imageUrl} fluid/>
                </CardMedia>
            );
        } else {
            return (
                <CardMedia
                    component="img"
                    image="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_164edaf95ee%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_164edaf95ee%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.32500076293945%22%20y%3D%22118.8%22%3EThumbnail%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"
                    className={classes.cardMedia}
                    title={server.name}
                />)
        }
    }

    renderPlayersBadge(server) {

        const {stats} = server;
        const {classes} = this.props;

        if (stats && stats.StatusStat && stats.StatusStat.value && stats.PlayersStat && stats.PlayersStat.value !== null && stats.PlayersStat.maxValue !== null) {
            let data = stats.PlayersStat.value + "/" + stats.PlayersStat.maxValue;
            return (
                <div className={classes.header}>
                    <SupervisorAccount/>
                    <Typography color={"inherit"}>
                        {data}
                    </Typography>
                </div>
            )
        }
    }

    renderStatusBadge(server) {

        const {classes} = this.props;

        if (server.stats && server.stats.StatusStat) {
            const icon = server.stats.StatusStat.value ? <Visibility color={"inherit"}/> :
                <VisibilityOff color={"inherit"}/>;
            return (
                <div className={classes.header}>
                    {icon}
                    <Typography color={"inherit"}>
                        {server.stats.StatusStat.value ? "Online" : "Offline"}
                    </Typography>
                </div>
            );
        }
    }

    renderStats(server) {
        let data =
            <Grid container justify={"center"}>
                <Grid item xs={server.stats.StatusStat.value ? 6 : 12}>
                    {this.renderStatusBadge(server)}
                </Grid>
                {
                    server.stats.StatusStat.value ?
                    <Grid item xs={6}>
                        {this.renderPlayersBadge(server)}
                    </Grid>
                    : null
                }
            </Grid>;
        return (data)
    }

    generateSeo() {
        if (this.state.serviceObject) {
            return (
                <MetaTags>
                    <title>{this.state.serviceObject.name + " servery" + config.titlePageName}</title>
                    <meta name="description" content={this.state.serviceObject.description}/>
                    <meta property="og:title" content={this.state.serviceObject.name}/>
                </MetaTags>
            )
        }
    }


    getIp = (server) => {
        return ((!server.show_port && server.domain && server.domain.length) ? server.domain : server.ip + ":" + server.port);
    };

    renderServers() {
        const {servers} = this.state;
        const {classes} = this.props;

        if (servers.length > 0) {
            return (
                servers.map((server) => (
                    <Grid item xs={12} sm={6} md={4} key={server.id}>
                        <Card className={classes.card}>
                            <Link to={this.props.match.url + "/servers/" + server.id} className={styles.serverItem}>
                                {
                                    this.renderBackgroundCardImage(server)
                                }
                            </Link>
                            <CardContent>
                                <Grid container justify={"center"}>
                                    <Grid item xs={12}>
                                        <Link to={this.props.match.url + "/servers/" + server.id}
                                              className={classNames(styles.serverItem, classes.cardTitle)}>
                                            <Typography className={classes.cardTitle} component={"h5"}>
                                                {server.name}
                                            </Typography>
                                        </Link>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography style={{color: "white", margin: "1em"}}>
                                            IP: {this.getIp(server)}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        {
                                            this.renderStats(server)
                                        }
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                )))
        }
    }

    renderLoadButton() {
        const {servers} = this.state;
        const {classes} = this.props;

        if ((servers.length > 0) && (servers.length < this.state.serviceObject.serverCount)) {
            return (
                this.state.serversLoading ? <Grid><CircularProgress className={classes.progress}/></Grid> :
                <Button variant={"contained"} size={"large"} color={"primary"} onClick={this.loadServers.bind(this)}
                        disabled={this.state.serversLoading} className={classes.button}>
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
    };


    render() {
        const {classes} = this.props;
        return (
            <UserContext.Consumer>
                {
                    content => {
                        const {error} = this.state;
                        let data, service = null;
                        if (error) {
                            data = <Grid>Error: {error.message}</Grid>;
                        } else if (!this.state.serversLoaded) {
                            data = <Grid><CircularProgress className={classes.progress}/></Grid>;
                        } else {
                            data = (this.renderServers())
                        }

                        if (!this.state.serviceLoaded) {
                            service = <Grid><CircularProgress className={classes.progress}/></Grid>;
                        } else {
                            service = (this.renderService(classes));
                        }

                        return (
                            <main>
                                {service}
                                <div className={classNames(classes.layout, classes.cardGrid)}>
                                    <Grid container spacing={40} justify={"center"}>
                                        {data}
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

export class ServerForm extends Component {
    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = {
            server: {
                service: "",
                name: null,
                description: null,
                ip: null,
                port: null,
                domain: null,
                show_port: false
            },
            services: [],
            redirect: false,
            redirectUrl: null
        };
        this.apiUrl = normalizeUrl(config.apiUrl, {stripAuthentication: false});
    }

    generateSeo() {

        return (
            <MetaTags>
                <title>{"Přidat server" + config.titlePageName}</title>
                <meta property="og:title" content={"Přidat server"}/>
            </MetaTags>
        )

    }


    onChange(formData) {
        let server = {...this.state.server};
        let property = formData.target.name;
        server[property] = formData.target.value;
        this.setState({server});
    }


    submitForm(e) {
        e.preventDefault();
        if (this.state.server.service !== "") {
            let url = normalizeUrl(this.apiUrl + "/services/" + this.state.server.service + "/servers/", {stripAuthentication: false});
            axios.post(url, {"login_token": this.context.user.actions.getRawToken(), "server": this.state.server})
                .then((res) => {
                    this.setState({
                        redirect: true,
                        redirectUrl: "/services/" + res.data.service_id + "/servers/" + server.id
                    }, () => (this.setState({redirect: false, redirectUrl: null})))
                })
                .catch();
        }
    }

    componentDidMount() {
        axios.get(this.apiUrl + "/services")
            .then(res => this.setState({services: res.data}));
    }

    renderForm = () => {
        return (
            <>
                <Grid container justify={"center"} style={{marginTop: '25px'}}>
                    {this.generateSeo()}
                    <Grid item xs={10}>
                        <Grid container justify={"center"} spacing={16}>
                            <Grid item xs={12}>
                                <Typography style={{color: "white"}} variant={"h3"}>Nový server</Typography>
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
                                                            this.state.services.map((service) => (
                                                                    <MenuItem key={service.id} value={service.id}>
                                                                        <em>{service.name}</em>
                                                                    </MenuItem>
                                                                )
                                                            )
                                                        }
                                                    </Select>
                                                </FormGroup>
                                                <FormGroup>
                                                    <TextField name={"name"} required
                                                               label={"Název"} autoFocus={true}
                                                               onChange={this.onChange.bind(this)}/>
                                                </FormGroup>
                                                <FormGroup>
                                                    <TextField rows={4}
                                                               multiline name={"description"} label={"Popis"}
                                                               onChange={this.onChange.bind(this)}/>
                                                </FormGroup>
                                                <FormGroup>
                                                    <TextField required
                                                        name={"ip"} label={"IP adresa"}
                                                        onChange={this.onChange.bind(this)}/>
                                                    <TextField required
                                                        name={"port"} label={"Port"}
                                                        onChange={this.onChange.bind(this)}/>
                                                </FormGroup>
                                                <FormGroup>
                                                    <TextField
                                                        name={"domain"} label={"Doména"}
                                                        onChange={this.onChange.bind(this)}/>
                                                </FormGroup>
                                                <FormGroup>

                                                    <FormControlLabel
                                                        control={<Checkbox checked={this.state.server.show_port} onChange={this.onChange.bind(this)} value="0" />}
                                                        label="Zobrazovat port"
                                                    />
                                                    <Checkbox
                                                        name={"show_port"} label={"Zobrazovat port"}
                                                        onChange={this.onChange.bind(this)}/>
                                                </FormGroup>
                                                <FormGroup>
                                                    <Button variant={"contained"} color={"default"} type="submit"
                                                            style={styles.button}>
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
    };

    render = () => {
        return (
            <>
                {this.state.redirect ? <Redirect to={this.state.redirectUrl}/> : ""}
                {this.context.user.account ? this.renderForm() : <Redirect to={"/auth"}/>}
            </>
        )
    }

}

class Server extends Component {

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
                url: null,
                isLoaded: false,
                keys: [],
                values: [],
                selected: 0,
                fetchTime: null
            },
            review: {
                url: null,
                isLoaded: false,
                users: {
                    isLoaded: false,
                    rating: null,
                    reviews: []
                },
                admins: {
                    isLoaded: false,
                    rating: null,
                    reviews: []
                }
            }
        };
        this.ApiUrl = normalizeUrl(config.apiUrl + this.state.match.url, {stripAuthentication: false});
    }


    componentDidMount() {

        axios.get(this.ApiUrl)
            .then((res) => this.setState({isLoaded: true, server: res.data}, () => {

                const {stats} = this.state;
                stats.url = normalizeUrl(config.apiUrl + this.state.match.url + '/stats', {stripAuthentication: false});
                this.setState({stats: stats});
                this.fetchStats();

                const {review} = this.state;
                review.url = normalizeUrl(config.apiUrl + this.state.match.url + '/reviews', {stripAuthentication: false});
                this.setState({review: review});
                this.fetchReviews();
            }), (error) => this.setState({isLoaded: true, error}));

    }

    fetchReviews = () => {

        let {review} = this.state;

        axios.get(review.url)
            .then((res) => {
                review.admins = res.data.admins;
                review.users = res.data.users;
                this.setState({review: review}, () => {
                    review.users.isLoaded = true;
                    review.admins.isLoaded = true;
                    this.setState({review: review}, () => {
                        this.setState({review: {...this.state.review, isLoaded: true}});
                    })
                });
            });
    };

    fetchStats = () => {
        const {stats} = this.state;
        if (new Date(Date.now() - 60 * 1000) > stats.fetchTime) {
            axios.get(stats.url)
                .then((res) => {
                    const data = this.processStats(res.data);
                    this.setState({stats: {...this.state.stats, keys: Object.keys(data)}}, () => {
                        this.setState({stats: {...this.state.stats, values: Object.values(data)}}, () => {
                            this.setState({stats: {...this.state.stats, isLoaded: true, fetchTime: new Date()}})
                        });
                    });
                });
        }
    };

    processStats = (data) => {
        let _keys = Object.keys(data);
        let values = Object.values(data);

        let stats = [];

        _keys.map((key, id) => {
            if (values[id].length) {
                let name = null;
                if (key === 'PingStat') {
                    name = 'Ping';
                } else if (key === 'PlayersStat') {
                    name = 'Hráči'
                } else if (key === 'StatusStat') {
                    name = 'Status';
                }

                stats[id] = {title: name, key: key, items: values[id]};

                const currentHour = new Date().getHours();
                const statsFromCurrentHour = stats[id].items.filter(d =>
                    new Date(d.date).getHours() === currentHour
                );

                let filteredArray = [];

                const data = groupBy(statsFromCurrentHour, it => new Date(it.date).getUTCDate());

                data.forEach(key => {
                    filteredArray.push(
                        {
                            date: key[0].date,
                            avg: Math.round(key.reduce((prev, cur) => prev + cur.value, 0) / key.length),
                            max: Math.round(key.reduce((max, p) => p.value > max ? p.value : max, key[0].value)),
                        });
                });


                const maxOfDays = groupBy(stats[id].items, it => new Date(it.date).getDate());
                let maxDays = [];
                if (key !== 'StatusStat') {

                    maxOfDays.forEach(key => {

                        const stat = key.reduce((prev, current) => prev.value > current.value ? prev : current);
                        maxDays.push(
                            {
                                date: stat.date,
                                maxDay: stat.value
                            }
                        )
                    });
                    filteredArray = [...new Set([...filteredArray, ...maxDays])];
                    filteredArray.sort((a, b) => {
                        return new Date(a.date) - new Date(b.date);
                    });
                }


                stats[id]['filteredArray'] = filteredArray;
            }
        });

        return stats.filter(value => Object.keys(value).length);
    };

    changeStat(event, value) {
        this.fetchStats();
        this.setState({stats: {...this.state.stats, selected: parseInt(value)}});
    }

    renderGraph() {

        const {classes} = this.props;
        const {stats} = this.state;
        const {selected} = this.state.stats;
        if (stats.values[selected]) {
            const {filteredArray} = stats.values[selected];
            const data = filteredArray.map((item) => {
                return {
                    x: new Date(item.date).toLocaleDateString('cs-CZ', {hour: "2-digit", minute: "2-digit"}),
                    avg: item.avg,
                    max: item.max,
                    maxDay: item.maxDay
                }
            });

            return (
                <ResponsiveContainer width={"95%"} height={320}>
                    <LineChart data={data}>
                        <XAxis dataKey="x"/>
                        <YAxis/>
                        <CartesianGrid vertical={false} strokeDasharray="3 3"/>
                        <Tooltip/>
                        <Legend formatter={(value, entry) => (<span className={classes.white}>{value}</span>)}/>
                        <Line type="monotone" name={"Průměr"} dataKey="avg" connectNulls={true} stroke="#007bff"/>
                        <Line type="monotone" name={"Maximum"} dataKey="max" connectNulls={true} stroke="#dc3545"/>
                        <Line type="monotone" name={"Maximum daného dne"} className={classes.white} connectNulls={true}
                              dataKey="maxDay"
                              stroke="#008000"/>
                    </LineChart>
                </ResponsiveContainer>
            );
        }
    }

    renderStats() {
        const {classes} = this.props;
        const {stats} = this.state;

        let data = <Grid><CircularProgress className={classes.progress}/></Grid>;

        if (stats.isLoaded && stats.values.length !== 0) {
            data =
                <Paper className={classNames(classes.dark, classes.paper)}>
                    <Grid container justify={"center"}>
                        <Grid item xs={12}>
                            <Grid container justify={"flex-start"}>
                                <Grid item xs={12}>
                                    <Typography variant={"h4"} align={"center"} paragraph={true}
                                                className={classNames(classes.white, classes.paperHeader)}>
                                        Statistiky
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container justify={"center"}>
                                <Grid item xs={10}>
                                    <Typography className={classes.white} variant={"body1"} paragraph={true}>
                                        Statistiky jsou vyměřeny
                                        k {new Date().getHours()}:{new Date().getMinutes() < 10 ? "0" + new Date().getMinutes() : new Date().getMinutes()}.

                                        Z Vašeho aktuálního času se vypočtou průměrné a maximální hodnoty za
                                        posledních 14 dní.
                                    </Typography>
                                </Grid>
                                <Grid item xs={10}>
                                    <Tabs className={classes.white} style={{marginBottom: "1em"}}
                                          value={stats.selected}
                                          onChange={this.changeStat.bind(this)}>
                                        {
                                            stats.keys.map((key) => {
                                                    let keyTitle = stats.values[key]["title"];
                                                    if (stats.values[key].items.length > 0)
                                                        return (<Tab label={keyTitle} value={parseInt(key)}
                                                                     key={parseInt(key)}/>)
                                                }
                                            )
                                        }
                                    </Tabs>
                                </Grid>
                                <Grid item xs={12}>
                                    {this.renderGraph()}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>;
        }

        return (
            <Grid item xs={12} id={"#stats"}>
                {data}
            </Grid>
        )
    };

    generateSeo() {
        if (this.state.server) {
            return (
                <MetaTags>
                    <title>{this.state.server.name + config.titlePageName}</title>
                    <meta name="description" content={this.state.server.description}/>
                    <meta property="og:title" content={this.state.server.name}/>
                </MetaTags>
            )
        }
    }


    renderServerImage() {
        const {server} = this.state;
        if (server.imageUrl) {
            /*return (
                <Grid item xs={4}>
                <Image roundedCircle width={"400px"} src={server.imageUrl} title={server.title}/>
                </Grid>
            );*/
        }
    }


    renderPlayersBadge() {

        const {stats} = this.state.server;
        const {classes} = this.props;

        if (stats && stats.StatusStat && stats.StatusStat.value && stats.PlayersStat && stats.PlayersStat.value !== null && stats.PlayersStat.maxValue !== null) {
            let data = stats.PlayersStat.value + "/" + stats.PlayersStat.maxValue;
            return (
                <div className={classes.header}>
                    <SupervisorAccount/>
                    <Typography color={"inherit"}>
                        {data}
                    </Typography>
                </div>
            )
        }
    }

    renderStatusBadge() {

        const {classes} = this.props;

        if (this.state.server.stats && this.state.server.stats.StatusStat && this.state.server.stats.StatusStat) {
            const icon = this.state.server.stats.StatusStat.value ? <Visibility color={"inherit"}/> :
                <VisibilityOff color={"inherit"}/>;
            return (
                <div className={classes.header}>
                    {icon}
                    <Typography color={"inherit"}>
                        {this.state.server.stats.StatusStat.value ? "Online" : "Offline"}
                    </Typography>
                </div>
            );
        }
    }

    renderSocialBadges = () => {
        const {server} = this.state;
        const {classes} = this.props;
        const quote = "Bavím se na serveru: " + server.name + "! Připoj se taky! " + this.getIp();

        let data =
            <>
                <div className={classNames(classes.header, classes.clickable)}>
                    <FacebookShareButton url={window.location.href} quote={quote}>
                        <FacebookIcon size={48} round={true}/>
                    </FacebookShareButton>
                </div>
                <div className={classNames(classes.header, classes.clickable)}>
                    <TwitterShareButton url={window.location.href} title={quote}>
                        <TwitterIcon size={48} round={true}/>
                    </TwitterShareButton>
                </div>
            </>;


        return data;
    };

    getIp = () => {

        const {server} = this.state;

        return ((!server.show_port && server.domain && server.domain.length) ? server.domain : server.ip + ":" + server.port);
    };

    renderServerAddress() {

        const {classes} = this.props;

        const data =
            <div className={classes.header}>
                <AttachFile
                    onClick={this.clipAddress.bind(this)}
                    className={classes.clickable}
                />
                <Typography color={"inherit"}>
                    {this.getIp()}
                </Typography>
            </div>;
        return data;
    }

    renderDate = () => {
        let {server} = this.state;
        let {classes} = this.props;
        return (
            <div className={classes.header}>
                <DateRange color={"inherit"}/>
                <div style={{marginTop: "0.2em"}}>
                    {new Date(server.createdAt).toLocaleDateString('cs', {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit"
                    })}
                </div>
            </div>
        )
    };

    renderDescription = () => {
        const {classes} = this.props;
        let {server} = this.state;

        let data = false;
        if (server.description) {
            data =
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <Grid container justify={"center"} spacing={16}>
                            <Grid item xs={12}>
                                <Grid container justify={"flex-start"}>
                                    <Grid item xs={12}>
                                        <Typography align={"center"} variant={"h4"}
                                                    className={classNames(classes.white, classes.paperHeader)}>
                                            Popis serveru
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={10}>
                                <Grid container justify={"flex-start"}>
                                    <Typography className={classes.white} variant={"body1"}>
                                        {server.description}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>;
        }

        return data;
    };

    renderReview = (type) => {

        const {classes} = this.props;
        const {review} = this.state;

        let suffix = null;
        if (type === 'admins')
            suffix = "odborníků";
        else
            suffix = "uživatelů";

        return (review[type].rating) ?
            <>
                <Grid container justify={"center"}>
                    <Grid item xs={12}>
                        <Typography variant={"h4"}
                                    className={classNames(classes.white, classes.paperHeader)}>
                            Hodnocení {suffix}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} style={{height: "300px"}}>
                        <Circle
                            progress={Math.round(review[type].rating)}
                            roundedStroke={true}
                            showPercentageSymbol={true}
                            animate={true}
                            animationDuration="1s"
                            responsive={true}
                            textColor={"white"}
                        />
                    </Grid>
                </Grid>
            </>
            :
            null;
    };

    renderReviewLink = () => {

        const {classes} = this.props;

        return (
            <Link to={`${this.props.match.url}/review`} className={classes.headingLink}>
                <Button variant={"contained"} className={classes.headingButton} size={"large"}>
                    Ohodnotit
                </Button>
            </Link>
        )
    };

    renderReviewButton = () => {

        const {classes} = this.props;
        const {server} = this.state;

        return (
            <div className={classes.header} style={{marginTop: "5em"}}>
                <Typography variant={"h4"} className={classes.white}>
                    Tento server ještě nebyl hodnocen! <br/> Neváhejte a pojďte jej s námi ohodnotit!
                </Typography>
                {this.renderReviewLink()}
            </div>
        );
    };

    renderServerInfo = () => {
        let {classes} = this.props;
        const {review} = this.state;
        const {width} = this.props;

        return (
            <Grid item xs={12}>
                <Paper className={classes.paper}>
                    <Grid container justify={"center"} spacing={8}>
                        <Grid item
                              xs={((!review.admins.rating && !review.users.rating) || isWidthUp('md', width)) ? 3 : 6}>
                            {this.renderDate()}
                            {this.renderStatusBadge()}
                            {this.renderPlayersBadge()}
                            {this.renderServerAddress()}
                        </Grid>
                        {
                            isWidthUp('md', width) ?
                                review.isLoaded ?
                                    <Grid item xs={6}>
                                        {
                                            (!review.users.rating && !review.admins.rating)
                                                ?
                                                this.renderReviewButton()
                                                :
                                                <Grid container justify={"center"}>
                                                    <Grid item xs={review.users.rating ? 6 : 12}>
                                                        {this.renderReview("admins")}
                                                    </Grid>
                                                    <Grid item xs={review.admins.rating ? 6 : 12}>
                                                        {this.renderReview("users")}
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        {this.renderReviewLink()}
                                                    </Grid>
                                                </Grid>
                                        }
                                    </Grid> :
                                    <Grid item xs={6}>
                                        <CircularProgress className={classes.progress}/>
                                    </Grid>
                                :
                                null

                        }
                        <Grid item xs={isWidthUp('md', width) ? 3 : 6}>
                            <Grid container justify={"center"}>
                                <Grid item xs={6}>
                                </Grid>
                                <Grid item xs={6}>
                                    {this.renderSocialBadges()}
                                </Grid>
                            </Grid>
                        </Grid>
                        {
                            isWidthDown('sm', width) ?
                                review.isLoaded ?
                                    (!review.users.rating && !review.admins.rating)
                                        ?
                                        this.renderReviewButton()
                                        :
                                        <Grid item xs={12}>
                                            <Grid container justify={"center"}>
                                                <Grid item xs={isWidthUp('md', width) ? 6 : 12}>
                                                    {this.renderReview("admins")}
                                                </Grid>
                                                <Grid item xs={isWidthUp('md', width) ? 6 : 12}>
                                                    {this.renderReview("users")}
                                                </Grid>
                                                <Grid item xs={12}>
                                                    {this.renderReviewLink()}
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    :
                                    <Grid item xs={6}><CircularProgress className={classes.progress}/></Grid>
                                :
                                null
                        }
                    </Grid>
                </Paper>
            </Grid>
        );
    };

    renderServerTitle = () => {
        let {classes} = this.props;
        let {server} = this.state;

        return (
            <Grid item xs={12}>
                <Typography className={classNames(classes.white, classes.title)} variant={"h2"}>
                    {server.name}
                </Typography>
            </Grid>
        )
    };

    clipAddress = () => {
        var doc = document.createElement('textarea');
        doc.value = this.getIp();
        document.body.appendChild(doc);
        doc.select();
        document.execCommand("copy");
        document.body.removeChild(doc);
    };

    render() {

        const {error, isLoaded} = this.state;
        const {classes} = this.props;
        let data = null;
        if (error) {
            data = (<div>Error: {error.message}</div>);
        } else if (!isLoaded) {
            data = <Grid><CircularProgress className={classes.progress}/></Grid>;
        } else {
            data = (
                <>
                    {this.generateSeo()}
                    {this.renderServerTitle()}
                    {this.renderServerInfo()}
                    {this.renderServerImage()}
                    {this.renderDescription()}
                    {this.renderStats()}
                </>
            );
        }

        return (
            <Grid style={{marginTop: "1em"}} container justify={"center"}>
                <Grid item xs={12} sm={12} md={10}>
                    <Grid container spacing={0} justify={"center"}>
                        {data}
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

export default servers;
