//send all queries to here, this class will respond with promises which will resolve, returning the requested data

const mysql = require("mysql");
let instance = null;

//local database
// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "ticket_system",
// });

const pool = mysql.createPool({
  host: "bug-tracker-db.c5oyivbqljdl.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "devonh12#",
  database: "bug_tracker",
});

class DbService {
  //singleton class
  //if there is an instance created already, return it, if not, create one
  static getDbInstance() {
    return instance ? instance : new DbService();
  }
  //async function will always return a promise
  //want functions in this class to return promises so we can send & process data in another class
  async getAllData(userId) {
    //wrap in try catch block to catch any errors that the .catch of a promise would have caught
    try {
      //const will only be given a value after the promise resolves
      const response = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM tickets WHERE creator_id = ?";
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
        const query = "INSERT INTO tickets VALUES(?, ?, ?, ?, ?, ?, ?)";
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
      const query = "SELECT * FROM TICKETS WHERE team_id = ?";
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
}
module.exports = DbService;
//module.exports.dbService = DbService;
