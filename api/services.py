from fastapi import Depends
from sqlalchemy import text
from sqlalchemy.orm import Session
from apscheduler.schedulers.background import BackgroundScheduler
from api.routes import get_price_levels, get_db

def when_to_notify(zone: str, db: Session = Depends(get_db)):
    # this gets the high price of the last month
    price_levels = get_price_levels(zone=zone, db=db)
    high_price_last_month = price_levels["priceLevels"]["high"]

    # this gets the current price
    query_current_price = text("""
            SELECT price_sek FROM price_data 
            WHERE zone = :zone 
            ORDER BY time_start DESC 
            LIMIT 1
        """)
    current_price_result = db.execute(query_current_price, {"zone": zone}).fetchone()

    if current_price_result:
        current_price = float(current_price_result[0])
        print(f"Current price in zone {zone}: {current_price} SEK")

    # here we compere and if the current price is higher than the high price of the last month we send an email
    if current_price > high_price_last_month:
        # SEND THE EMAIL
        print(f"Current price in zone {zone} is higher than the high price of the last month!")


# Schedule the price check
def start_scheduler(zone: str, db: Session = Depends(get_db)):
    scheduler = BackgroundScheduler()
    scheduler.add_job(func=when_to_notify, trigger="interval", minutes=10, args=[zone, db])
    scheduler.start()
