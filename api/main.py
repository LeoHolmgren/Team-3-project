from fastapi import FastAPI
from routes import router
from database import engine  # Still import engine for the database connection

# FastAPI application instance
app = FastAPI()

# router for API endpoints
app.include_router(router)

# Root endpoint
@app.get("/")
async def read_root():
    return {"message": "Welcome to the Price Data API!"}


