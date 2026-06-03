from typing import List
import httpx
from .base import BaseVendorAdapter
from ...schemas import schemas
from ...models.models import VendorType

class CiscoVManageAdapter(BaseVendorAdapter):
    def __init__(self, host="vmanage.local", username="admin", password="password"):
        self.host = host
        self.username = username
        self.password = password

    async def get_edges(self) -> List[schemas.EdgeDeviceCreate]:
        # Simulated Cisco API call
        return [
            schemas.EdgeDeviceCreate(
                uuid="cisco-edge-1",
                hostname="Branch-Cisco-1",
                site_id="Site-10",
                vendor_type=VendorType.CISCO,
                model="vEdge-100",
                serial="C123",
                latitude=45.0,
                longitude=-90.0
            )
        ]

    async def get_edge_details(self, uuid: str):
        return {"status": "up"}

    async def deploy_policy(self, edge_uuid: str, policy: schemas.PolicyCreate):
        return {"status": "success"}

    async def get_wan_links(self, edge_uuid: str) -> List[schemas.WANLinkCreate]:
        return [
            schemas.WANLinkCreate(transport="mpls", provider="ATT", circuit_id="ATT-1", bandwidth_up=100, bandwidth_down=100)
        ]

    async def get_overlays(self, edge_uuid: str) -> List[schemas.OverlayCreate]:
        return [
            schemas.OverlayCreate(color="gold", encryption_domain="global", auth_type="psk")
        ]

class VeloCloudOrchestratorAdapter(BaseVendorAdapter):
    def __init__(self, host="vco.local", token="token"):
        self.host = host
        self.token = token

    async def get_edges(self) -> List[schemas.EdgeDeviceCreate]:
        # Simulated VeloCloud API call
        return [
            schemas.EdgeDeviceCreate(
                uuid="velo-edge-1",
                hostname="Branch-Velo-1",
                site_id="Site-20",
                vendor_type=VendorType.VELOCLOUD,
                model="Edge-510",
                serial="V123",
                latitude=46.0,
                longitude=-91.0
            )
        ]

    async def get_edge_details(self, uuid: str):
        return {"status": "connected"}

    async def deploy_policy(self, edge_uuid: str, policy: schemas.PolicyCreate):
        return {"status": "success"}

    async def get_wan_links(self, edge_uuid: str) -> List[schemas.WANLinkCreate]:
        return [
            schemas.WANLinkCreate(transport="broadband", provider="Comcast", circuit_id="CC-1", bandwidth_up=1000, bandwidth_down=100)
        ]

    async def get_overlays(self, edge_uuid: str) -> List[schemas.OverlayCreate]:
        return [
            schemas.OverlayCreate(color="silver", encryption_domain="enterprise", auth_type="certificate")
        ]
