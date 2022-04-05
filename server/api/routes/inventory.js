const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const { route } = require("../../app");

const DbService = require("../dbService");

//fetch all tickets associated with given user id
router.get("/getAll/:userId", (req, res) => {
  const DbInstance = DbService.getDbInstance();

  //calling async function, returns a promise, which will resolve and return data from users table
  const result = DbInstance.getAllData(req.params.userId);
  //promise will resolve and return all data from the database
  result
    .then((data) => res.status(200).json({ success: true, tickets: data }))
    .catch((err) => res.json({ success: false, error: err.message }));
});

//post a new ticket with information in request body
router.post("/", (req, res) => {
  let ticket = req.body;

  const DbInstance = DbService.getDbInstance();
  const result = DbInstance.addTicket(ticket);

  result
    .then((results) =>
      res.status(200).json({ success: true, ticketId: results })
    )
    .catch((err) => res.json({ success: false, error: err.message }));
});

//update ticket information to match ticket info given in request body
router.put("/", (req, res) => {
  let ticket = req.body;
  const DbInstance = DbService.getDbInstance();
  const result = DbInstance.updateTicket(ticket);
  result
    .then((results) =>
      res.status(200).json({ success: true, rowsUpdated: results })
    )
    .catch((err) => res.json({ success: false, error: err.message }));
});

//deletes ticket with id given in request body
//TODO: change this route to /:ticketId
router.delete("/:ticketId", (req, res) => {
  let ticketId = req.params.ticketId;
  const DbInstance = DbService.getDbInstance();
  const result = DbInstance.deleteTicket(ticketId);
  result
    .then((results) =>
      res.status(200).json({ success: true, rowsDeleted: results })
    )
    .catch((err) => res.json({ error: err.message }));
});

//TEAM-RELATED INFORMATION

//TODO: change route to /user/teams/:userId
//gets all teams that a user is a member of and returns an array of team objects containing team id and team name
router.get("/teams/:userId", (req, res) => {
  const DbInstance = DbService.getDbInstance();
  const result = DbInstance.getUserTeams(req.params.userId);
  result
    .then((results) => res.status(200).json({ success: true, teams: results }))
    .catch((err) => res.json({ success: false, error: err.message }));
});

//get all tickets for a specific team
router.get("/teams/tickets/:teamId", (req, res) => {
  const DbInstance = DbService.getDbInstance();
  const result = DbInstance.getTeamTickets(req.params.teamId);
  result
    .then((results) =>
      res.status(200).json({ success: true, tickets: results })
    )
    .catch((err) => res.json({ success: false, error: err.message }));
});

//get the team member list for team with the given teamId. Results set should contain an array of objects containing userIds and usernames
//response
router.get("/teams/members/:teamId", (req, res) => {
  //verify that the teamId is not invalid (negative integers are invalid)
  if (req.params.teamId < 0) {
    res.json({ success: false, error: "teamId cannot be negative" });
  } else {
    const DbInstance = DbService.getDbInstance();
    const result = DbInstance.getTeamMembers(req.params.teamId);
    result
      .then((results) =>
        res.status(200).json({ success: true, members: results })
      )
      .catch((err) => res.json({ success: false, error: err.message }));
  }
});

module.exports = router;
