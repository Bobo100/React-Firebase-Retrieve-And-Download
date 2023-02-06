const admin = require("firebase-admin");

const serviceAccount = require("./lib/serviceAccountKey.json");

// 為了能夠輸出json檔案，需要引入fs
const fs = require("fs");

const cors = require("cors");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // ------------------------這邊複製專案設定中的內容(官方有提供)------------------------
  databaseURL: "https://{yourdatabase}.firebaseio.com",
});
const db = admin.firestore();

let collectionData;
db.listCollections().then((collections) => {
  collectionData = [];
  collections.forEach((collection) => {
    collectionData.push({ id: collection.id });
  });
  fs.writeFileSync(
    "./lib/collectionsName.json",
    JSON.stringify(collectionData, null, 2)
  );
  console.log("Collections data exported to collections.json");
});

const express = require("express");
const app = express();
app.use(cors());
app.use(express.static("lib"));
app.get("/collections", (req, res) => {
  res.json(collectionData);
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
