from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session
from datetime import datetime
from pydantic import EmailStr, BaseModel
from sqlalchemy.exc import IntegrityError

import requests
import json

from database import SessionLocal
from models import Subscriber as EmailSubscriber

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


@router.post("/{zone}/subscribe")
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
        "zone": price_data.zone,
        "price_sek": price_data.price_sek,
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
