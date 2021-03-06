//send all queries to here, this class will respond with promises which will resolve, returning the requested data
require("dotenv").config();
const mysql = require("mysql");
let instance = null;

//hide later in .env file
const pool = mysql.createPool({
  host: "bug-tracker-db.c5oyivbqljdl.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "devonh12#",
  database: "bug_tracker",
});

// const pool = mysql.createPool({
//   host: process.env.HOST,
//   user: process.env.USER,
//   password: process.env.PASSWORD,
//   database: process.env.DATABASE,
//   port: process.env.DB_PORT,
// });

class DbService {
  //singleton class
  //if there is an instance created already, return it, if not, create one
  static getDbInstance() {
    return instance ? instance : new DbService();
  }
  //async function will always return a promise
  //want functions in this class to return promises so we can send & process data in another class

  //get all tickets associated with this user Id
  async getAllData(userId) {
    //wrap in try catch block to catch any errors that the .catch of a promise would have caught
    try {
      //const will only be given a value after the promise resolves
      const response = await new Promise((resolve, reject) => {
        // const query = "SELECT * FROM tickets WHERE creator_id = ?";
        //select ticket information, including all information in the ticket table. Use teamId and creator_id to find
        //the team name and usernam of the creator from teams and users table
        const query =
          "SELECT tickets.*, users.username, teams.name FROM tickets JOIN users ON tickets.creator_id = users.user_id LEFT OUTER JOIN teams ON tickets.team_id = teams.team_id WHERE tickets.creator_id = ?";
        pool.query(query, [userId], (error, results) => {
          if (error) {
            reject(new Error(error.message));
          }
          resolve(results);
        });
      });
      return response;
    } catch (err) {
      if (err) {
        console.log(err);
      }
    }
  }

  //check if a user is in the database
  //BINARY requires match to be case sensitive
  //return the user id and user information from database using given username and password
  async getUserID(username, password) {
    try {
      const response = await new Promise((resolve, reject) => {
        const query =
          "SELECT user_id, username, permissions FROM users WHERE BINARY username=? AND BINARY password=?";

        pool.query(query, [username, password], (error, results) => {
          if (error) {
            reject(new Error(error.message));
          }
          resolve(results);
        });
      });
      return response;
    } catch (err) {
      //catches any errors thrown by any promise within the try block
      if (err) console.log(err);
    }
  }

  //add a new ticket to the database
  async addTicket(ticketObj) {
    try {
      const { userId, shortDescription, fullDescription, status, teamId } =
        ticketObj;
      const ticketId = await new Promise((resolve, reject) => {
        const query =
          "INSERT INTO tickets (ticket_id, team_id, creator_id, date_created, short_description, full_description, status) VALUES(?, ?, ?, ?, ?, ?, ?)";
        pool.query(
          query,
          [
            "default",
            teamId,
            userId,
            new Date(),
            shortDescription,
            fullDescription,
            status,
          ],
          (err, results) => {
            if (err) {
              reject(new Error(err.message));
            }
            resolve(results.insertId);
          }
        );
      });
      return ticketId;
    } catch (err) {
      if (err) {
        console.log(err);
      }
    }
  }

  //update a given ticket in the database
  async updateTicket(ticket) {
    const { ticketId, shortDescription, fullDescription, status } = ticket;
    const rowsAffected = await new Promise((resolve, reject) => {
      const query =
        "UPDATE tickets SET short_description=?, full_description=?, status=? WHERE ticket_id=?";
      pool.query(
        query,
        [shortDescription, fullDescription, status, ticketId],
        (err, results) => {
          if (err) {
            reject(new Error(err.message));
          }
          resolve(results.changedRows);
        }
      );
    });
    return rowsAffected;
  }

  //delete a ticket given a ticketid and return the number of rows deleted
  async deleteTicket(ticketId) {
    const rowsAffected = await new Promise((resolve, reject) => {
      const query = "DELETE FROM tickets WHERE ticket_id=?";
      pool.query(query, [ticketId], (err, results) => {
        if (err) {
          reject(new Error(err.message));
        }
        resolve(results.affectedRows);
      });
    });
    return rowsAffected;
  }

  //retrieve the name and id of all teams the user with the given id is associated with
  async getUserTeams(userId) {
    const teams = await new Promise((resolve, reject) => {
      const query =
        "SELECT teams.name, teams.team_id FROM teams INNER JOIN team_members ON team_members.team_id = teams.team_id WHERE team_members.user_id = ?";
      pool.query(query, [userId], (err, results) => {
        if (err) {
          reject(new Error(err.message));
        }
        console.log(results);
        resolve(results);
      });
    });
    return teams;
  }

  //get all tickets associated with the teamId given
  async getTeamTickets(teamId) {
    const tickets = await new Promise((resolve, reject) => {
      const query =
        "SELECT tickets.*, users.username, teams.name FROM tickets JOIN users ON tickets.creator_id = users.user_id LEFT OUTER JOIN teams ON tickets.team_id = teams.team_id WHERE tickets.team_id = ?";
      pool.query(query, [teamId], (err, results) => {
        if (err) {
          reject(new Error(err.message));
        }
        console.log(results);
        resolve(results);
      });
    });
    return tickets;
  }

  async getTeamMembers(teamId) {
    const members = await new Promise((resolve, reject) => {
      const query =
        "SELECT team_members.user_id, users.username FROM team_members INNER JOIN users ON team_members.user_id = users.user_id WHERE team_id = ?";
      pool.query(query, teamId, (err, results) => {
        if (err) {
          reject(new Error(err.message));
        }
        console.log(results);
        resolve(results);
      });
    });
    //return this promise so it can be resolved / rejected in the other file, where we will handle errors & respond w/ a json error msg or result set
    return members;
  }
}
module.exports = DbService;
//module.exports.dbService = DbService;
