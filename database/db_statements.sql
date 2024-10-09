-- This is a sql statement for creating the price_data table that we use. 
CREATE TABLE price_data (
    zone VARCHAR(5) NOT NULL ,
    price_SEK DECIMAL(10, 4) NOT NULL,
    time_start TIMESTAMP NOT NULL,
    time_end TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (zone, time_start, time_end)
);

-- This is a sql statement for creating the email_subscribers table that we use. 
CREATE TABLE email_subscribers (
    email_id SERIAL PRIMARY KEY, 
    email VARCHAR(255) NOT NULL UNIQUE, 
    name VARCHAR(100) NOT NULL,
    zone VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

