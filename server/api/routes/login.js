const express = require("express");
const router = express.Router();
const dbService = require("../dbService");

const dbInstance = dbService.getDbInstance();

//checking if a user is in the database
//retrieve a user from the database, if they do not exist return empty
router.post("/getUser", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  const result = dbInstance.getUserID(username, password);
  result //result will be the user id and the users permissions
    .then((data) => {
      if (data != null && data.length != 0) {
        res.status(200).json({ success: "true", data: data });
      } else {
        //if we cannot find the user in the database, return a new error json object
        res.json({
          error: "user not found in database",
          username: username,
          password: password,
          data: data,
        });
      }
    })
    .catch((error) => res.status(500).json({ err: error }));
});

module.exports = router;
