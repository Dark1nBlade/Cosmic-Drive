from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from ..schemas import schemas
from ..models import models
from ..core.database import get_db
from ..services.discovery import discover_and_sync_edges
from ..services.adapters.mock import MockAdapter
from ..services.adapters.vendor_adapters import CiscoVManageAdapter, VeloCloudOrchestratorAdapter

router = APIRouter()

@router.get("/", response_model=List[schemas.EdgeDevice])
def get_edges(db: Session = Depends(get_db)):
    return db.query(models.EdgeDevice).all()

@router.get("/{edge_id}", response_model=schemas.EdgeDevice)
def get_edge(edge_id: int, db: Session = Depends(get_db)):
    edge = db.query(models.EdgeDevice).filter(models.EdgeDevice.id == edge_id).first()
    if not edge: raise HTTPException(status_code=404, detail="Edge not found")
    return edge

@router.post("/sync")
async def sync_edges(vendor_type: Optional[str] = "mock", db: Session = Depends(get_db)):
    if vendor_type == "cisco":
        adapter = CiscoVManageAdapter()
    elif vendor_type == "velocloud":
        adapter = VeloCloudOrchestratorAdapter()
    else:
        adapter = MockAdapter()

    return await discover_and_sync_edges(db, adapter)
