import os
from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL")

# interface: connection to db
engine = create_engine(DATABASE_URL)

#session factory: creates new session objects for database transactions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Function to fetch all data from the table
def fetch_all_data():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT * FROM electricity_prices"))
        return result.fetchall()
