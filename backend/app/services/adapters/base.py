from abc import ABC, abstractmethod
from typing import List, Any, Dict
from ...schemas import schemas

class BaseVendorAdapter(ABC):
    @abstractmethod
    def authenticate(self, credentials: Dict[str, Any]) -> bool:
        """Authenticate with the controller."""
        pass

    @abstractmethod
    def get_edges(self) -> List[schemas.EdgeDeviceCreate]:
        """Fetch list of edge devices from the controller."""
        pass

    @abstractmethod
    def get_wan_links(self, edge_uuid: str) -> List[schemas.WANLinkCreate]:
        """Fetch WAN links for a specific device."""
        pass

    @abstractmethod
    def get_overlays(self, edge_uuid: str) -> List[schemas.OverlayCreate]:
        """Fetch overlays for a specific device."""
        pass

    @abstractmethod
    def deploy_policy(self, edge_uuid: str, policy: schemas.PolicyCreate) -> bool:
        """Deploy a policy to an edge device."""
        pass

    @abstractmethod
    def get_telemetry(self, edge_uuid: str) -> Dict[str, Any]:
        """Fetch real-time telemetry/health for an edge device."""
        pass
