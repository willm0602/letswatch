/* Assumes you have created a database called letswatch.
    Otherwise, go into mysql shell or sql workbench and run the following:

    CREATE DATABASE letswatch;
*/ 

/* Assumes you have created a database called letswatch.
    Otherwise, go into mysql shell or sql workbench and run the following:

    CREATE DATABASE letswatch;
*/ 

use letswatch;

-- Drops all tables
DROP TABLE IF EXISTS Friendships;
DROP TABLE IF EXISTS User_Group_Memberships;
DROP TABLE IF EXISTS User_List_Memberships;
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS User_Groups;
DROP TABLE IF EXISTS Watch_Lists;



-- Creates all of the tables
CREATE TABLE Users(
    id BIGINT NOT NULL AUTO_INCREMENT,
    Username varchar(255),
    Password varchar(255),
    ProfileImageID int,
    Bio varchar(100),
    Access_Token varchar(255),
    PRIMARY KEY (id)
);

CREATE TABLE User_Groups(
    id BIGINT NOT NULL AUTO_INCREMENT,
    Name varchar(255),
    PRIMARY KEY (id)
);

CREATE TABLE User_Group_Memberships(
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    group_id BIGINT NOT NULL,
    FOREIGN KEY (user_id) references Users(id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) references User_Groups(id) ON DELETE CASCADE,
    PRIMARY KEY (id)
);

CREATE TABLE Watch_Lists(
    id BIGINT NOT NULL AUTO_INCREMENT,
    Name varchar(1024),
    PRIMARY KEY (id),
    group_id BIGINT NOT NULL,
    FOREIGN KEY (group_id) references User_Groups(id)
);

CREATE TABLE User_List_Memberships(
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    list_id BIGINT NOT NULL,
    FOREIGN KEY (user_id) references Users(id) ON DELETE CASCADE,
    FOREIGN KEY (list_id) references Watch_Lists(id) ON DELETE CASCADE,
    PRIMARY KEY (id)
);

CREATE TABLE Friendships(
    id BIGINT NOT NULL AUTO_INCREMENT,
    first_user_id BIGINT NOT NULL,
    second_user_id BIGINT NOT NULL,
    FOREIGN KEY (first_user_id) references Users(id) ON DELETE CASCADE,
    FOREIGN KEY (second_user_id) references Users(id) ON DELETE CASCADE,
    PRIMARY KEY (id)
);