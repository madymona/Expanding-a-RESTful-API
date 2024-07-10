const express = require("express");
const bodyParser = require("body-parser");
const users = require("./routes/users");
const posts = require("./routes/posts");
const comments = require("./routes/comments");
const error = require("./utilities/error");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

app.use((req, res, next) => {
  const time = new Date();
  console.log(`-----\n${time.toLocaleTimeString()}: Received a ${req.method} request to ${req.url}.`);
  if (Object.keys(req.body).length > 0) {
    console.log("Containing the data:");
    console.log(`${JSON.stringify(req.body)}`);
  }
  next();
});

const apiKeys = ["perscholas", "ps-example", "hJAsknw-L198sAJD-l3kasx"];
app.use("/api", (req, res, next) => {
  const key = req.query["api-key"];
  if (!key) next(error(400, "API Key Required"));
  if (apiKeys.indexOf(key) === -1) next(error(401, "Invalid API Key"));
  req.key = key;
  next();
});

app.use("/api/users", users);
app.use("/api/posts", posts);
app.use("/api/comments", comments);

app.get("/", (req, res) => {
  res.json({
    links: [
      { href: "/api", rel: "api", type: "GET" },
    ],
  });
});

app.get("/api", (req, res) => {
  res.json({
    links: [
      { href: "api/users", rel: "users", type: "GET" },
      { href: "api/users", rel: "users", type: "POST" },
      { href: "api/posts", rel: "posts", type: "GET" },
      { href: "api/posts", rel: "posts", type: "POST" },
      { href: "api/comments", rel: "comments", type: "GET" },
      { href: "api/comments", rel: "comments", type: "POST" },
    ],
  });
});

app.use((req, res, next) => {
  next(error(404, "Resource Not Found"));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ error: err.message });
});

app.listen(port, () => {
  console.log(`Server listening on port: ${port}.`);
});
