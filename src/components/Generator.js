import {Component} from "react";
import {UserContext} from "./User";
import {Redirect} from "react-router-dom";
import axios from "axios";
import * as config from "../config/config";
import {MetaTags} from "react-meta-tags";
import {Button, FormGroup, Grid, Typography} from "@material-ui/core";
import {ExpansionPanel, ExpansionPanelDetails, InputLabel, MenuItem, Select} from "@material-ui/core";
import React from "react";

const styles = theme => ({
    headingButton: {
        backgroundColor: "rgba(0, 120, 255, 1)",
        color: 'white',
        margin: "1em",
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

export default class ServerWidgetGenerator extends Component {
    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = {
            servers: [],
            languages: [/*'JavaScript', */'PHP'],
            generator: {
                language: "",
                server: "",
            }
        };
    }

    componentDidMount() {

        axios.post(config.apiUserUrl + '/servers', {login_token: this.context.user.actions.getRawToken()})
            .then((res) => {
                this.setState({servers: res.data})
            });
    }

    generateSeo() {
        if (this.state.server) {
            return (
                <MetaTags>
                    <title>{"Vygenerovat status widget" + config.titlePageName}</title>
                    <meta name="description" content={this.state.server.description}/>
                    <meta property="og:title" content={this.state.server.name}/>
                </MetaTags>
            )
        }
    }


    onChange(formData) {
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
                    <Grid item xs={10}>
                        <Grid container justify={"center"} spacing={16}>
                            <Grid item xs={12}>
                                <Typography color={"inherit"} variant={"h3"}>Generátor widgetů</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <ExpansionPanel expanded={true} xs={6}>
                                    <ExpansionPanelDetails xs={6}>
                                        <Grid container justify={"center"} spacing={16}>
                                            <Grid item>
                                                <form style={{marginTop: '25px'}}
                                                      onSubmit={this.generateWidgetFile.bind(this)}>
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
                                                                this.state.servers.map((server) => (
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
                                                                this.state.languages.map((key, value) => (
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
                                                    <FormGroup>
                                                        {this.renderWidget()}
                                                    </FormGroup>
                                                </form>
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
    };


    generateWidgetFile = (e) => {

        e.preventDefault();
        let data = null;
        let extension = null;

        if (this.state.languages[this.state.generator.language] === 'PHP') {
            extension = 'php';
            data =
                `<?php

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

            $url = "https://api.server-list.cz/v1/services/` + this.state.generator.server.service_id + `/servers/` + this.state.generator.server.id + `";
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
                <div style=\\"box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2); transition: 0.3s;\\">
                    <div style=\\"padding: 2px 16px;\\">
                        <h4><b>{$this->name}</b></h4>
                        <p>IP: {$this->address}</p>
                        <p>Status: {$this->status}</p>
                        <?php if (!$this->status): ?>
                            <p>Počet hráčů: {$this->players}</p>
                            <p>Ping: {$this->ping}</p>
                        <?php endif;>
                    </div>
                    <div style=\\"padding: 2px 16px; font-size: x-small\\">
                        Zajištěno službou <a href=\\"https://server-list.cz\\">Server-List</a>
                    </div>
                </div>
            ";
        }
    }

    $widget = new Widget;
    echo $widget->render();

    ?>
                    `;


        } else if (this.state.languages[this.state.generator.language] === 'JavaScript') {
            extension = 'js';
        }

        const file = new Blob([data], {type: 'text/plain'});
        let fileURL = window.URL.createObjectURL(file);
        let link = document.createElement('a');
        link.href = fileURL;
        link.setAttribute('download', "Widget." + extension);
        link.click();
    };


    renderWidget = () => {
        if (this.state.generator.server !== "" && this.state.generator.language !== "") {
            var data = (<Button style={styles.headingButton} type={"submit"}>Stáhnout</Button>);

            return (
                data
            )
        }
    };

    render() {
        return (
            <>
                {this.context.user.account ? this.renderForm() : <Redirect to={"/auth"}/>}
            </>
        )
    }
}
