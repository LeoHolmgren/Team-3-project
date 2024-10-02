from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Database connection URL
with open('../.DATABASE_URL_SECRET_DO_NOT_SHARE', 'r') as file:
    DATABASE_URL = file.read().replace('\n', '')

# interface: connection to db
engine = create_engine(DATABASE_URL)

#session factory: creates new session objects for database transactions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Function to fetch all data from the table
def fetch_all_data():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT * FROM electricity_prices"))
        return result.fetchall()
