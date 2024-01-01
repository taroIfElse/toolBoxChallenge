import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import FileTable from "./components/FileTable";

const App = () => {
  return (
    <div className="container">
      <h1>File Information</h1>
      <FileTable />
    </div>
  );
};

export default App;
