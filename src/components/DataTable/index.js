import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow
} from "@material-ui/core";
import PropTypes from "prop-types";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import DataTableHead from "./components/DataTableHead";
import DataTableRow from "./components/DataTableRow";
import DataTableToolbar from "./components/DataTableToolbar";
import {
  columnsType,
  MAPPED_ID_KEY,
  optionsDefaultProps,
  optionsType
} from "./types";
import { createUUID, getComparator, stableSort } from "./utils";

const getRows = (allRows, sorting, paging, sortingOptions, pagingOptions) => {
  if (!sorting && !paging) return allRows;

  const { orderDirection, orderBy, customSort } = sortingOptions;
  const { page, rowsPerPage } = pagingOptions;

  const rows = sorting
    ? stableSort(allRows, getComparator(orderDirection, orderBy, customSort))
    : allRows;

  return paging
    ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : rows;
};

const getInitialSortingOptionsState = (sorting, columns) => {
  const obj = { orderBy: "", orderDirection: "asc", customSort: undefined };
  if (!sorting) return obj;
  const defaultSortColumn = columns.find(column => column.defaultSort);
  if (defaultSortColumn) {
    obj.orderBy = defaultSortColumn.id;
    obj.orderDirection = defaultSortColumn.defaultSort;
    obj.customSort =
      typeof defaultSortColumn.customSort === "function"
        ? defaultSortColumn.customSort
        : undefined;
  }
  return obj;
};

const DataTable = ({
  data,
  columns,
  primaryKey,
  options,
  onSelectionChange,
  renderDetailPanel,
  title
}) => {
  const mergedOptions = useMemo(
    () => ({
      ...DataTable.defaultProps.options,
      ...options,
      selectionProps: {
        ...DataTable.defaultProps.options.selectionProps,
        ...options.selectionProps
      }
    }),
    [options]
  );
  const {
    dense,
    minHeight,
    maxHeight,
    paging,
    rowsPerPage,
    rowsPerPageOptions,
    selection,
    selectionProps,
    showEmptyRows,
    showToolbar,
    sorting,
    stickyHeader
  } = mergedOptions;

  const hasData = Array.isArray(data) && data.length;
  const { setDisabled: setRowDisabled } = selectionProps;

  const allRowsMapped = useMemo(() => {
    return primaryKey !== MAPPED_ID_KEY ||
      (hasData && Object.hasOwnProperty.call(data[0], MAPPED_ID_KEY))
      ? data
      : data.map(row => ({ ...row, [MAPPED_ID_KEY]: createUUID() }));
  }, [primaryKey, hasData, data]);

  const allSelectableRows = useMemo(() => {
    return setRowDisabled
      ? allRowsMapped.filter(row => !setRowDisabled(row))
      : allRowsMapped;
  }, [allRowsMapped, setRowDisabled]);

  const [sortingOptions, setSortingOptions] = useState(
    getInitialSortingOptionsState(sorting, columns)
  );

  const [pagingOptions, setPagingOptions] = useState({
    page: 0,
    rowsPerPage,
    rowsPerPageOptions
  });

  const [selectedRows, setSelectedRows] = useState([]);

  const containerStyle = useMemo(
    () => ({
      minHeight,
      maxHeight
    }),
    [minHeight, maxHeight]
  );

  const hasDetailPanel = typeof renderDetailPanel !== "undefined";
  const colSpan =
    columns.length + (hasDetailPanel ? 1 : 0) + (selection ? 1 : 0);

  const renderableRows = hasData
    ? getRows(allRowsMapped, sorting, paging, sortingOptions, pagingOptions)
    : [];

  const emptyRows =
    hasData &&
    paging &&
    showEmptyRows &&
    renderableRows.length < allRowsMapped.length
      ? pagingOptions.rowsPerPage -
        Math.min(
          pagingOptions.rowsPerPage,
          allRowsMapped.length - pagingOptions.page * pagingOptions.rowsPerPage
        )
      : 0;

  const emptyTableRowStyles = useMemo(
    () => ({ height: (dense ? 32 : 53) * emptyRows }),
    [dense, emptyRows]
  );

  const handleSort = (id, customSort) => {
    const isAsc =
      sortingOptions.orderBy === id && sortingOptions.orderDirection === "asc";
    setSortingOptions(prevState => ({
      ...prevState,
      orderBy: id,
      orderDirection: isAsc ? "desc" : "asc",
      customSort
    }));
  };

  const handleChangePage = (_, newPage) => {
    setPagingOptions(prevState => ({
      ...prevState,
      page: newPage
    }));
  };

  const handleChangeRowsPerPage = event => {
    setPagingOptions(prevState => ({
      ...prevState,
      page: 0,
      rowsPerPage: parseInt(event.target.value, 10)
    }));
  };

  const handleSelectAllClick = event => {
    let newSelected = event.target.checked ? [...allSelectableRows] : [];
    setSelectedRows(newSelected);
    if (typeof onSelectionChange === "function") onSelectionChange(newSelected);
  };

  const handleSelectClick = useCallback(
    id => () => {
      const selectedIndex = selectedRows.findIndex(
        row => row[primaryKey] === id
      );
      let newSelected = [];

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(
          selectedRows,
          allSelectableRows.find(row => row[primaryKey] === id)
        );
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selectedRows.slice(1));
      } else if (selectedIndex === selectedRows.length - 1) {
        newSelected = newSelected.concat(selectedRows.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selectedRows.slice(0, selectedIndex),
          selectedRows.slice(selectedIndex + 1)
        );
      }
      setSelectedRows(newSelected);
      if (typeof onSelectionChange === "function")
        onSelectionChange(newSelected);
    },
    [allSelectableRows, onSelectionChange, primaryKey, selectedRows]
  );

  const selectClickHandler = useMemo(() => {
    return selection ? handleSelectClick : undefined;
  }, [selection, handleSelectClick]);

  useEffect(() => {
    setSelectedRows([]);
  }, [data]);

  return (
    <div>
      {showToolbar && (
        <DataTableToolbar
          selectedRows={selectedRows}
          color={selectionProps.color}
          title={title}
          actions={selectionProps.actions}
        />
      )}
      <TableContainer style={containerStyle}>
        <Table size={dense ? "small" : "medium"} stickyHeader={stickyHeader}>
          <DataTableHead
            addDetailColumn={hasDetailPanel}
            addCheckboxColumn={selection}
            columns={columns}
            numSelected={selectedRows.length}
            onSelectAllClick={handleSelectAllClick}
            onSort={handleSort}
            orderBy={sortingOptions.orderBy}
            orderDirection={sortingOptions.orderDirection}
            rowCount={hasData ? allSelectableRows.length : 0}
            sorting={sorting}
            selectionProps={selectionProps}
          />
          <TableBody>
            {hasData ? (
              renderableRows.map(row => (
                <DataTableRow
                  key={row[primaryKey]}
                  primaryKey={primaryKey}
                  columns={columns}
                  row={row}
                  renderDetailPanel={renderDetailPanel}
                  selectedRows={selectedRows}
                  selectionProps={selectionProps}
                  onSelectClick={selectClickHandler}
                />
              ))
            ) : (
              <TableRow>
                <TableCell align="center" colSpan={colSpan}>
                  No rows to display
                </TableCell>
              </TableRow>
            )}
            {emptyRows > 0 && (
              <TableRow style={emptyTableRowStyles}>
                <TableCell colSpan={colSpan} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {paging && (
        <TablePagination
          rowsPerPageOptions={pagingOptions.rowsPerPageOptions}
          component="div"
          count={hasData ? allRowsMapped.length : 0}
          rowsPerPage={pagingOptions.rowsPerPage}
          page={pagingOptions.page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      )}
    </div>
  );
};

DataTable.propTypes = {
  columns: columnsType,
  data: PropTypes.arrayOf(PropTypes.shape({})),
  onSelectionChange: PropTypes.func,
  options: optionsType,
  primaryKey: PropTypes.string,
  renderDetailPanel: PropTypes.func,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
};

DataTable.defaultProps = {
  data: undefined,
  onSelectionChange: undefined,
  options: optionsDefaultProps,
  primaryKey: MAPPED_ID_KEY,
  renderDetailPanel: undefined,
  title: undefined
};

export default DataTable;
