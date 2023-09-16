--
-- File generated with SQLiteStudio v3.4.4 on �� ��� 29 15:13:13 2023
--
-- Text encoding used: System
--
PRAGMA foreign_keys = off;
BEGIN TRANSACTION;

-- Table: criterion_1
CREATE TABLE IF NOT EXISTS criterion_1 (user_id INTEGER PRIMARY KEY UNIQUE, grade_1 INTEGER DEFAULT (0), grade_2 INTEGER DEFAULT (0), grade_3 INTEGER DEFAULT (0));

-- Table: criterion_2
CREATE TABLE IF NOT EXISTS criterion_2 (user_id INTEGER PRIMARY KEY UNIQUE, grade_1 INTEGER DEFAULT (0), grade_2 INTEGER DEFAULT (0));

-- Table: criterion_3
CREATE TABLE IF NOT EXISTS criterion_3 (user_id INTEGER UNIQUE PRIMARY KEY, grade_1 INTEGER DEFAULT (0), grade_2 INTEGER DEFAULT (0), grade_3 INTEGER DEFAULT (0), grade_4 INTEGER DEFAULT (0));

-- Table: criterion_4
CREATE TABLE IF NOT EXISTS criterion_4 (user_id INTEGER PRIMARY KEY UNIQUE, grade_1 INTEGER DEFAULT (0), grade_2 INTEGER DEFAULT (0));

-- Table: criterion_5
CREATE TABLE IF NOT EXISTS criterion_5 (user_id INTEGER PRIMARY KEY UNIQUE, grade_1 INTEGER DEFAULT (0), grade_2 INTEGER DEFAULT (0), grade_3 INTEGER DEFAULT (0), grade_4 INTEGER DEFAULT (0), grade_5 INTEGER DEFAULT (0));

-- Table: users
CREATE TABLE IF NOT EXISTS users (user_id INTEGER PRIMARY KEY UNIQUE, division INTEGER NOT NULL);

COMMIT TRANSACTION;
PRAGMA foreign_keys = on;
