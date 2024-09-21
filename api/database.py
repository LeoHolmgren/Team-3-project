from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Database connection URL
DATABASE_URL = "postgresql://ElectricityPricesDatabase_owner:Sf54EaVzqjeP@ep-lingering-queen-a2q4uvi7.eu-central-1.aws.neon.tech/ElectricityPricesDatabase?sslmode=require"

# interface: connection to db
engine = create_engine(DATABASE_URL)

#session factory: creates new session objects for database transactions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Function to fetch all data from the table
def fetch_all_data():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT * FROM electricity_prices"))
        return result.fetchall()
