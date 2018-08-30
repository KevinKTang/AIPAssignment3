-- These are the SQL statements used to create the Blog database files
-- This text is for visual reference, and is not used by the app
-- File generated with SQLiteStudio v3.2.1 on Sat Aug 25 17:57:17 2018
--
-- Text encoding used: System
--
PRAGMA foreign_keys = off;
BEGIN TRANSACTION;

-- Table: Posts
CREATE TABLE Posts (
    PostID   INTEGER,
    Title    STRING,
    PostText TEXT,
    PostDate DATE,
    OwnerID  INTEGER REFERENCES Users (UserID) 
);


-- Table: Users
CREATE TABLE Users (
    UserID       INTEGER     PRIMARY KEY AUTOINCREMENT
                             NOT NULL,
    UserName     STRING (30),
    UserEmail    STRING (30),
    UserPassword STRING (10) 
);


COMMIT TRANSACTION;
PRAGMA foreign_keys = on;