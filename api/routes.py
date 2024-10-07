from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session
from datetime import datetime

import requests
import json
import os

from database import SessionLocal  # Absolute import for SessionLocal

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

# GET endpoint: Get the BiddingZone given coordinates
@router.get("/get-zone-by-location/")
def get_zone_from_location(lat: float, lon: float):
    request = requests.get(f"https://api.electricitymap.org/v3/carbon-intensity/latest?lat={lat}&lon={lon}")
    return json.loads(request.content).get("zone")
