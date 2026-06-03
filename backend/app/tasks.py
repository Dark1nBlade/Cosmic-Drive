from celery import Celery
import os
import time
import random
from datetime import datetime
from .models import models
from .core.database import SessionLocal

CELERY_BROKER_URL = os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/0")
CELERY_RESULT_BACKEND = os.getenv("CELERY_RESULT_BACKEND", "redis://localhost:6379/0")

celery_app = Celery("tasks", broker=CELERY_BROKER_URL, backend=CELERY_RESULT_BACKEND)

@celery_app.task
def run_synthetic_probe(source_id: int, target_id: int, test_type: str):
    time.sleep(2)
    latency = random.uniform(10, 150)
    jitter = random.uniform(2, 20)
    loss = random.choice([0, 0, 0, 0.1, 0.5])

    db = SessionLocal()
    try:
        result = models.TestResult(
            source_device_id=source_id,
            target_device_id=target_id,
            test_type=test_type,
            latency=latency,
            jitter=jitter,
            loss=loss
        )
        db.add(result)

        edge = db.query(models.EdgeDevice).filter(models.EdgeDevice.id == source_id).first()
        if edge:
            if loss > 0 or latency > 100:
                edge.health_score = max(0, edge.health_score - 5)
            else:
                edge.health_score = min(100, edge.health_score + 2)

        db.commit()
    finally:
        db.close()
    return {"status": "success", "latency": latency}

@celery_app.task
def deploy_policy_task(policy_id: int, edge_ids: list):
    db = SessionLocal()
    try:
        policy = db.query(models.Policy).filter(models.Policy.id == policy_id).first()
        if not policy: return "Policy not found"

        policy.status = models.PolicyStatus.DEPLOYING
        db.commit()

        success_count = 0
        for edge_id in edge_ids:
            edge = db.query(models.EdgeDevice).filter(models.EdgeDevice.id == edge_id).first()
            if edge:
                # Simulate vendor API latency
                time.sleep(1)
                success_count += 1

        policy.status = models.PolicyStatus.DEPLOYED
        policy.last_deployed_at = datetime.utcnow()
        db.commit()

        return f"Policy {policy.name} deployed to {success_count} edges"
    except Exception as e:
        if policy:
            policy.status = models.PolicyStatus.FAILED
            db.commit()
        return f"Policy deployment failed: {str(e)}"
    finally:
        db.close()
