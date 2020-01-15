// load .env data into process.env
require('dotenv').config();

// Web server config
const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const sass = require("node-sass-middleware");
const app = express();
const morgan = require('morgan');


// PG database client/connection setup
const { Pool } = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
const widgetsRoutes = require("./routes/widgets");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
app.use("/api/widgets", widgetsRoutes(db));
// Note: mount other resources here, using the same pattern above


// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/select_list", (req, res) => {

  res.render("select_list");
});
app.get("/edit_profile", (req, res) => {
  res.render("edit_profile");
});
app.get("/list", (req, res) => {
  res.render("list");
});


// send the list to list.ejs
app.get("/list/:listId", (req, res) => {
  let listId = req.params.listId;
  let query = {
    text: `SELECT a.item, a.description, date_trunc('day',a.date_added), a.list_id, a.id  ,b.name_list FROM items as a
    JOIN lists_type as b  on a.list_id = b.id
    WHERE a.date_completed is null and user_id = $1 and list_id = $2;`, values: [1, Number(listId)]
  };
  return db.query(query).then(data => {
    const lists = data.rows;

    res.render('list', { lists });
  });

});

//edit item
app.post("/item/:itemId", (req, res) => {
  let itemId = req.params.itemId;
  const { list_id } = req.body;

  let query = {
    text: `UPDATE items SET list_id=$1 WHERE id=$2 ;`, values: [list_id, itemId]
  };
  return db.query(query).then(data => {
    res.redirect('/list/' + list_id);
  });

});

//edit profile
app.post("/edit_profile/:userId", (req, res) => {
  let userId = req.params.userId;
  const { email, password, first_name, last_name, number } = req.body;
  console.log(req.body)
  let query = {
    text: `UPDATE  users SET email =$1 ,password=$2 ,first_name=$3 ,last_name=$4 ,phone_number=$5  WHERE id=$6 ;`,
    values: [email, password, first_name, last_name, Number(number), userId]
  };
  return db.query(query).then(dbRes => res.redirect('/'));
})
// function for testing the value
const sortItem = function (value) {
  let table = 0;
  if (value === "watch") {
    table = 1
  }
  else if (value === "read") {
    table = 2;
  }
  else if (value === "buy") {
    table = 4;
  }
  else if (value === "eat") {
    table = 3;
  }
  else {
    //call api
  }
  return table;

};
// add the item to the database and send 201 to jquery
app.post("/items", (req, res) => {
  console.log(req.body.comment);
  var comment = req.body.comment;
  var arr = comment.split(' ');
  var firstword = arr[0].toLowerCase();
  const table = sortItem(firstword);
  let query = {
    text: 'INSERT INTO items (user_id,list_id,item) VALUES ($1 ,$2 ,$3) RETURNING *;',
    values: [1, table, comment]
  };
  return db.query(query).then(dbRes => res.redirect('/list/' + table));
})
app.get("/register", (req, res) => {
  res.render("register");
});
app.post("/register", (req, res) => {
  const { email, password, first_name, last_name, number } = req.body;
  let query = {
    text: 'INSERT INTO users(email, password, first_name, last_name, phone_number) VALUES ($1 ,$2 ,$3 ,$4 ,$5) RETURNING *;',
    values: [email, password, first_name, last_name, number]
  };
  return db.query(query).then(dbRes => res.send(201));
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
