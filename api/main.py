from fastapi import FastAPI
from routes import router
from fastapi.middleware.cors import CORSMiddleware

# FastAPI application instance
app = FastAPI()

# router for API endpoints
app.include_router(router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint
@app.get("/")
async def read_root():
    return {"message": "Welcome to the Price Data API!"}

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app)


