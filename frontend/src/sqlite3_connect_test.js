// /*This is the connection test file. To run it, install SQLite3 
// in the node_modules folder [npm install --save sqlite3] then change directory to 'src' [cd C:\Users\USER\Documents\31242_Advanced_Internet_Programming\AIPAssignment3\frontend\src]
// then run the file from the console with this command [node sqlite3_connect_test.js]
// I have already inserted 3 UsersName rows in the table Users 'Firs User', 'Second User' 
// and 'Third User'. There is a copy of the database with 3 users 'SQLiteBlog.sqlite3.copyOfdbWith3Users', 
// simpliy remove the extension to replace a corrupt or messed up SQLiteBlog.sqlite3 database file*/

// const sqlite3 = require('sqlite3').verbose();
 
// // open the database
// let db = new sqlite3.Database('../sqlite3db/SQLiteBlog.sqlite3', sqlite3.OPEN_READWRITE, (err) => {
//   if (err) {
//     console.error(err.message);
//   }
//   console.log('Connected to the SQLiteBlog database.');
// });

// /////////////////Uncomment the block below to test - insert new user///////////////////////////////////
// db.run(`INSERT INTO Users(UserID, UserName, UserEmail, UserPassword) VALUES('3', 'Third User', 'third@user.com', 'third-password')`, function(err) {
//   if (err) {
//     return console.log(err.message);
//   }
//   // get the last insert id
//   console.log(`A row has been inserted with rowid ${this.lastID}`);
// });

// /////////////////////////insert single row////////////////////////////////////////////////////////////
// db.run(`INSERT INTO Users(UserName) VALUES(?)`, ['Third User'], function(err) {
//   if (err) {
//     return console.log(err.message);
//   }
//   // get the last insert id
//   console.log(`A row has been inserted with rowid ${this.lastID}`);
// });

// ////////////////////////////////Uncomment the block below to test - insert new blog/////////////////////
// db.run(`INSERT INTO Posts(PostID, Title, PostText, PostDate, OwnerID) VALUES('3', 'Third Blog Title', 'Find the most current and reliable 7 day weather forecasts, storm alerts, reports and information for Sydney, AU with The Weather Network.', '2018-08-29 07:30', '3')`, function(err) {
//   if (err) {
//     return console.log(err.message);
//   }
//   // get the last insert id
//   console.log(`A row has been inserted with rowid ${this.lastID}`);
// });


// ////////////////////////////////////update single cell///////////////////////////////////
// let data = ['Third Blog Title'];
// let sql = `UPDATE Posts
//             SET Title = ?
//             WHERE PostID = 3`;
 
// db.run(sql, data, function(err) {
//   if (err) {
//     return console.error(err.message);
//   }
//   console.log(`Row(s) updated: ${this.changes}`);
 
// });



// ////////////////////////////////delete statement//////////////////////////
//  let sql = `DELETE FROM Posts
//                WHERE PostID='3';`;
 
// db.run(sql, function(err) {
//   if (err) {
//     return console.error(err.message);
//   }
//   console.log(`Row(s) deleted: ${this.changes}`);
 
// });



// //////////////////////////////show all users query////////////////////////////
// let sql = `SELECT * FROM Users
//             ORDER BY UserID`;

//   db.all(sql, [], (err, rows) => {
//   if (err) {
//     throw err;
//   }
//   rows.forEach((row) => {
//     console.log(row);
//   });
// });


// //////////////////////////show all blog posts query////////////////////////////
// let sql = `SELECT * FROM Posts
//             ORDER BY OwnerID`; 


//   db.all(sql, [], (err, rows) => {
//   if (err) {
//     throw err;
//   }
//   rows.forEach((row) => {
//     console.log(row);
//   });
// });

// // close the database connection
// db.close();