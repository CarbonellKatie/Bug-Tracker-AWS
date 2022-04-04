const dbService = require("./dbService");

const dbInstance = dbService.getDbInstance();

test("get all tickets for a user with the given ID", () => {
  expect(dbInstance.getUserID("Kate", "adminPass")).toBe([1, "Kate"]);
});
