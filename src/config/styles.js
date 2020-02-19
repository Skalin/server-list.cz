import React from "react";

export const styles = theme => ({
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
        //marginLeft: "1em",
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
