from fastapi import Depends
from sqlalchemy import text
from sqlalchemy.orm import Session
from apscheduler.schedulers.background import BackgroundScheduler
from api.routes import get_price_levels, get_db
from datetime import datetime

def when_to_notify(zone: str, db: Session = Depends(get_db)):
    try:
        # this gets the high price of the last month
        price_levels = get_price_levels(zone=zone, db=db)
        high_price_last_month = price_levels["priceLevels"]["high"]
        
        current_time = datetime.utcnow()
        # this gets the prices for today
        query_daily_prices = text("""
            SELECT price_sek, time_start
            FROM price_data 
            WHERE zone = :zone 
            AND time_start >= :current_time
            ORDER BY time_start ASC 
        """)
       daily_prices_result = db.execute(query_daily_prices, {"zone": zone, "current_date": current_date}).fetchall()
        if daily_prices_result:
            # Extract prices and their corresponding timestamps
            daily_prices = [(float(price[0]), price[1]) for price in daily_prices_result]  # Assuming price[1] is the timestamp
            high_price_today, high_price_time = max(daily_prices, key=lambda x: x[0])  # Get the highest price and its time
            logger.info(f"High price in zone {zone} for today: {high_price_today} SEK at {high_price_time}")

            # Check if today's high price exceeds last month's high price
            if high_price_today > high_price_last_month:
                send_email(high_price_today, high_price_time)  # Replace with the actual email address

        else:
            logger.warning(f"No price data found for zone {zone} on {current_date}.")
    except Exception as e:
        logger.error(f"Error en when_to_notify: {str(e)}")

    # Schedule the price check every day at 8:00 AM UTC
    def start_scheduler(zone: str, db: Session = Depends(get_db)):
    scheduler = BackgroundScheduler()
    scheduler.add_job(
        func=when_to_notify,
        trigger=CronTrigger(hour=8, minute=0),
        args=[zone, db]
    )
    scheduler.start()
