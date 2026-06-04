from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from ..schemas import schemas
from ..models import models
from ..core.database import get_db

router = APIRouter()

@router.get("/", response_model=List[schemas.EdgeDevice])
def get_edges(db: Session = Depends(get_db)):
    return db.query(models.EdgeDevice).all()

@router.get("/{edge_id}", response_model=schemas.EdgeDevice)
def get_edge(edge_id: int, db: Session = Depends(get_db)):
    edge = db.query(models.EdgeDevice).filter(models.EdgeDevice.id == edge_id).first()
    if not edge: raise HTTPException(status_code=404, detail="Edge not found")
    return edge
