from fastapi import FastAPI
from api.routes import router

app = FastAPI(
    title="KC LCD Module Cost Logic Engine",
    version="v1.0"
)

app.include_router(router)
