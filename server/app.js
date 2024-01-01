import express from "express";
import axios from "axios";

// API base URL and secret key
const baseUrl = "https://echo-serv.tbxnet.com/v1/secret";
const apiKey = "aSuperSecretKey";

// Create an Express application
const app = express();
const port = 8000;

// Enable CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Start the server
app.listen(port, () => {
  console.log(`The application is listening on port ${port}`);
});

// Default route
app.get("/", (req, res) => {
  res.send("Hello, world!");
});

// Route to get the list of files
app.get("/files/list", async (req, res) => {
  try {
    const files = await listFiles();
    res.json({ files });
  } catch (error) {
    console.error("Error retrieving the list of files:", error.message);
    res.status(500).json({ error: "Error retrieving the list of files." });
  }
});

// Route to get data from a file or all files
app.get("/files/data", async (req, res) => {
  try {
    const { fileName } = req.query;

    if (fileName) {
      const fileContent = await downloadFile(fileName);

      if (fileContent && fileContent.trim() !== "") {
        const parsedData = processCSVContent(fileContent, fileName);
        res.json(parsedData);
      } else {
        res.status(404).json({ error: `File ${fileName} not found.` });
      }
    } else {
      const files = await listFiles();
      const formattedFiles = {};

      for (const file of files) {
        const fileContent = await downloadFile(file);

        if (fileContent && fileContent.trim() !== "") {
          const parsedData = processCSVContent(fileContent, file);
          if (parsedData.length > 0) {
            formattedFiles[file] = parsedData;
            console.log(`File ${file} processed and stored.`);
          } else {
            console.log(
              `File ${file} discarded, it does not contain valid data.`
            );
          }
        }
      }

      res.json(formattedFiles);
    }
  } catch (error) {
    console.error("Error processing files:", error.message);
    res.status(500).json({ error: "Error processing files." });
  }
});

// Function to list files
const listFiles = async () => {
  try {
    const response = await axios.get(`${baseUrl}/files`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    return response.data.files || [];
  } catch (error) {
    console.error("Error listing files:", error.message);
    return [];
  }
};

// Function to download a file
const downloadFile = async (fileName) => {
  try {
    const response = await axios.get(`${baseUrl}/file/${fileName}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    const content = response.data && response.data.trim();
    return content || null;
  } catch (error) {
    console.error(`Error downloading file ${fileName}:`, error.message);
    return null;
  }
};

// Function to process CSV content
const processCSVContent = (content, fileName) => {
  const parsedData = [];

  const lines = content.split("\n");

  lines.forEach((line) => {
    const row = line.split(",");

    // Validate that the row has the correct amount of data and no empty fields
    if (row.length === 4 && row[1] && row[2] && row[3]) {
      const rowData = {
        file: fileName,
        text: row[1],
        number: row[2] !== "null" ? parseInt(row[2], 10) : undefined,
        hex: row[3],
      };

      // Discard the row if it has a specific format
      if (!(rowData.text === "text" && rowData.hex === "hex")) {
        parsedData.push(rowData);
      }
    }
  });

  return parsedData;
};
