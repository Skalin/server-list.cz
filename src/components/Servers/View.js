import React, {Component} from "react";
import * as config from "../../config/config";
import axios from "axios";
import {Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import LineChart from "recharts/lib/chart/LineChart";
import CartesianGrid from "recharts/lib/cartesian/CartesianGrid";
import Line from "recharts/lib/cartesian/Line";
import {Button, CircularProgress, Grid, Paper, Tab, Tabs, Typography} from "@material-ui/core";
import classNames from "classnames";
import {MetaTags} from "react-meta-tags";
import {AttachFile, DateRange, SupervisorAccount, Visibility, VisibilityOff} from "@material-ui/icons";
import {FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton} from "react-share";
import Parser from "html-react-parser";
import {Circle} from "react-circle";
import {Link} from "react-router-dom";
import {isWidthUp} from "@material-ui/core/withWidth";
import {isWidthDown} from "@material-ui/core/es/withWidth";


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

export class View extends Component {

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
        this.ApiUrl = config.normalizeUrl(config.apiUrl + this.state.match.url, {stripAuthentication: false});
    }


    componentDidMount() {

        axios.get(this.ApiUrl)
            .then((res) => this.setState({isLoaded: true, server: res.data}, () => {

                const {stats} = this.state;
                stats.url = config.normalizeUrl(config.apiUrl + this.state.match.url + '/stats', {stripAuthentication: false});
                this.setState({stats: stats});
                this.fetchStats();

                const {review} = this.state;
                review.url = config.normalizeUrl(config.apiUrl + this.state.match.url + '/reviews', {stripAuthentication: false});
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

        if (stats.isLoaded && stats.values.length === 0) {
            data = "";
        } else if (stats.isLoaded && stats.values.length !== 0) {
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
                                <Grid container justify={"center"}>
                                    <Grid item xs={12}>
                                        <Typography align={"center"} variant={"h4"}
                                                    className={classNames(classes.white, classes.paperHeader)}>
                                            Popis serveru
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={10}>
                                <Grid container justify={"center"} className={classes.white} alignItems={"center"}>
                                    {Parser(server.description)}
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