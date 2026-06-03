from sqlalchemy.orm import Session
from ..models import models
from ..tasks import run_synthetic_probe

def initiate_fabric_assessment(db: Session):
    hubs = db.query(models.EdgeDevice).filter(models.EdgeDevice.hostname.ilike('%hub%')).all()
    branches = db.query(models.EdgeDevice).filter(~models.EdgeDevice.hostname.ilike('%hub%')).all()

    tasks = []
    for branch in branches:
        for hub in hubs:
            # Trigger probe from branch to hub
            task = run_synthetic_probe.delay(branch.id, hub.id, "ping")
            tasks.append(task.id)

    return {"status": "assessment_started", "total_probes": len(tasks), "job_ids": tasks}
