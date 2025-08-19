const express = require("express");
const sql = require("mssql");
const { BlobServiceClient } = require("@azure/storage-blob");

const app = express();
const port = process.env.PORT || 3000;

// Get connection strings from environment (you already set them in Azure WebApp)
const sqlConnStr = process.env.SqlConnectionString || "";
const storageConnStr = process.env.AzureStorageConnectionString || "";

// Root test
app.get("/", (req, res) => {
  res.send("🚀 Azure POC App is running!");
});

// SQL Test
app.get("/test-sql", async (req, res) => {
  try {
    let pool = await sql.connect(sqlConnStr);
    let result = await pool.request().query("SELECT GETDATE() as CurrentTime");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send("❌ SQL Error: " + err.message);
  }
});

// Storage Test
app.get("/test-storage", async (req, res) => {
  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(storageConnStr);
    const containers = blobServiceClient.listContainers();
    let containerList = [];
    for await (const container of containers) {
      containerList.push(container.name);
    }
    res.json({ containers: containerList });
  } catch (err) {
    res.status(500).send("❌ Storage Error: " + err.message);
  }
});

app.listen(port, () => {
  console.log(`✅ App listening at http://localhost:${port}`);
});
