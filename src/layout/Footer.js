import  React from 'react';
import '../App.css'
import {Link} from 'react-router-dom';
import {Grid} from '@material-ui/core';


const styles = {
    link: {
        color: "white",
    }
};

function Footer() {

    return (
        <Grid container justify={"center"} alignItems={"center"} alignContent={"center"}>
            <Grid item xs={12}>
                    <Link style={styles.link} to="/conditions">Podmínky</Link>
            </Grid>
        </Grid>
    )
}
export default Footer;