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
const cookieSession = require('cookie-session');


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
app.use(cookieSession({
  name: 'session',
  keys: ['Iliketocookpotatoesinthedark', 'Lifeishardwhenthepotatoesarenotfreshandmushy'],
}));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
const widgetsRoutes = require("./routes/widgets");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
app.use("/api/widgets", widgetsRoutes(db));
// Note: mount other resources here, using the same pattern above

// connect to API
//const request = require("request");
const { requestApi, sortItem } = require('./wordsapi.js');

// Home page
app.get("/", (req, res) => {
  const templateVars = {
    user: req.session.userId,
  };
  res.render("home", templateVars);
});

app.get("/addItem", (req, res) => {
  const templateVars = {
    user: req.session.userId,
  };
  res.render("addItem", templateVars);
});
// add a lists page
app.get("/lists", (req, res) => {
  const templateVars = {
    user: req.session.userId,
  };
  res.render("lists", templateVars);
});

// show the lists for a specific user
app.get("/lists/:listId", (req, res) => {

  let userId = req.session.userId;
  let listId = req.params.listId;
  let query = {
    text: `SELECT a.item, a.description, date_trunc('day',a.date_added), a.list_id, a.id  ,b.name_list FROM items as a
    JOIN lists_type as b  on a.list_id = b.id
    WHERE a.date_completed is null and user_id = $1 and list_id = $2 ;`, values: [userId, Number(listId)]
  };
  return db.query(query).then(data => {
    if (data.rowCount === 0) {
      res.redirect("/addItem");
    } else {
      const templateVars = {
        user: req.session.userId,
        lists: data.rows
      };
      res.render('list', templateVars);
    }
  });
});

// add a edit profile page
app.get("/edit_profile", (req, res) => {
  const templateVars = {
    user: req.session.userId,
  };
  res.render("edit_profile", templateVars);
});

//get the value from the user and update the database
app.post("/edit_profile/:userId", (req, res) => {
  let userId = req.params.userId;
  const { email, password, first_name, last_name, number } = req.body;
  console.log(req.body)
  let query = {
    text: `UPDATE  users SET email =$1 ,password=$2 ,first_name=$3 ,last_name=$4 ,phone_number=$5  WHERE id=$6 ;`,
    values: [email, password, first_name, last_name, Number(number), userId]
  };
  return db.query(query).then(dbRes => res.redirect('/'));
});

//logout
app.get('/logout', (req, res) => {
  delete req.session.userId;
  res.redirect('/login');
});

//login page
app.get("/login", (req, res) => {
  const templateVars = {
    user: req.session.userId,
  };
  res.render("login", templateVars);
})
// see if the user is exist in the database
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  console.log(req.body)
  let query = {
    text: 'SELECT * FROM users WHERE email LIKE $1 AND password LIKE $2 ;',
    values: [email, password]
  };
  return db.query(query).then(dbRes => {

    if (dbRes.rowCount === 0) {
      console.log(dbRes);
      res.send("you have to register")
    }
    else {
      console.log(dbRes);
      req.session.userId = dbRes.rows[0].id;
      res.redirect('/addItem');
    }
  });
})


//register page
app.get("/register", (req, res) => {
  const templateVars = {
    user: req.session.userId,
  };
  res.render("register", templateVars);
});

// insert a new user into the database
app.post("/register", (req, res) => {
  const { email, password, first_name, last_name, number } = req.body;
  console.log(req.body)
  let query = {
    text: 'INSERT INTO users(email, password, first_name, last_name, phone_number) VALUES ($1 ,$2 ,$3 ,$4 ,$5) RETURNING *;',
    values: [email, password, first_name, last_name, number]
  };
  return db.query(query).then(dbRes => res.send(201));
})



//edit item for specific itemId
app.post("/items/item/:itemId", (req, res) => {
  let itemId = req.params.itemId;
  const { list_id } = req.body;

  let query = {
    text: `UPDATE items SET list_id=$1 WHERE id=$2 ;`, values: [list_id, itemId]
  };
  return db.query(query).then(data => {
    res.redirect('/lists/' + list_id);
  });

});

// call api

//requestApi(value,(table) => (table))

// add the item to the database and send 201 to jquery
app.post("/items", (req, res) => {
  let userId = req.session.userId;
  console.log(req.body.comment);
  var comment = req.body.comment;
  var arr = comment.split(' ');
  var firstword = arr[0].toLowerCase();
  const table = sortItem(firstword);
  console.log(table);
  if (table === 0) {
    requestApi(firstword, (tableApi) => {
      console.log(tableApi)
      if (tableApi === 5 || tableApi === 6) {
        console.log("error list - can't put word in the list")
        return res.json({ err: true, msg: "please change the description" })
      }
      else {
        let query = {
          text: 'INSERT INTO items (user_id,list_id,item) VALUES ($1 ,$2 ,$3) RETURNING *;',
          values: [userId, tableApi, comment]
        };
        return db.query(query).then(dbRes => res.send(201))
      };
    })

  } else {
    let query = {
      text: 'INSERT INTO items (user_id,list_id,item) VALUES ($1 ,$2 ,$3) RETURNING *;',
      values: [userId, table, comment]
    };
    return db.query(query).then(dbRes => res.send(201));
  }
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
