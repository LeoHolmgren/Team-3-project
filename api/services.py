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
        
        current_time_unix = int(time.time())
        # this gets the prices for today
        query_daily_prices = text("""
            SELECT price_sek, time_start
            FROM price_data 
            WHERE zone = :zone 
            AND time_start >= :current_time_unix
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


# Function to send the email
def send_email(to_address: str, subject: str, body: str, price: float):
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    sender_email = "team3.projectagile@gmail.com" 
    sender_password = "Team3project"  

    # Include the electricity price in the email message
    body_with_price = f"{body}\n\n CURRENT PRICE HIGH!!! \n The current electricity price is: {price} €/kWh"

    # Prepare the email content
    msg = MIMEText(body_with_price)
    msg["Subject"] = subject
    msg["From"] = sender_email
    msg["To"] = to_address

    # Connect and send the email
    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()  # Start TLS connection
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, [to_address], msg.as_string())
        server.quit()
        print(f"Email sent to {to_address}")
    except Exception as e:
        print(f"Failed to send email: {e}")

# Route to schedule an email with the electricity price
@app.post("/schedule_email_once/")
async def schedule_email_once(to_address: str, subject: str, body: str, price: float, schedule_time: datetime):
    # Ensure the scheduled time is in the future
    if schedule_time <= datetime.now():
        raise HTTPException(status_code=400, detail="Scheduled time must be in the future")

    # Schedule the email to be sent at the specified time with the electricity price
    scheduler.add_job(send_email, 'date', run_date=schedule_time, args=[to_address, subject, body, price])

    return {"message": "Email scheduled", "time": schedule_time, "price": price}
