from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from pydantic import EmailStr, BaseModel
from sqlalchemy.exc import IntegrityError
from database import SessionLocal
from models import Subscriber as EmailSubscriber

import requests
import json
import numpy as np

router = APIRouter()

# get a database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class Subscriber(BaseModel):
    email: EmailStr
    name: str

# POST endpoint: Function to subscribe
@router.post("/subscribe/{zone}")
async def subscribe(zone: str, subscriber: Subscriber, session: Session = Depends(get_db)):
    try:
        # TODO: check if zone exists   
        new_subscriber = EmailSubscriber(
            email=subscriber.email,
            name=subscriber.name,
            zone=zone,
        )

        session.add(new_subscriber)
        session.commit()
        session.refresh(new_subscriber)
        return new_subscriber
    
    except IntegrityError:
        session.rollback()
        raise HTTPException(
            status_code=400,
            detail="Email already subscribed to this or different zone",
        )

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
        "zone": price_data.zone,
        "price_sek": price_data.price_sek,
        "time_start": price_data.time_start,
        "time_end": price_data.time_end
    }

# GET endpoint: Function to get price levels by zone
@router.get("/price-levels/{zone}")
async def get_price_levels(zone: str, db: Session = Depends(get_db)):
    print(f"Fetching latest price entry for zone: {zone}")

# GET endpoint: Fetch data by Zone And time interval (Seconds since epoch)
@router.get("/price-data")
async def read_price_data_zone(zone: str, start: int, end: int, db: Session = Depends(get_db)):

    # Fetches a specific price data entry by zone from the price_data table (SQL)
    query = text("SELECT * FROM price_data WHERE zone = :zone AND time_start >= :start and time_end <= :end")

    result = db.execute(query, {
        "zone": zone,
        "start": start,
        "end": end
    })

    price_data = result.fetchall()

    if price_data is None:
        raise HTTPException(status_code=404, detail="No Price Data For Given Zone And Time Interval Was Found")

    ret = []

    for entry in price_data:
        ret.append({
            "price": entry[1],
            "time": int(entry[2])
        })

    return ret


# GET endpoint: Function to get price levels by zone
@router.get("/price-levels/{zone}")
async def get_price_levels(zone: str, db: Session = Depends(get_db)):
    print(f"Fetching latest price entry for zone: {zone}")

    # Check if the zone exists in the database
    count_query = text("SELECT COUNT(*) FROM price_data WHERE zone = :zone")
    count_result = db.execute(count_query, {"zone": zone}).scalar()
    print(f"Number of records for zone '{zone}': {count_result}")

    if count_result == 0:
        raise HTTPException(status_code=404, detail="No price data available for this zone")

    # Get the latest price entry:
    query_latest_time = text("""
            SELECT time_start FROM price_data 
            WHERE zone = :zone 
            ORDER BY time_start DESC 
            LIMIT 1
        """)
    latest_time_result = db.execute(query_latest_time, {"zone": zone}).fetchone()

    if not latest_time_result:
        raise HTTPException(status_code=404, detail="No price data available for this zone.")

    # Current time as UNIX timestamp
    current_time_unix = latest_time_result[0]
    current_time = datetime.fromtimestamp(current_time_unix)
    print(f"Current time: {current_time}")

    # Back one month as UNIX timestamp
    past_month = current_time - timedelta(days=30)
    past_month_unix = int(past_month.timestamp())
    print(f"Past month time: {past_month} (Unix: {past_month_unix})")

    # All prices within the last month
    query_prices = text("""
            SELECT price_sek FROM price_data 
            WHERE zone = :zone 
            AND time_start BETWEEN :past_month_unix AND :current_time_unix
        """)
    result = db.execute(query_prices, {
        "zone": zone,
        "past_month_unix": past_month_unix,
        "current_time_unix": current_time_unix
    })

    # Fetch all the prices and convert to floats
    prices = [float(row[0]) for row in result.fetchall()]
    print(f"Prices for the last month: {prices}")

    if not prices:
        raise HTTPException(status_code=404, detail="No price data for the last month in this zone.")

    # Calculating the top (75th percentile) and bottom (25th percentile) quartiles
    high_price = float(np.percentile(prices, 75))  # 75th percentile (upper quartile)
    low_price = float(np.percentile(prices, 25))   # 25th percentile (lower quartile)
    print(f"Calculated high price: {high_price}, low price: {low_price}")

    # Return the prices, high and low quartiles
    return {
        "prices": prices,
        "high_price": high_price,
        "low_price": low_price
    }

# GET endpoint: Get the BiddingZone given coordinates
@router.get("/get-zone-by-location")
def get_zone_from_location(lat: float, lon: float):
    request = requests.get(f"https://api.electricitymap.org/v3/carbon-intensity/latest?lat={lat}&lon={lon}")
    return json.loads(request.content).get("zone")


# GET endpoint: get available zones
@router.get("/zones")
async def get_available_zones(db: Session = Depends(get_db)):
    query = text("SELECT DISTINCT zone FROM price_data")
    result = db.execute(query)

    # Fetch all the unique zones
    zones = [row[0] for row in result.fetchall()]

    if not zones:
        raise HTTPException(status_code=404, detail="No zones available")

    return {"zones": zones}