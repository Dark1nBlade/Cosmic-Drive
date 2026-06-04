from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from .api import edges, policies, tests, controllers
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Unified SD-WAN Platform API")

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global error: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"message": "Internal Server Error", "detail": str(exc)},
    )

@app.get("/")
def read_root():
    return {"message": "Welcome to the Unified SD-WAN Platform API"}

app.include_router(edges.router, prefix="/api/edges", tags=["edges"])
app.include_router(policies.router, prefix="/api/policies", tags=["policies"])
app.include_router(tests.router, prefix="/api/tests", tags=["tests"])
app.include_router(controllers.router, prefix="/api/controllers", tags=["controllers"])
