import PropTypes from "prop-types";

const {
  arrayOf,
  bool,
  func,
  node,
  number,
  oneOf,
  oneOfType,
  shape,
  string
} = PropTypes;

export const columnsType = arrayOf(
  shape({
    id: string.isRequired,
    label: oneOfType([string, node]).isRequired,
    isNumeric: bool,
    padding: oneOf(["checkbox", "default", "none"]),
    cellStyle: shape({}),
    format: func,
    disableSorting: bool,
    defaultSort: oneOf(["asc", "desc"])
  })
);

export const MAPPED_ID_KEY = "_dataTableId";

export const selectionPropsActionsPropType = arrayOf(
  shape({
    label: string.isRequired,
    icon: node.isRequired,
    onClick: func.isRequired
  })
);

export const selectionPropsType = shape({
  color: oneOf(["primary", "secondary"]),
  setDisabled: func,
  actions: selectionPropsActionsPropType
});

export const selectionPropsDefaultProps = {
  color: "secondary",
  setDisabled: undefined,
  actions: undefined
};

export const optionsType = shape({
  dense: bool,
  minHeight: oneOfType([number, string]),
  maxHeight: oneOfType([number, string]),
  paging: bool,
  rowsPerPage: number,
  rowsPerPageOptions: arrayOf(number),
  selection: bool,
  selectionProps: selectionPropsType,
  showEmptyRows: bool,
  showToolbar: bool,
  sorting: bool,
  stickyHeader: bool
});

export const optionsDefaultProps = {
  dense: false,
  minHeight: undefined,
  maxHeight: undefined,
  paging: false,
  rowsPerPage: 10,
  rowsPerPageOptions: [10, 25, 50, 100],
  selection: false,
  selectionProps: selectionPropsDefaultProps,
  showEmptyRows: false,
  showToolbar: true,
  sorting: false,
  stickyHeader: false
};
