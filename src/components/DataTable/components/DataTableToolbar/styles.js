import { makeStyles, lighten } from "@material-ui/core";

const useStyles = makeStyles(theme => {
  const getHighlightColor = props =>
    props.color === "primary"
      ? theme.palette.text.primary
      : theme.palette.secondary.main;

  return {
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1)
    },
    grow: {
      flexGrow: 1
    },
    highlight:
      theme.palette.type === "light"
        ? {
            color: props => getHighlightColor(props),
            backgroundColor: props =>
              props.color === "primary"
                ? lighten(theme.palette.primary.light, 0.85)
                : lighten(theme.palette.secondary.light, 0.85)
          }
        : {
            color: props => getHighlightColor(props),
            backgroundColor: props =>
              props.color === "primary"
                ? theme.palette.primary.dark
                : theme.palette.secondary.dark
          }
  };
});

export default useStyles;
