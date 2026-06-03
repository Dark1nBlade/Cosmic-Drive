from abc import ABC, abstractmethod
from typing import List
from ...schemas import schemas

class BaseVendorAdapter(ABC):
    @abstractmethod
    async def get_edges(self) -> List[schemas.EdgeDeviceCreate]:
        pass

    @abstractmethod
    async def get_edge_details(self, uuid: str):
        pass

    @abstractmethod
    async def deploy_policy(self, edge_uuid: str, policy: schemas.PolicyCreate):
        pass

    @abstractmethod
    async def get_wan_links(self, edge_uuid: str) -> List[schemas.WANLinkCreate]:
        pass

    @abstractmethod
    async def get_overlays(self, edge_uuid: str) -> List[schemas.OverlayCreate]:
        pass
