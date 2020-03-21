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
import {Redirect} from "react-router-dom";
import TextField from "@material-ui/core/es/TextField";


export class Update extends Component {
    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.serviceId = parseInt(props.match.path.split("/")[2]);
        this.state = {
            server: {
                service: "",
                id: "",
                name: "",
                description: "",
                ip: "",
                port: "",
                domain: "",
                show_port: 0
            },
            redirect: false,
            redirectUrl: null,

        };

        this.apiUrl = config.normalizeUrl(config.apiUrl, {stripAuthentication: false});
    }

    generateSeo() {

        return (
            <MetaTags>
                <title>{"Upravit server" + config.titlePageName}</title>
                <meta property="og:title" content={"Upravit server"}/>
            </MetaTags>
        )

    }

    componentDidMount() {

        axios.get(this.apiUrl + "/services/" + this.serviceId + "/servers/" + this.props.match.params.serverId)
            .then((res) => {
                    this.setState({server: res.data}, () => {
                        if (this.state.server.service_id !== this.serviceId) {
                            this.setState({redirect: true, redirectUrl: "/account"})
                        }


                    });
                }
            );
    }

    onChange(event) {
        let server = {...this.state.server};
        let property = event.target.name;
        console.log(event.target.value);
        server[property] = event.target.value;
        this.setState({server}, () => {console.log(this.state.server[property])});
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
            let url = config.normalizeUrl(this.apiUrl + "/services/" + this.serviceId + "/servers/" + this.state.server.id, {stripAuthentication: false});

            axios.put(url, {"login_token": this.context.user.actions.getRawToken(), "server": this.state.server})
                .then((res) => {
                    this.setState({
                        redirect: true,
                        redirectUrl: "/services/" + res.data.service_id + "/servers/" + res.data.id
                    }, () => (this.setState({redirect: true, redirectUrl: null})))
                })
                .catch();
        }
    }


    renderForm = () => {
        return (
            <>
                <Grid container justify={"center"} style={{marginTop: '25px'}}>
                    {this.generateSeo()}
                    <Grid item xs={10}>
                        <Grid container justify={"center"} spacing={16}>
                            <Grid item xs={12}>
                                <Typography style={{color: "white"}} variant={"h3"}>Upravit server</Typography>
                            </Grid>
                            <Grid item xs={8} sm={6}>
                                <ExpansionPanel expanded={true} xs={6}>
                                    <ExpansionPanelDetails xs={6}>
                                        <Grid container justify={"center"} spacing={16}>
                                            {console.log(this.state)}
                                            <form onSubmit={this.submitForm.bind(this)} style={{marginTop: '25px'}}>
                                                <FormGroup>

                                                    <TextField name={"name"} required
                                                               label={"Název"} autoFocus={true}
                                                               onChange={this.onChange.bind(this)} value={this.state.server.name}/>

                                                </FormGroup>
                                                <FormGroup>

                                                    <TextField name={"ip"} required
                                                               label={"IP Adresa"}
                                                               onChange={this.onChange.bind(this)} value={this.state.server.ip}/>

                                                    <TextField name={"port"} required
                                                               label={"Port"}
                                                               onChange={this.onChange.bind(this)} value={this.state.server.port}/>

                                                </FormGroup>
                                                <FormGroup>
                                                    <TextField name={"domain"} required={false} label={"Doména"}
                                                               value={this.state.server.domain}
                                                               onChange={this.onChange.bind(this)}/>
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
                                                        value={this.state.server.description}
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
                                                        Upravit
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