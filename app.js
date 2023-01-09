const mysql = require("mysql");
const express = require("express");
const app = express();
const morgan = require("morgan");
const port = 3000;

const bodyParser = require("body-parser");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// const db = mysql.createConnection({
//   host: "db4free.net",
//   user: "omarmohey12",
//   password: "Mohey199",
//   database: "mayhem",
// });

const db = mysql.createConnection({
  host: "sql7.freesqldatabase.com",
  user: "sql7589365",
  password: "XkpzaYhw8A",
  database: "sql7589365",
});

//connect to database
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Connection done");
});
// rnd_MNRe6kjnEeHPQG8eorFxBzsv23D7

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  next();
});

// This adds the logger.
app.use(morgan(":method :url :status - :response-time ms"));

const server = require("http").createServer(app);

server.listen(port, () => {
  console.log("listening on *:3000");
});

//query to database
app.get("/players", (req, res) => {
  // sql query to show all tables in the database
  let sql = `SELECT * FROM player;`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send(results);
  });
});

// add player to database
app.post("/players", (req, res) => {
  let body = req.body;
  console.log(req.body);
  let sql = `INSERT INTO player (name, number, phone, major, email) VALUES ('${body.name}', '${body.number}', '${body.phone}', '${body.major}', '${body.email}');`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send(results);
  });
});

app.delete("/players/:name", (req, res) => {
  let name = req.params.name;
  console.log(name);
  let sql = `DELETE FROM player WHERE name = '${name}';`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send(results);
  });
});

app.get("/competition", (req, res) => {
  // sql query to show all tables in the database
  let sql = `SELECT * FROM category;`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send(results);
  });
});

app.post("/competition", (req, res) => {
  let body = req.body;
  let sql = `INSERT INTO category (name) VALUES ('${body.name}');`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send(results);
  });
});

app.get("/opponent", (req, res) => {
  // sql query to show all tables in the database
  let sql = `SELECT * FROM opponent;`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send(results);
  });
});

app.post("/opponent", (req, res) => {
  let body = req.body;
  let sql = `INSERT INTO opponent (name) VALUES ('${body.name}');`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send(results);
  });
});

app.post("/game", (req, res) => {
  let body = req.body;
  let sql = `INSERT INTO game (opponent, home, category) VALUES ('${body.opponent}', '${body.isHome}', '${body.category}');`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send(results);
  });
});

app.get("/game", (req, res) => {
  // sql query to show all tables in the database
  let sql = `SELECT * FROM game;`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send(results);
  });
});

// get the timestamp of the last inserted game
app.get("/gameT", (req, res) => {
  let category = req.query.category;
  let opponent = req.query.opponent;

  console.log(category);
  console.log(opponent);
  let sql = `SELECT timestamp FROM game 
  WHERE  category = '${category}' AND opponent = '${opponent}'
   ORDER BY timestamp DESC LIMIT 1;`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send(results);
  });
});

app.delete("/game/:opponent/:timestamp", (req, res) => {
  let opponent = req.params.opponent;
  let timestamp = req.params.timestamp;
  let sql = `DELETE FROM game WHERE opponent = '${opponent}' AND timestamp = '${timestamp}';`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send(results);
  });
});

//
app.put("/gameUpdateOffence", (req, res) => {
  let body = req.body;
  let timestamp = body.timestamp;
  let opponent = body.opponent;
  let newValue = body.newValue;
  let sql = `
  UPDATE game SET startOffence = ${
    newValue ? 1 : 0
  } WHERE timestamp = "${timestamp}" AND opponent = "${opponent}";
  `;
  console.log(sql);
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send(results);
  });
});

//delete actions from actionPerformed for specific game
app.delete("/gameActions/:opponent/:timestamp", (req, res) => {
  let opponent = req.params.opponent;
  let timestamp = req.params.timestamp;
  let sql = `DELETE FROM actionPerformed WHERE opponent = '${opponent}' AND gameTimestamp = '${timestamp}';`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send(results);
  });
});

app.post("/gameDetails", (req, res) => {
  let body = req.body;
  let sql = `INSERT INTO game (opponent, timestamp, myScore, theirScore, home, category, startOffence) VALUES ('${body.opponent}', '${body.timestamp}', '${body.myScore}', '${body.theirScore}', '${body.isHome}', '${body.category}', '${body.startOffence}');`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send(results);
  });
});

app.post("/gameActions", (req, res) => {
  let body = req.body;
  // console.log(body.values);
  let sql = `INSERT INTO actionPerformed (opponent, gameTimestamp, playerName, action, point, associatedPlayer, offence) VALUES ${body.values};`;
  // console.log("SQL", sql);

  let query = db.query(sql, [], (err, results) => {
    if (err) throw err;
    // console.log(results);
    res.send(results);
  });
});

app.get("/gameActions", (req, res) => {
  let opponent = req.query.opponent;
  let timestamp = req.query.timestamp;
  let sql = `SELECT * FROM actionPerformed WHERE opponent = '${opponent}' AND gameTimestamp = '${timestamp}';`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;

    console.log(results);
    res.send(results);
  });
});
