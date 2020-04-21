import React, { useCallback, useMemo, useState } from "react";
import Table from "./components/DataTable";
import DeleteIcon from "@material-ui/icons/Delete";
import ArchiveIcon from "@material-ui/icons/Archive";

const cellStyle = {
  /* minWidth: 170 */
};
const codeCellStyle = {
  /* minWidth: 100 */
};

const columns = [
  {
    id: "name",
    label: "Name",
    cellStyle,
    format: rowData => `${rowData.lastName}, ${rowData.name}`,
    defaultSort: "asc",

    customSort: (a, b) => {
      const aValue = `${a.lastName}, ${a.name}`;
      const bValue = `${b.lastName}, ${b.name}`;
      return aValue.localeCompare(bValue);
    }
  },
  {
    id: "code",
    label: "ISO\u00a0Code",
    cellStyle: codeCellStyle,
    disableSorting: true
  },
  {
    id: "population",
    label: "Population",
    cellStyle,
    isNumeric: true,
    format: rowData => rowData.population.toLocaleString()
  },
  {
    id: "size",
    label: "Size\u00a0(km\u00b2)",
    cellStyle,
    isNumeric: true,
    format: rowData => rowData.size.toLocaleString()
  },
  {
    id: "density",
    label: "Density",
    cellStyle,
    isNumeric: true,
    format: rowData => rowData.density.toFixed(2)
  }
];

function createData(name, code, population, size, lastName) {
  const density = population / size;
  return { name, code, population, size, density, lastName };
}

const initialData = [
  createData("India", "IN", 1324171354, 3287263, "R"),
  createData("China", "CN", 1403500365, 9596961, "X"),
  createData("Italy", "IT", 60483973, 301340, "R"),
  createData("United States", "US", 327167434, 9833520, "F"),
  createData("Canada", "CA", 37602103, 9984670, "X"),
  createData("Australia", "AU", 25475400, 7692024, "Z"),
  createData("Germany", "DE", 83019200, 357578, "T"),
  createData("Ireland", "IE", 4857000, 70273, "R"),
  createData("Mexico", "MX", 126577691, 1972550, "N"),
  createData("Japan", "JP", 126317000, 377973, "Q"),
  createData("France", "FR", 67022000, 640679, "U"),
  createData("United Kingdom", "GB", 67545757, 242495, "F"),
  createData("Russia", "RU", 146793744, 17098246, "I"),
  createData("Nigeria", "NG", 200962417, 923768, "M"),
  createData("Brazil", "BR", 210147125, 8515767, "Y")
];

const renderDetailPanel = row => (
  <div style={{ paddingLeft: 52 }}>{row.name}</div>
);

export default function App() {
  const [data, setData] = useState(initialData);
  const [selectedRows, setSelectedRows] = useState([]);
  const options = useMemo(
    () => ({
      selection: true,
      selectionProps: {
        color: "primary",
        setDisabled: rowData => rowData.code === "US",
        actions: [
          {
            label: "Delete",
            icon: <DeleteIcon />,
            onClick: rows => {
              setData(prevState =>
                prevState.filter(datum => {
                  return !rows.some(row => row.code === datum.code);
                })
              );
            }
          },
          {
            label: "Archive",
            icon: <ArchiveIcon />,
            onClick: rows => {
              console.log("Archive these: ", rows);
            }
          }
        ]
      },
      sorting: true,
      // stickyHeader: true,
      // maxHeight: 200,
      showEmptyRows: true,
      // showToolbar: false,
      dense: true,
      paging: true
    }),
    []
  );

  const handleSelectionChange = useCallback(rows => setSelectedRows(rows), []);

  return (
    <div className="App">
      <Table
        columns={columns}
        data={data}
        primaryKey="code"
        options={options}
        onSelectionChange={handleSelectionChange}
        renderDetailPanel={renderDetailPanel}
        title="Countries"
      />
    </div>
  );
}
