from sqlalchemy.orm import Session
from .adapters.base import BaseVendorAdapter
from ..models import models
from ..schemas import schemas

def discover_and_sync_edges(db: Session, adapter: BaseVendorAdapter):
    vendor_edges = adapter.get_edges()

    for v_edge in vendor_edges:
        db_edge = db.query(models.EdgeDevice).filter(models.EdgeDevice.uuid == v_edge.uuid).first()

        if not db_edge:
            db_edge = models.EdgeDevice(**v_edge.model_dump())
            db.add(db_edge)
            db.commit()
            db.refresh(db_edge)

        wan_links = adapter.get_wan_links(v_edge.uuid)
        db.query(models.WANLink).filter(models.WANLink.device_id == db_edge.id).delete()
        for link in wan_links:
            db_link = models.WANLink(**link.model_dump(), device_id=db_edge.id)
            db.add(db_link)

        overlays = adapter.get_overlays(v_edge.uuid)
        db.query(models.Overlay).filter(models.Overlay.device_id == db_edge.id).delete()
        for overlay in overlays:
            db_overlay = models.Overlay(**overlay.model_dump(), device_id=db_edge.id)
            db.add(db_overlay)

        db.commit()

    return {"status": "sync_complete", "edges_processed": len(vendor_edges)}
