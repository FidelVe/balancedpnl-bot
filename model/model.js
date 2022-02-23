// model/model.js
const fs = require("fs");
const customPath = require("../services/customPath.js");

const USERS_DB_PATH = "data/users.json";
const _DB_ = "data/db.json";

// functions
function dbInitState(currentUser) {
  let db = {
    default_id: {
      assets: {
        sICX: 0
      }
    }
  };

  db[currentUser] = {
    assets: {
      sICX: 0
    }
  };

  return db;
}
function readDb(currentUserId) {
  let db = dbInitState(currentUserId);
  if (fs.existsSync(customPath(_DB_))) {
    let dbInFile = JSON.parse(fs.readFileSync(customPath(_DB_)));
    db = { ...db, ...dbInFile };
  }
  return db;
}
function writeDb(db) {
  console.log(db);
  fs.writeFileSync(customPath(_DB_), JSON.stringify(db));
}
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
  checkUsersDb: checkUsersDb,
  readDb: readDb,
  writeDb: writeDb
};
