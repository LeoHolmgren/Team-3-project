from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session
from datetime import datetime
from .database import SessionLocal

router = APIRouter()

# get a database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# POST endpoint: Insert data directly into the electricity_prices table
@router.post("/price-data/")
async def create_price_data(zone: str, price_SEK: float, time_start: datetime, time_end: datetime,
                            db: Session = Depends(get_db)):

# Inserts a new price data entry into the electricity_prices table (SQL)

    query = text("""
        INSERT INTO electricity_prices (zone, price_SEK, time_start, time_end)
        VALUES (:zone, :price_SEK, :time_start, :time_end)
        RETURNING id, zone, price_SEK, time_start, time_end
    """)

    result = db.execute(query, {
        "zone": zone,
        "price_SEK": price_SEK,
        "time_start": time_start,
        "time_end": time_end
    })
    db.commit()

    # Fetch the inserted data (including the generated id)
    new_price_data = result.fetchone()

    return {
        "id": new_price_data.id,
        "zone": new_price_data.zone,
        "price_SEK": new_price_data.price_SEK,
        "time_start": new_price_data.time_start,
        "time_end": new_price_data.time_end
    }

# GET endpoint: Fetch data by ID
@router.get("/price-data/{price_data_id}")
async def read_price_data(price_data_id: int, db: Session = Depends(get_db)):

# Fetches a specific price data entry from the electricity_prices table (SQL)

    query = text("SELECT * FROM electricity_prices WHERE id = :id")
    result = db.execute(query, {"id": price_data_id})
    price_data = result.fetchone()

    if price_data is None:
        raise HTTPException(status_code=404, detail="PriceData not found")

    return {
        "id": price_data.id,
        "zone": price_data.zone,
        "price_SEK": price_data.price_SEK,
        "time_start": price_data.time_start,
        "time_end": price_data.time_end
    }

# Mocked data
price_levels_by_zone = {
    'SE1': {'high': 0.500, 'low': 0.300},
    'SE2': {'high': 0.700, 'low': 0.400},
    'SE3': {'high': 0.600, 'low': 0.350},
    'default': {'high': 0.1000, 'low': 0.500}
}

# GET endpoint: Get price levels by zone
@router.get("/getPriceLevels/{zone}")
async def get_price_levels(zone: str):
    levels = price_levels_by_zone.get(zone, price_levels_by_zone['default'])

    return {
        "zone": zone,
        "priceLevels": levels
    }

