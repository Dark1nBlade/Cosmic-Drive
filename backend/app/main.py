from fastapi import FastAPI
from .api import edges, policies, tests

app = FastAPI(title="Unified SD-WAN Platform API")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Unified SD-WAN Platform API"}

app.include_router(edges.router, prefix="/api/edges", tags=["edges"])
app.include_router(policies.router, prefix="/api/policies", tags=["policies"])
app.include_router(tests.router, prefix="/api/tests", tags=["tests"])
