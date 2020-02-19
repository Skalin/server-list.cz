import React, {Component} from "react";
import {UserContext} from "../User";
import * as config from "../../config/config";
import axios from "axios";
import {Button, ExpansionPanel, ExpansionPanelDetails, FormGroup, Grid, Typography} from "@material-ui/core";
import {TextInput} from "../Form/TextInput";
import {Editor} from "@tinymce/tinymce-react";
import Slider from "@material-ui/lab/Slider";
import classNames from "classnames";

export class ServerReview extends Component {

    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = {
            apiUrl: config.normalizeUrl(config.apiUrl + "/" + this.props.match.url + "s", {stripAuthentication: false}),
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

    handleEditorChange = (e) => {
        let server = {...this.state.server};
        server['text'] = e.target.getContent();
        this.setState({server});
    }

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
                    <TextInput name={"title"} required={true} label={"Titulek"}
                               autofocus={true} callback={this.onChange.bind(this)} type={"text"}/>
                </FormGroup>
                <FormGroup style={{marginTop: "1em"}}>
                    <Editor
                        name={"text"}
                        apiKey={"dc93bjdpya6u0rw7jpjm4xa9oqpd366qohvz0vjtveyjteqi"}
                        label={"Obsah recenze"}
                        init={{
                            height: 200,
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
                <FormGroup style={{marginTop: "1em"}}>
                    <Typography id={"slider"} style={{color: "#777777", fontSize: "15px"}} align={"left"}>
                        Hodnocení
                    </Typography>
                    <Slider value={rating} min={0} max={100} step={5} color={"inherit"}
                            onChange={this.handleSlider} aria-labelledby={"slider"} style={{marginTop: "1em"}}
                    />
                    <Typography style={{color: "#777777", marginTop: "1em"}}>
                        {rating} %
                    </Typography>
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