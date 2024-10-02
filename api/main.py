from fastapi import FastAPI
from api.routes import router

# FastAPI application instance
app = FastAPI()

# router for API endpoints
app.include_router(router)

# Root endpoint
@app.get("/")
async def read_root():
    return {"message": "Welcome to the Price Data API!"}


