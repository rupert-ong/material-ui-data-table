import React from "react";
import PropTypes from "prop-types";
import { Typography, Toolbar, Tooltip, IconButton } from "@material-ui/core";
import useStyles from "./styles";
import clsx from "clsx";
import { selectionPropsActionsPropType } from "../../types";

const renderActions = (actions, selectedRows) => {
  const handleClick = (handler, args) => () => handler(args);
  return (
    <>
      {actions.map(action => {
        const { label, icon, onClick } = action;
        return (
          <Tooltip title={label} key={label}>
            <IconButton
              aria-label={label.toLowerCase()}
              onClick={handleClick(onClick, selectedRows)}
            >
              {icon}
            </IconButton>
          </Tooltip>
        );
      })}
    </>
  );
};

const DataTableToolbar = ({ title, color, selectedRows, actions }) => {
  const classes = useStyles({ color });

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: selectedRows.length > 0
      })}
    >
      {selectedRows.length > 0 ? (
        <Typography color="inherit" variant="subtitle1" component="div">
          {selectedRows.length} selected
        </Typography>
      ) : (
        <Typography variant="h6">{title}</Typography>
      )}
      <div className={classes.grow} />
      {selectedRows.length > 0 &&
        actions.length > 0 &&
        renderActions(actions, selectedRows)}
    </Toolbar>
  );
};

export default DataTableToolbar;

DataTableToolbar.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary"]),
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  selectedRows: PropTypes.arrayOf(PropTypes.shape({})),
  actions: selectionPropsActionsPropType
};

DataTableToolbar.defaultProps = {
  color: "secondary",
  title: undefined,
  selectedRows: [],
  actions: []
};
