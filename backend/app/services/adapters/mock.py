from typing import List, Dict, Any
from .base import BaseVendorAdapter
from ...schemas import schemas
from ...models.models import VendorType

class MockAdapter(BaseVendorAdapter):
    def authenticate(self, credentials: Dict[str, Any]) -> bool:
        return credentials.get("username") != "fail"

    def get_edges(self) -> List[schemas.EdgeDeviceCreate]:
        return [
            schemas.EdgeDeviceCreate(
                uuid="mock-edge-1",
                hostname="Branch-1-Mock",
                site_id="Site-1",
                vendor_type=VendorType.MOCK,
                model="Virtual-Edge",
                serial="SN123456789",
                latitude=37.7749,
                longitude=-122.4194
            )
        ]

    def get_wan_links(self, edge_uuid: str) -> List[schemas.WANLinkCreate]:
        return [
            schemas.WANLinkCreate(
                transport="mpls",
                provider="AT&T",
                circuit_id="CKT-001",
                bandwidth_up=100.0,
                bandwidth_down=100.0
            )
        ]

    def get_overlays(self, edge_uuid: str) -> List[schemas.OverlayCreate]:
        return [
            schemas.OverlayCreate(
                color="gold",
                encryption_domain="global",
                auth_type="psk"
            )
        ]

    def deploy_policy(self, edge_uuid: str, policy: schemas.PolicyCreate) -> bool:
        return True

    def get_telemetry(self, edge_uuid: str) -> Dict[str, Any]:
        return {"health": 95}
