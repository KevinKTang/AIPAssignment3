/*This is the connection test file. To run it, install SQLite3 
in the node_modules folder [npm install --save sqlite3]
then run the file from the console with this command [node sqlite3_connect_test.js]
I have already inserted 3 UsersName rows in the table Users 'Firs User', 'Second User' 
and 'Third User'. There is a copy of the database with 3 users 'SQLiteBlog.sqlite3.copyOfdbWith3Users', 
simpliy remove the extension to replace a corrupt or messed up SQLiteBlog.sqlite3 database file*/

const sqlite3 = require('sqlite3').verbose();
 
// open the database
let db = new sqlite3.Database('../sqlite3db/SQLiteBlog.sqlite3', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the SQLiteBlog database.');
});

//------------Uncomment the block below to test - insert new user------------


// db.run(`INSERT INTO Users(UserID, UserName, UserEmail, UserPassword) VALUES('3', 'Third User', 'third@user.com', 'third-password')`, function(err) {
//   if (err) {
//     return console.log(err.message);
//   }
//   // get the last insert id
//   console.log(`A row has been inserted with rowid ${this.lastID}`);
// });

//--------------The block below is for - insert single row----------


// db.run(`INSERT INTO Users(UserName) VALUES(?)`, ['Third User'], function(err) {
//   if (err) {
//     return console.log(err.message);
//   }
//   // get the last insert id
//   console.log(`A row has been inserted with rowid ${this.lastID}`);
// });


//----------------show all users query----------------------------------

let sql = `SELECT * FROM Users
            ORDER BY UserName`;
 
db.all(sql, [], (err, rows) => {
  if (err) {
    throw err;
  }
  rows.forEach((row) => {
    console.log(row);
  });
});

// close the database connection
db.close();