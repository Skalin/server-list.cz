import React, {Component} from 'react';
import {Grid, Paper, Typography} from "@material-ui/core";


export class Conditions extends Component {


    constructor(props) {
        super(props);

    }

    render() {
        return (
            <Grid container justify={"center"} spacing={0}>
                <Grid item xs={12}>
                    <Typography variant={"h2"} style={{color: "white", margin: "1em"}}>
                        Podmínky služby Server-List.cz
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={10} md={8}>
                    <Paper style={{paddingTop: "1em"}}>
                        <Typography variant={"h3"} style={{margin: "1em"}}>
                            1. Poučení o službě Server-List.cz
                        </Typography>
                        <Grid container justify={"center"}>
                            <Grid item xs={10}>
                                <Typography component={"p"} paragraph align={"left"}>
                                    Tato aplikace byla vytvořena pro účely bakalářské práce `Portál pro sledování stavu
                                    herních serverů` (v angl.: `Game Server Status Monitoring Portal`). Tuto práci
                                    vypracoval student bakalářského studia FIT VUT, Dominik Skála (xskala11).
                                    <br/>
                                    Jejím účelem je sledování nejen stavů, ale dalších informací o herních serverech v
                                    reálném čase za účelem využití moderních technologií. Využití webového rozhraní
                                    pomocí API, možnost přístupu k serverům pro registrátory a integrace do hostingových
                                    služeb.

                                </Typography>
                            </Grid>
                        </Grid>
                        <Typography variant={"h3"} style={{margin: "1em"}}>
                            2. Registrace
                        </Typography>
                        <Grid container justify={"center"}>
                            <Grid item xs={10}>
                                <Typography component={"p"} paragraph align={"left"}>

                                </Typography>
                            </Grid>
                        </Grid>
                        <Typography variant={"h3"} style={{margin: "1em"}}>
                            3. Zpracování osobních údajů
                        </Typography>
                        <Grid container justify={"center"}>
                            <Grid item xs={10}>
                                <Typography component={"p"} paragraph align={"left"}>

                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        )
    }
}