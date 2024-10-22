from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
from pydantic import EmailStr, BaseModel
from sqlalchemy.exc import IntegrityError
from database import SessionLocal
from models import Subscriber as EmailSubscriber
#from jwt import jwt
#from services import send_confirmation_email, ALGORITHM, SECRET_KEY, send_email

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
async def subscribe_with_confirmation(zone: str, subscriber: Subscriber, session: Session = Depends(get_db)):
    return {"message": "Temporary requires circular import fix"}
        
    #try:
        # Check if the email is already subscribed to any zone
    #    existing_subscriber = session.query(EmailSubscriber).filter_by(email=subscriber.email).first()
    #    if existing_subscriber:
    #        raise HTTPException(
    #            status_code=400,
    #            detail="Email already subscribed to this or a different zone."
    #        )

        # Send confirmation email
        #send_confirmation_email(email=subscriber.email, zone=zone)
    #    return {"message": "Temporary requires circular import fix"}
        #return {"message": "Confirmation email sent."}

    #except IntegrityError:
    #    session.rollback()
    #    raise HTTPException(
    #        status_code=400,
    #        detail="Error occurred while processing the subscription.",
    #    )


# POST endpoint: Function to subscribe with confirmation
@router.get("/confirm")
async def confirm_subscription(token: str, session: Session = Depends(get_db)):
    return {"message": "Temporary requires circular import fix"}

    #try:
        # Decode and verify token
        #payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        #email = payload.get("sub")
        #zone = payload.get("zone")

        # Check if already subscribed for the same zone
        #existing_subscriber = session.query(EmailSubscriber).filter_by(email=email, zone=zone).first()
        #if existing_subscriber:
        #    raise HTTPException(status_code=400, detail="Email already confirmed for this zone.")

        # Add the subscriber to the database for this zone
        #new_subscriber = EmailSubscriber(email=email, zone=zone)
        #session.add(new_subscriber)
        #session.commit()

        # Send a welcome or subscription email after confirmation
        #send_email(
        #    to_address=email,
        #    subject="Welcome!",
        #    body="Thank you for confirming your subscription to zone " + zone,
        #    price=None
        #)
        #return {"message": "Subscription confirmed and welcome email sent."}

    #except jwt.ExpiredSignatureError:
    #    raise HTTPException(status_code=400, detail="Confirmation link expired.")
    #except jwt.InvalidTokenError:
    #    raise HTTPException(status_code=400, detail="Invalid confirmation link.")


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
        "price": price_data.price_sek,
        "time_start": price_data.time_start,
        "time_end": price_data.time_end
    }


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

    # Current time and time going back one month
    current_time = datetime.now(timezone.utc)
    past_month = current_time - timedelta(days=30)

    # All prices within the last month
    query_prices = text("""
            SELECT price_sek FROM price_data 
            WHERE zone = :zone 
            AND time_start BETWEEN :past_month_unix AND :current_time_unix
        """)
    result = db.execute(query_prices, {
        "zone": zone,
        "past_month_unix": int(past_month.timestamp()),
        "current_time_unix": int(current_time.timestamp())
    }).fetchall()

    if not result:
        raise HTTPException(status_code=404, detail="No price data for the last month in this zone.")

    # Convert query to floats
    prices = [float(row[0]) for row in result]

    # Return the prices, high and low quartiles
    return {
        "high": float(np.percentile(prices, 75)),
        "low": float(np.percentile(prices, 25))
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