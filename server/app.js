const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");

const loginRoutes = require("./api/routes/login");
const adminRoutes = require("./api/routes/admin");
const inventoryRoutes = require("./api/routes/inventory");

app.use(bodyParser.json());
app.use(cors());
app.use(express.json()); //allows us to send data in json format
app.use(bodyParser.urlencoded({ extended: false }));

//for deployment to AWS EC2 instance
app.use(express.static(path.join(__dirname, “client/build”)))


//have app listen on port 8080
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});

app.use("/admin", adminRoutes);
app.use("/inventory", inventoryRoutes);
app.use("/login", loginRoutes);

//post request to add new admin login credentials
//dont need results from query, just making a post request, only need to check if there is an error
//store data to be inserted in request body
app.post("/addUser", (req, res) => {
  const data = {
    id: "default", //id is auto-incremented
    username: req.body.username,
    password: req.body.password,
    permissions: req.body.permissions,
  };
  const query = "INSERT INTO users VALUES (?, ?, ?, ?)";
  pool.query(query, Object.values(data), (error) => {
    //if unsuccessful, respond with a json object with error code
    if (error) {
      res.json({ status: "failure", reason: error.code });
    } else {
      //if successful in adding, respond with the user info that we added to the database
      res.json({ status: "success", data: data });
    }
  });
});

//remove a user from the database
app.delete("/", (req, res) => {
  const id = req.body.id;
  const query = "DELETE FROM users WHERE id=?";
  pool.query(query, id, (error) => {
    if (error) {
      res.json({ status: "failure", reason: error.code });
    } else {
      res.json({ status: "success", id: id });
    }
  });
});

//update permissions for an existing user
app.put("/:id", (req, res) => {
  const id = req.params.id;
  const newPermissions = req.body.permissions;
  const query = "UPDATE users SET permissions=? WHERE id=?";

  pool.query(query, [newPermissions, id], (error) => {
    if (error) {
      res.json({ status: "failure", reason: error.code });
    } else {
      res.json({ status: "success", id: id, permissions: newPermissions });
    }
  });
});

//  -----------------LOGIN SYSTEM ---------------

module.exports = app;
