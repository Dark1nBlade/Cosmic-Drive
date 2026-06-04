from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..schemas import schemas
from ..models import models
from ..core.database import get_db
from ..tasks import deploy_policy_task

router = APIRouter()

@router.get("/", response_model=List[schemas.Policy])
def get_policies(db: Session = Depends(get_db)):
    return db.query(models.Policy).all()

@router.post("/", response_model=schemas.Policy)
def create_policy(policy: schemas.PolicyCreate, db: Session = Depends(get_db)):
    db_policy = models.Policy(**policy.model_dump())
    db.add(db_policy)
    db.commit()
    db.refresh(db_policy)
    return db_policy

class DeploymentRequest(schemas.BaseModel):
    edge_ids: List[int] = []

@router.post("/{policy_id}/deploy")
def deploy_policy(policy_id: int, request: DeploymentRequest, db: Session = Depends(get_db)):
    edge_ids = request.edge_ids
    if not edge_ids:
        # If no edge_ids provided, deploy to all devices (simplified logic)
        edge_ids = [e.id for e in db.query(models.EdgeDevice).all()]

    if not edge_ids:
         raise HTTPException(status_code=400, detail="No edge devices available for deployment")

    task = deploy_policy_task.delay(policy_id, edge_ids)
    return {"status": "deployment_started", "job_id": task.id}
