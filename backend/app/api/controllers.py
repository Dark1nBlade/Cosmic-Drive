from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from ..core.database import get_db
from ..models import models
from ..schemas import schemas
from ..services.adapters.vendor_adapters import get_adapter
from ..tasks import sync_controller_task
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/", response_model=List[schemas.Controller])
def get_controllers(db: Session = Depends(get_db)):
    return db.query(models.Controller).all()

@router.post("/", response_model=schemas.Controller)
def create_controller(controller: schemas.ControllerCreate, db: Session = Depends(get_db)):
    db_controller = models.Controller(**controller.model_dump())
    db.add(db_controller)
    db.commit()
    db.refresh(db_controller)
    return db_controller

@router.get("/{controller_id}", response_model=schemas.Controller)
def get_controller(controller_id: int, db: Session = Depends(get_db)):
    db_controller = db.query(models.Controller).filter(models.Controller.id == controller_id).first()
    if not db_controller:
        raise HTTPException(status_code=404, detail="Controller not found")
    return db_controller

@router.delete("/{controller_id}")
def delete_controller(controller_id: int, db: Session = Depends(get_db)):
    db_controller = db.query(models.Controller).filter(models.Controller.id == controller_id).first()
    if not db_controller:
        raise HTTPException(status_code=404, detail="Controller not found")
    db.delete(db_controller)
    db.commit()
    return {"message": "Controller deleted"}

@router.post("/{controller_id}/test")
def test_controller_connection(controller_id: int, db: Session = Depends(get_db)):
    db_controller = db.query(models.Controller).filter(models.Controller.id == controller_id).first()
    if not db_controller:
        raise HTTPException(status_code=404, detail="Controller not found")

    adapter = get_adapter(db_controller.vendor_type)
    try:
        # Pass credentials directly for testing
        success = adapter.authenticate({
            "hostname": db_controller.hostname,
            "port": db_controller.port,
            "username": db_controller.username,
            "password": db_controller.password,
            "api_key": db_controller.api_key,
            "verify_ssl": db_controller.verify_ssl == "true"
        })
        if success:
            db_controller.status = models.ControllerStatus.ONLINE
            db.commit()
            return {"status": "success", "message": "Connection validated"}
        else:
            db_controller.status = models.ControllerStatus.ERROR
            db.commit()
            return {"status": "error", "message": "Authentication failed"}
    except Exception as e:
        logger.error(f"Failed to test connection: {e}")
        db_controller.status = models.ControllerStatus.ERROR
        db.commit()
        return {"status": "error", "message": str(e)}

@router.post("/{controller_id}/sync")
def sync_controller(controller_id: int, db: Session = Depends(get_db)):
    db_controller = db.query(models.Controller).filter(models.Controller.id == controller_id).first()
    if not db_controller:
        raise HTTPException(status_code=404, detail="Controller not found")

    sync_controller_task.delay(controller_id)
    return {"message": "Sync started in background"}
