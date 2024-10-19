import jwt
from fastapi import Depends, HTTPException, logger
from sqlalchemy import text
from sqlalchemy.orm import Session
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from api.routes import get_price_levels, get_db, get_emails_by_zone
from datetime import datetime, timedelta
import time
import smtplib
from email.mime.text import MIMEText



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
        daily_prices_result = db.execute(query_daily_prices, {"zone": zone, "current_date": current_time_unix}).fetchall()
        if daily_prices_result:
            # Extract prices and their corresponding timestamps
            daily_prices = [(float(price[0]), price[1]) for price in daily_prices_result]  # Assuming price[1] is the timestamp
            high_price_today, high_price_time = max(daily_prices, key=lambda x: x[0])  # Get the highest price and its time
            logger.info(f"High price in zone {zone} for today: {high_price_today} SEK at {high_price_time}")
    
            # Check if today's high price exceeds last month's high price
            if high_price_today > high_price_last_month:
                # Get emails of subscribers in the specified zone
                emails = get_emails_by_zone(zone=zone, db=db)
                
                # Prepare email details
                subject = f"High Electricity Price Alert for {zone}"
                body = "The electricity price has exceeded last month's high price."
    
                # Schedule email sending for the time of the peak price
                schedule_email_once(emails, subject, body, high_price_today, high_price_time)
    
        else:
            logger.warning(f"No price data found for zone {zone} on {current_date}.")
    except Exception as e:
        logger.error(f"Error en when_to_notify: {str(e)}")

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

# Schedule the price check every day at 8:00 AM UTC
def start_scheduler(zone: str, db: Session = Depends(get_db)):
    scheduler_check = BackgroundScheduler()
    scheduler_check.add_job(
        func=when_to_notify,
        trigger=CronTrigger(hour=8, minute=0),
        args=[zone, db]
    )
    scheduler_check.start()

# Function to schedule an email at a specific time
def schedule_email_once(to_addresses: list, subject: str, body: str, price: float, schedule_time: datetime):
    scheduler = BackgroundScheduler()  # Make sure to use the same scheduler instance as above
    for to_address in to_addresses:
        scheduler.add_job(send_email, 'date', run_date=schedule_time, args=[to_address, subject, body, price])
        logger.info(f"Email scheduled for {to_address} at {schedule_time}")

    return {"message": "Emails scheduled", "time": schedule_time, "price": price}

# Logic for confirmation mail
# JWT Secret and Config
SECRET_KEY = "your_jwt_secret_key"
ALGORITHM = "HS256"
CONFIRMATION_TOKEN_EXPIRE_MINUTES = 60 * 24  # Token valid for 24 hours


# Function to generate confirmation token
def generate_confirmation_token(email: str, zone: str) -> str:
    expiration = datetime.utcnow() + timedelta(minutes=CONFIRMATION_TOKEN_EXPIRE_MINUTES)
    to_encode = {"sub": email, "zone": zone, "exp": expiration}
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# Function to send confirmation email
def send_confirmation_email(email: str, zone: str):
    token = generate_confirmation_token(email, zone)
    confirmation_link = f"http://yourdomain.com/confirm?token={token}"

    subject = "Please Confirm Your Subscription"
    body = f"Click the following link to confirm your subscription for zone {zone}: {confirmation_link}"

    send_email(to_address=email, subject=subject, body=body, price=None)
