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
@router.get("/get-price-levels/{zone}")
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


# GET endpoint: Fetch data by Zone And time interval (Seconds since epoch)
@router.get("/price-data/")
async def read_price_data_zone(zone: str, start: int, end: int, db: Session = Depends(get_db)):

    startstr = datetime.fromtimestamp(start).strftime('%Y-%m-%d %H:%M:%S')
    endstr = datetime.fromtimestamp(end).strftime('%Y-%m-%d %H:%M:%S')

    # Fetches a specific price data entry by zone from the price_data table (SQL)
    query = text("SELECT * FROM price_data WHERE zone = :zone AND time_start >= :start and time_end <= :end")
    
    result = db.execute(query, {
        "zone": zone,
        "start": startstr,
        "end": endstr
    })

    price_data = result.fetchall()

    if price_data is None:
        raise HTTPException(status_code=404, detail="No Price Data For Given Zone And Time Interval Was Found")

    ret = []

    for entry in price_data:
        ret.append({
            "price": entry[1],
            "time": int(entry[2].timestamp())
        })

    return ret
