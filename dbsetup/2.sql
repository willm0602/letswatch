/*
    Creates media object to save in database to cache media

    ! NOTE: This will delete watch list items. If you have any important data inside it from 1.sql,
    ! you should back it up before running this file
*/

DROP TABLE IF EXISTS Watch_List_Items;
DROP TABLE IF EXISTS Media;

CREATE TABLE Media(
    id BIGINT NOT NULL AUTO_INCREMENT,
    title VARCHAR(512),
    image_url VARCHAR(2048),
    rating FLOAT(4),
    release_date DATE,
    synopsis TEXT(1048576),
    type VARCHAR(32) NOT NULL,
    lets_watch_id BIGINT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE Watch_List_Items(
    id BIGINT NOT NULL AUTO_INCREMENT,
    watchlist_id BIGINT NOT NULL,
    media_id BIGINT NOT NULL,
    user_added_by_id BIGINT,
    date_added DATE,
    FOREIGN KEY (watchlist_id) references Watch_Lists(id) ON DELETE CASCADE,
    FOREIGN KEY (media_id) references Media(id) ON DELETE CASCADE,
    FOREIGN KEY (user_added_by_id) references Users(id),
    PRIMARY KEY (id)
);

