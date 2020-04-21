import {
  Checkbox,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel
} from "@material-ui/core";
import PropTypes from "prop-types";
import React from "react";
import {
  columnsType,
  selectionPropsType,
  selectionPropsDefaultProps
} from "../../types";

const renderCellContent = (
  sorting,
  orderBy,
  orderDirection,
  id,
  label,
  onSort,
  customSort = undefined
) => {
  if (!sorting) return label;

  const handleClick = (id, customSort) => () => {
    if (typeof onSort === "function") onSort(id, customSort);
  };

  return (
    <TableSortLabel
      active={orderBy === id}
      direction={orderBy === id ? orderDirection : "asc"}
      onClick={handleClick(id, customSort)}
    >
      {label}
    </TableSortLabel>
  );
};

const DataTableHead = ({
  addDetailColumn,
  addCheckboxColumn,
  columns,
  numSelected,
  onSort,
  onSelectAllClick,
  orderBy,
  orderDirection,
  rowCount,
  selectionProps,
  sorting
}) => {
  const { color } = selectionProps;
  return (
    <TableHead>
      <TableRow>
        {addDetailColumn && <TableCell padding="checkbox" />}
        {addCheckboxColumn && (
          <TableCell padding="checkbox">
            <Checkbox
              color={color}
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
        )}
        {columns.map(column => {
          const {
            id,
            label,
            isNumeric,
            padding,
            cellStyle,
            disableSorting,
            customSort
          } = column;
          return (
            <TableCell
              key={id}
              align={isNumeric ? "right" : "left"}
              padding={padding ? padding : "default"}
              style={cellStyle}
            >
              {renderCellContent(
                sorting && !disableSorting,
                orderBy,
                orderDirection,
                id,
                label,
                onSort,
                customSort
              )}
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
};

DataTableHead.propTypes = {
  addDetailColumn: PropTypes.bool,
  addCheckboxColumn: PropTypes.bool,
  columns: columnsType.isRequired,
  onSelectAllClick: PropTypes.func,
  numSelected: PropTypes.number,
  onSort: PropTypes.func,
  orderBy: PropTypes.string,
  orderDirection: PropTypes.oneOf(["asc", "desc"]),
  rowCount: PropTypes.number,
  selectionProps: selectionPropsType,
  sorting: PropTypes.bool
};

DataTableHead.defaultProps = {
  addCheckboxColumn: false,
  addDetailColumn: false,
  onSelectAllClick: undefined,
  onSort: undefined,
  numSelected: 0,
  orderBy: "",
  orderDirection: "asc",
  rowCount: 0,
  selectionProps: selectionPropsDefaultProps,
  sorting: false
};

export default DataTableHead;
