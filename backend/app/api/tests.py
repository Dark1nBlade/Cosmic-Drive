from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..schemas import schemas
from ..models import models
from ..core.database import get_db
from ..tasks import run_synthetic_probe
from ..services.assessment import initiate_fabric_assessment

router = APIRouter()

@router.get("/results", response_model=List[schemas.TestResult])
def get_test_results(db: Session = Depends(get_db)):
    return db.query(models.TestResult).order_by(models.TestResult.timestamp.desc()).limit(100).all()

@router.post("/trigger")
def trigger_test(source_id: int, target_id: int, test_type: str = "ping"):
    task = run_synthetic_probe.delay(source_id, target_id, test_type)
    return {"status": "triggered", "job_id": task.id}

@router.post("/assess")
def assess_fabric(db: Session = Depends(get_db)):
    return initiate_fabric_assessment(db)
