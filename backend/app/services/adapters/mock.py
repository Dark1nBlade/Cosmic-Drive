from typing import List
from .base import BaseVendorAdapter
from ...schemas import schemas
from ...models.models import VendorType

class MockAdapter(BaseVendorAdapter):
    async def get_edges(self) -> List[schemas.EdgeDeviceCreate]:
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
            ),
            schemas.EdgeDeviceCreate(
                uuid="mock-edge-2",
                hostname="Hub-US-East-Mock",
                site_id="Hub-1",
                vendor_type=VendorType.MOCK,
                model="High-Perf-Hub",
                serial="SN987654321",
                latitude=40.7128,
                longitude=-74.0060
            )
        ]

    async def get_edge_details(self, uuid: str):
        return {"status": "online", "version": "1.0.0-mock"}

    async def deploy_policy(self, edge_uuid: str, policy: schemas.PolicyCreate):
        return {"status": "success", "message": f"Policy {policy.name} deployed to {edge_uuid}"}

    async def get_wan_links(self, edge_uuid: str) -> List[schemas.WANLinkCreate]:
        return [
            schemas.WANLinkCreate(
                transport="mpls",
                provider="AT&T",
                circuit_id="CKT-001",
                bandwidth_up=100.0,
                bandwidth_down=100.0
            ),
            schemas.WANLinkCreate(
                transport="broadband",
                provider="Comcast",
                circuit_id="CKT-002",
                bandwidth_up=1000.0,
                bandwidth_down=100.0
            )
        ]

    async def get_overlays(self, edge_uuid: str) -> List[schemas.OverlayCreate]:
        return [
            schemas.OverlayCreate(
                color="gold",
                encryption_domain="global",
                auth_type="psk"
            )
        ]
