The way that this is setup is so that we can have a list of SQL files to migrate the data
in case we need to update the database at some point.

Likely, there will just be the 1 (1.sql file) to be run.

In addition, with any SQL file, there will also be a matching "revert-" file
e.g. (revert-1.sql) which will undo the changes made to a table
