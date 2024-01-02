import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table } from "react-bootstrap";

const FileTable = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/files/data");
        setFiles(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>File Name</th>
          <th>Text</th>
          <th>Number</th>
          <th>Hex</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(files).map(([fileName, fileData]) =>
          fileData.map((data, index) => (
            <tr key={`${fileName}-${index}`}>
              <td>{data.file}</td>
              <td>{data.text}</td>
              <td>{data.number}</td>
              <td>{data.hex}</td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );
};

export default FileTable;
