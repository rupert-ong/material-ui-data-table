import { makeStyles, lighten } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  expand: {
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    }),
    margin: 0,
    padding: 0
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  expandedCell: {
    borderBottom: "none"
  },
  row: {
    "&.Mui-selected, &.Mui-selected:hover": {
      backgroundColor: props =>
        props.selectionProps.color === "primary"
          ? lighten(theme.palette.primary.light, 0.85)
          : undefined
    }
  }
}));

export default useStyles;
