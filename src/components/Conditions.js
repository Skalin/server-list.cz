import React, {Component} from 'react';
import {Grid, Paper, Typography} from "@material-ui/core";


export class Conditions extends Component {


    constructor(props) {
        super(props);

    }

    render() {
        return (
            <Grid container justify={"center"}>
                <Grid item xs={12} sm={10} md={8}>
                    <Paper>
                        <Typography variant={"h2"}>
                            Podmínky služby Server-List.cz
                        </Typography>
                        <Typography variant={"h3"}>
                            1. Poučení o službě Server-List.cz
                        </Typography>
                        <Typography component={"p"}>
                            Tato aplikace byla vytvořena pro účely bakalářské práce, blablabla.
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        )
    }
}