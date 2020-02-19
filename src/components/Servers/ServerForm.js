import React, {Component} from "react";
import {UserContext} from "../User";
import * as config from "../../config/config";
import {styles} from '../../config/styles';
import {MetaTags} from "react-meta-tags";
import axios from "axios";
import {
    Button,
    Checkbox,
    ExpansionPanel,
    ExpansionPanelDetails,
    FormControlLabel,
    FormGroup,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Typography
} from "@material-ui/core";
import {TextInput} from "../Form/TextInput";
import {Editor} from "@tinymce/tinymce-react";
import { Redirect } from "react-router-dom";


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
                show_port: 0
            },
            services: [],
            redirect: false,
            redirectUrl: null,

        };

        this.apiUrl = config.normalizeUrl(config.apiUrl, {stripAuthentication: false});
    }

    generateSeo() {

        return (
            <MetaTags>
                <title>{"Přidat server" + config.titlePageName}</title>
                <meta property="og:title" content={"Přidat server"}/>
            </MetaTags>
        )

    }


    onChange(event) {
        let server = {...this.state.server};
        let property = event.target.name;
        server[property] = event.target.value;
        this.setState({server});
    }

    handleEditorChange = (e) => {
        let server = {...this.state.server};
        server['description'] = e.target.getContent();
        this.setState({server});
    }

    handleCheckbox = (e) => {
        let property = e.target.name;
        let server = {...this.state.server};
        server[property] = e.target.checked ? 1 : 0;
        this.setState({server});
    }


    submitForm(e) {
        e.preventDefault();
        if (this.state.server.service !== "") {
            let url = config.normalizeUrl(this.apiUrl + "/services/" + this.state.server.service + "/servers/", {stripAuthentication: false});

            axios.post(url, {"login_token": this.context.user.actions.getRawToken(), "server": this.state.server})
                .then((res) => {
                    this.setState({
                        redirect: true,
                        redirectUrl: "/services/" + res.data.service_id + "/servers/" + res.data.id
                    }, () => (this.setState({redirect: true, redirectUrl: null})))
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
                                                    <TextInput name={"name"} required={true} label={"Název"}
                                                               autofocus={true} callback={this.onChange.bind(this)}/>
                                                </FormGroup>
                                                <FormGroup>
                                                    <TextInput name={"ip"} required={true} label={"IP adresa"}
                                                               autofocus={false} callback={this.onChange.bind(this)}/>
                                                    <TextInput name={"port"} required={true} label={"Port"}
                                                               autofocus={false} callback={this.onChange.bind(this)}/>
                                                </FormGroup>
                                                <FormGroup>
                                                    <TextInput name={"domain"} required={false} label={"Doména"}
                                                               autofocus={false} callback={this.onChange.bind(this)}/>
                                                </FormGroup>
                                                <FormGroup>
                                                    <Editor
                                                        name={"description"}
                                                        apiKey={"dc93bjdpya6u0rw7jpjm4xa9oqpd366qohvz0vjtveyjteqi"}
                                                        label={"Popis"}
                                                        init={{
                                                            height: 300,
                                                            language_url: config.baseApiUrl + 'cs.js',
                                                            menubar: false,
                                                            plugins: [
                                                                'advlist autolink lists link image charmap print preview anchor',
                                                                'searchreplace visualblocks code fullscreen',
                                                                'insertdatetime media table paste code help wordcount'
                                                            ],
                                                            toolbar:
                                                                'undo redo | formatselect | bold italic backcolor | \
                                                                alignleft aligncenter alignright alignjustify | \
                                                                bullist numlist outdent indent | removeformat | help'
                                                        }}
                                                        onChange={this.handleEditorChange}
                                                    />
                                                </FormGroup>
                                                <FormGroup>
                                                    <FormControlLabel
                                                        control={<Checkbox checked={!!this.state.server.show_port}
                                                                           name={"show_port"}
                                                                           onChange={this.handleCheckbox} value="0"/>}
                                                        label="Zobrazit port"
                                                    />
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
                {this.state.redirect && <Redirect to={this.state.redirectUrl}/>}
                {this.context.user.account ? this.renderForm() : <Redirect to={"/auth"}/>}
            </>
        )
    }

}