from decimal import Decimal

from numpy import percentile
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

import requests
import json
import os

from .database import SessionLocal  # Absolute import for SessionLocal

API_AUTH_TOKEN = os.getenv("API_AUTH_TOKEN")

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
async def create_price_data(zone: str, price_sek: Decimal, time_start: datetime, time_end: datetime,
                             db: Session = Depends(get_db)):

# Inserts a new price data entry into the electricity_prices table (SQL)

    query = text("""
            INSERT INTO price_data (zone, price_sek, time_start, time_end)
            VALUES (:zone, :price_sek, :time_start, :time_end)
            RETURNING id, zone, price_sek, time_start, time_end, created_at
        """)


    result = db.execute(query, {
    "zone": zone,
    "price_sek": price_sek,  # Ensure case matches the DB
    "time_start": time_start,
    "time_end": time_end
    })
    db.commit()

    # Fetch the inserted data (including the generated id)
    new_price_data = result.fetchone()


    return {
    "id": new_price_data.id,
    "zone": new_price_data.zone,
    "price_sek": new_price_data.price_sek,
    "time_start": new_price_data.time_start,
    "time_end": new_price_data.time_end,
    "created_at": new_price_data.created_at
    }

# GET endpoint: Fetch data by ID
@router.get("/price-data/{price_data_id}")
async def read_price_data(price_data_id: int, db: Session = Depends(get_db)):

# Fetches a specific price data entry from the electricity_prices table (SQL)

    query = text("SELECT * FROM price_data WHERE id = :id")
    result = db.execute(query, {"id": price_data_id})
    price_data = result.fetchone()

    if price_data is None:
        raise HTTPException(status_code=404, detail="PriceData not found")

    return {
    "id": price_data.id,
    "zone": price_data.zone,
    "price_sek": price_data.price_sek,  # Ensure case matches the DB
    "time_start": price_data.time_start,
    "time_end": price_data.time_end,
    "created_at": price_data.created_at  # Include created_at for completeness
    }

# GET endpoint: Fetch data by Zone
@router.get("/price-data/{price_data_zone}")
async def read_price_data_zone(price_data_zone: str, db: Session = Depends(get_db)):
    print(f"Received price_data_zone: '{price_data_zone}'")

# Fetches a specific price data entry by zone from the price_data table (SQL)

    query = text("SELECT * FROM price_data WHERE zone = :zone")
    result = db.execute(query, {"zone": price_data_zone})
    price_data = result.fetchone()

    if price_data is None:
        raise HTTPException(status_code=404, detail="PriceData by zone not found")

    return {
        "id": price_data.id,
        "zone": price_data.zone,
        "price_sek": price_data.price_sek,
        "time_start": price_data.time_start,
        "time_end": price_data.time_end

    }

# GET endpoint: Get price levels by zone
@router.get("/getPriceLevels/{zone}")
async def get_price_levels(zone: str, db: Session = Depends(get_db)):
    print(f"Fetching latest price entry for zone: {zone}")

    # Check if the zone exists in the database
    count_query = text("SELECT COUNT(*) FROM price_data WHERE zone = :zone")
    count_result = db.execute(count_query, {"zone": zone}).scalar()
    print(f"Number of records for zone '{zone}': {count_result}")

    if count_result == 0:
        raise HTTPException(status_code=404, detail="No price data available for this zone.LINE 117")

    # getting the latest price entry:
    query_latest_time = text("""
            SELECT time_start FROM price_data 
            WHERE zone = :zone 
            ORDER BY time_start DESC 
            LIMIT 1
        """)
    latest_time_result = db.execute(query_latest_time, {"zone": zone}).fetchone()
    print(f"Latest time result: {latest_time_result}")

    if not latest_time_result:
        raise HTTPException(status_code=404, detail="No price data available for this zone.")

    # current time
    current_time = latest_time_result[0]
    print(f"Current time: {current_time}")
    # back one month
    past_month = current_time - timedelta(days=30)
    print(f"Past month time: {past_month}")

    # All prices within the last month
    query_prices = text("""
            SELECT price_sek FROM price_data 
            WHERE zone = :zone 
            AND time_start BETWEEN :past_month AND :current_time
        """)
    result = db.execute(query_prices, {
        "zone": zone,
        "past_month": past_month,
        "current_time": current_time
    })

    prices = [float(row[0]) for row in result.fetchall()]
    print(f"Prices for the last month: {prices}")

    if not prices:
        raise HTTPException(status_code=404, detail="No price data for the last month in this zone.")

    # Calculating the top and bottom quartiles:
    high_price = float(percentile(prices, 75))
    low_price = float(percentile(prices, 25))
    print(f"Calculated high price: {high_price}, low price: {low_price}")


    return {
        "zone": zone,
        "priceLevels": {
            "high" : high_price,
            "low" : low_price
        }
    }


# GET endpoint: Get the BiddingZone given coordinates
@router.get("/get-zone-by-location/")
def get_zone_from_location(lat: float, lon: float):
    request = requests.get(f"https://api.electricitymap.org/v3/carbon-intensity/latest?lat={lat}&lon={lon}")
    return json.loads(request.content).get("zone")
