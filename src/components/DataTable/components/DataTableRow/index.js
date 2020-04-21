import {
  Checkbox,
  Collapse,
  IconButton,
  TableCell,
  TableRow
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import clsx from "clsx";
import PropTypes from "prop-types";
import React, { useState } from "react";
import {
  columnsType,
  MAPPED_ID_KEY,
  optionsDefaultProps,
  optionsType,
  selectionPropsDefaultProps,
  selectionPropsType
} from "../../types";
import useStyles from "./styles";

const DETAIL_PANEL_STYLES = { marginTop: "none" };

const isSelected = (selectedRows, primaryKey, id) => {
  return selectedRows.findIndex(row => row[primaryKey] === id) !== -1;
};

const DataTableRow = ({
  columns,
  renderDetailPanel,
  row,
  onSelectClick,
  selectedRows,
  selectionProps,
  primaryKey
}) => {
  const classes = useStyles({ selectionProps });
  const [isExpanded, setIsExpanded] = useState(false);

  const expandClasses = clsx({
    [classes.expandOpen]: isExpanded
  });

  const hasDetailPanel = typeof renderDetailPanel !== "undefined";
  const hasCheckbox = typeof onSelectClick !== "undefined";
  const isRowSelected =
    hasCheckbox && isSelected(selectedRows, primaryKey, row[primaryKey]);
  const colSpan =
    columns.length + (hasDetailPanel ? 1 : 0) + (hasCheckbox ? 1 : 0);
  const { color, setDisabled } = selectionProps;

  const detailsComponent =
    isExpanded && hasDetailPanel ? (
      <TableRow
        selected={isRowSelected}
        className={classes.row}
        style={DETAIL_PANEL_STYLES}
      >
        <TableCell colSpan={colSpan}>
          <Collapse in={isExpanded} unmountOnExit={true}>
            {renderDetailPanel(row)}
          </Collapse>
        </TableCell>
      </TableRow>
    ) : null;

  const handleExpandClick = () => setIsExpanded(prevState => !prevState);

  return (
    <>
      <TableRow
        selected={isRowSelected}
        hover={hasCheckbox}
        color={color}
        className={classes.row}
      >
        {hasDetailPanel && (
          <TableCell
            className={clsx({ [classes.expandedCell]: isExpanded })}
            padding="checkbox"
          >
            <IconButton
              className={expandClasses}
              onClick={handleExpandClick}
              aria-expanded={isExpanded}
            >
              <ExpandMoreIcon />
            </IconButton>
          </TableCell>
        )}
        {hasCheckbox && (
          <TableCell
            padding="checkbox"
            className={clsx({ [classes.expandedCell]: isExpanded })}
          >
            <Checkbox
              onClick={onSelectClick(row[primaryKey])}
              checked={isRowSelected}
              color={color}
              disabled={setDisabled && setDisabled(row)}
            />
          </TableCell>
        )}
        {columns.map(column => {
          const { id, isNumeric, cellStyle, padding, format } = column;
          return (
            <TableCell
              key={id}
              align={isNumeric ? "right" : "left"}
              padding={padding ? padding : "default"}
              style={cellStyle}
              className={clsx({ [classes.expandedCell]: isExpanded })}
            >
              {typeof format === "function" ? format(row) : row[id]}
            </TableCell>
          );
        })}
      </TableRow>
      {hasDetailPanel && detailsComponent}
    </>
  );
};

DataTableRow.propTypes = {
  columns: columnsType.isRequired,
  renderDetailPanel: PropTypes.func,
  onSelectClick: PropTypes.func,
  selectedRows: PropTypes.arrayOf(PropTypes.shape({})),
  selectionProps: selectionPropsType,
  row: PropTypes.shape({}),
  primaryKey: PropTypes.string,
  options: optionsType
};

DataTableRow.defaultProps = {
  renderDetailPanel: undefined,
  onSelectClick: undefined,
  selectedRows: [],
  selectionProps: selectionPropsDefaultProps,
  primaryKey: MAPPED_ID_KEY,
  options: optionsDefaultProps
};

export default DataTableRow;
