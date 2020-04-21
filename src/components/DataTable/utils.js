export const createUUID = () => {
  var dt = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(
    c
  ) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
};

const ascendingComparator = (a, b, orderBy) => {
  if (a[orderBy] > b[orderBy]) {
    return 1;
  }
  if (a[orderBy] < b[orderBy]) {
    return -1;
  }
  return 0;
};

export const getComparator = (orderDirection, orderBy, customComparator) => {
  const comparator = () => (a, b, orderBy) =>
    typeof customComparator === "function"
      ? customComparator(a, b)
      : ascendingComparator(a, b, orderBy);
  return orderDirection === "asc"
    ? (a, b) => comparator()(a, b, orderBy)
    : (a, b) => -comparator()(a, b, orderBy);
};

export const stableSort = (array, comparator) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
};
