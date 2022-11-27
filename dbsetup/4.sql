/* Will make it so user pfp defaults to none instead of 0 */

ALTER TABLE Users modify ProfileImageID int DEFAULT 0;