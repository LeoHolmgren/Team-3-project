from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session
from datetime import datetime, date

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


# GET endpoint: Get the BiddingZone given coordinates
@router.get("/get-zone-by-location/")
def get_zone_from_location(lat: float, lon: float):
    request = requests.get(f"https://api.electricitymap.org/v3/carbon-intensity/latest?lat={lat}&lon={lon}")
    return json.loads(request.content).get("zone")


# GET endpoint: Fetch data by Zone
@router.get("/price-data/")
async def read_price_data_zone(zone: str, start: int, end: int, db: Session = Depends(get_db)):

    # Fetches a specific price data entry by zone from the price_data table (SQL)
    query = text("SELECT * FROM price_data WHERE zone = :zone AND time_start >= :start and time_end <= :end")
    
    result = db.execute(query, {
        "zone": zone,
        "start": start,
        "end": end
    })

    print(result)

    price_data = result.fetchone()

    if price_data is None:
        raise HTTPException(status_code=404, detail="PriceData by zone not found")

    return "UNDER CONSTRUCTION"


# GET endpoint: Get price-data for a specific day zone
@router.get("/price-data/date/{specific_date}")
def get_price_data_by_date(specific_date: date, price_data_zone: str, db: Session = Depends(get_db)):
    query = text("""
            SELECT * FROM price_data 
            WHERE DATE(time_start) = :specific_date AND zone = :zone
        """)
    result = db.execute(query, {"specific_date": specific_date, "zone": price_data_zone})
    price_data_list = result.fetchall()

    if not price_data_list:
        raise HTTPException(status_code=404, detail="No price data found for the specified date")

    # hourly price data
    hourly_data = [{"price": None, "time": None} for hour in range(24)]

    #  hourly data with fetched results
    for row in price_data_list:
        hour = row.time_start.hour
        hourly_data[hour] = {
            "price": row.price_sek,
            "time": hour
    }

    # Format the results
    return   hourly_data
