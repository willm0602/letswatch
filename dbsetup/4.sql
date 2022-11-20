/* Will make it so user pfp defaults to none instead of 0 */

ALTER TABLE users modify ProfileImageID int DEFAULT 0;