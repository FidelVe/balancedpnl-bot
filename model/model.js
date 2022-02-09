// model/model.js
const fs = require("fs");
const { customPath } = require("../services");

const USERS_DB_PATH = "data/users.json";

// functions
function updateUsersDb(userId, data) {
  let userDb = {};
  userDb[userId] = data;
  if (fs.existsSync(customPath(USERS_DB_PATH))) {
    let oldDb = JSON.parse(fs.readFileSync(customPath(USERS_DB_PATH)));
    userDb = { ...oldDb, ...userDb };
  }
  fs.writeFileSync(customPath(USERS_DB_PATH), JSON.stringify(userDb));
}

function readUsersDb(userId) {
  let userDb = {};
  userDb[userId] = {};
  if (fs.existsSync(customPath(USERS_DB_PATH))) {
    let oldDb = JSON.parse(fs.readFileSync(customPath(USERS_DB_PATH)));
    userDb = { ...userDb, ...oldDb };
  }

  return userDb[userId];
}

function checkUsersDb(session, userId) {
  let newSession = { ...session };

  newSession[userId] = readUsersDb(userId);

  return newSession;
}

module.exports = {
  updateUsersDb: updateUsersDb,
  readUsersDb: readUsersDb,
  checkUsersDb: checkUsersDb
}
