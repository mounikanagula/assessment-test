const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const minisearch = require("minisearch");
let data = require("./data");
const app = express();
const hostname = "localhost";
const port = 3035;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

let index = new minisearch({
  fields: ["id", "name", "about", "price", "tags"],
  storeFields: ["name", "picture"],
  extractField: (document, fieldName) => {
    const value = fieldName
      .split(".")
      .reduce((doc, key) => doc && doc[key], document);
    return Array.isArray(value) ? value.join(" ") : value;
  },
});

data = JSON.parse(JSON.stringify(data).split('"_id":').join('"id":'));
index.addAll(data);

app.get("/", function (req, res) {
  res.send(`Server running on ${hostname}:${port}`);
});

app.post("/search", function (req, res) {
  let result = index.search(req.body.query, { prefix: true });
  res.send(result);
});

app.listen(port, function (err) {
  console.log("Application server is running on " + port + " port");
  if (err) {
    console.log(err);
  }
});
