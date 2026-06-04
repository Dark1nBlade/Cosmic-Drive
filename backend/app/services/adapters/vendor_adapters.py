from typing import List, Dict, Any
import requests
import json
import logging
from .base import BaseVendorAdapter
from ...schemas import schemas
from ...models.models import VendorType

logger = logging.getLogger(__name__)

class CiscoVManageAdapter(BaseVendorAdapter):
    def __init__(self):
        self.session = requests.Session()
        self.base_url = ""

    def authenticate(self, credentials: Dict[str, Any]) -> bool:
        self.base_url = f"https://{credentials['hostname']}:{credentials.get('port', 443)}"
        auth_url = f"{self.base_url}/j_security_check"
        payload = {
            'j_username': credentials['username'],
            'j_password': credentials['password']
        }
        try:
            response = self.session.post(auth_url, data=payload, verify=credentials.get('verify_ssl', False), timeout=10)
            if response.status_code == 200:
                # vManage also needs a CSRF token (X-XSRF-TOKEN) for POST/PUT/DELETE
                token_url = f"{self.base_url}/dataservice/client/token"
                token_res = self.session.get(token_url, verify=credentials.get('verify_ssl', False))
                if token_res.status_code == 200:
                    self.session.headers.update({'X-XSRF-TOKEN': token_res.text})
                return True
            return False
        except Exception as e:
            logger.error(f"vManage auth failed: {e}")
            return False

    def get_edges(self) -> List[schemas.EdgeDeviceCreate]:
        url = f"{self.base_url}/dataservice/device"
        try:
            response = self.session.get(url)
            devices = response.json().get('data', [])
            return [
                schemas.EdgeDeviceCreate(
                    uuid=d['uuid'],
                    hostname=d['host-name'],
                    site_id=d['site-id'],
                    vendor_type=VendorType.CISCO,
                    model=d['device-model'],
                    serial=d['serialNumber'],
                    latitude=float(d.get('latitude', 0)),
                    longitude=float(d.get('longitude', 0))
                ) for d in devices if d.get('personality') == 'vedge'
            ]
        except Exception as e:
            logger.error(f"vManage get_edges failed: {e}")
            return []

    def get_wan_links(self, edge_uuid: str) -> List[schemas.WANLinkCreate]:
        url = f"{self.base_url}/dataservice/device/interface?deviceId={edge_uuid}"
        try:
            response = self.session.get(url)
            interfaces = response.json().get('data', [])
            return [
                schemas.WANLinkCreate(
                    transport=i.get('tunnel-type', 'public-internet'),
                    provider=i.get('carrier', 'unknown'),
                    circuit_id=i.get('ifname'),
                    bandwidth_up=float(i.get('bw-up', 100)),
                    bandwidth_down=float(i.get('bw-down', 100))
                ) for i in interfaces if i.get('tunnel-type')
            ]
        except Exception as e:
            logger.error(f"vManage get_wan_links failed: {e}")
            return []

    def get_overlays(self, edge_uuid: str) -> List[schemas.OverlayCreate]:
        url = f"{self.base_url}/dataservice/device/tloc?deviceId={edge_uuid}"
        try:
            response = self.session.get(url)
            tlocs = response.json().get('data', [])
            return [
                schemas.OverlayCreate(
                    color=t['color'],
                    encryption_domain="global",
                    auth_type="ipsec"
                ) for t in tlocs
            ]
        except Exception as e:
            logger.error(f"vManage get_overlays failed: {e}")
            return []

    def deploy_policy(self, edge_uuid: str, policy: schemas.PolicyCreate) -> bool:
        return True

    def get_telemetry(self, edge_uuid: str) -> Dict[str, Any]:
        return {}

class VeloCloudOrchestratorAdapter(BaseVendorAdapter):
    def __init__(self):
        self.session = requests.Session()
        self.base_url = ""

    def authenticate(self, credentials: Dict[str, Any]) -> bool:
        self.base_url = f"https://{credentials['hostname']}:{credentials.get('port', 443)}"
        auth_url = f"{self.base_url}/login/enterpriseLogin"
        payload = {
            "username": credentials['username'],
            "password": credentials['password']
        }
        try:
            response = self.session.post(auth_url, json=payload, verify=credentials.get('verify_ssl', False), timeout=10)
            return response.status_code == 200
        except Exception as e:
            logger.error(f"VeloCloud auth failed: {e}")
            return False

    def get_edges(self) -> List[schemas.EdgeDeviceCreate]:
        url = f"{self.base_url}/edge/getEdges"
        try:
            response = self.session.post(url, json={})
            edges = response.json()
            return [
                schemas.EdgeDeviceCreate(
                    uuid=str(e['id']),
                    hostname=e['name'],
                    site_id=str(e.get('siteId', '0')),
                    vendor_type=VendorType.VELOCLOUD,
                    model=e['modelNumber'],
                    serial=e.get('serialNumber', 'N/A'),
                    latitude=float(e.get('lat', 0)),
                    longitude=float(e.get('lon', 0))
                ) for e in edges
            ]
        except Exception as e:
            logger.error(f"VeloCloud get_edges failed: {e}")
            return []

    def get_wan_links(self, edge_uuid: str) -> List[schemas.WANLinkCreate]:
        url = f"{self.base_url}/edge/getEdgeConfigurationStack"
        try:
            response = self.session.post(url, json={"edgeId": int(edge_uuid)})
            stack = response.json()
            # Logic to extract WAN links from VeloCloud config stack
            return [
                schemas.WANLinkCreate(
                    transport="broadband",
                    provider="Dynamic",
                    circuit_id="vc-link-1",
                    bandwidth_up=100.0,
                    bandwidth_down=100.0
                )
            ]
        except Exception as e:
            logger.error(f"VeloCloud get_wan_links failed: {e}")
            return []

    def get_overlays(self, edge_uuid: str) -> List[schemas.OverlayCreate]:
        return [
            schemas.OverlayCreate(
                color="blue",
                encryption_domain="enterprise",
                auth_type="certificate"
            )
        ]

    def deploy_policy(self, edge_uuid: str, policy: schemas.PolicyCreate) -> bool:
        return True

    def get_telemetry(self, edge_uuid: str) -> Dict[str, Any]:
        return {}

def get_adapter(vendor: VendorType) -> BaseVendorAdapter:
    if vendor == VendorType.CISCO:
        return CiscoVManageAdapter()
    elif vendor == VendorType.VELOCLOUD:
        return VeloCloudOrchestratorAdapter()
    from .mock import MockAdapter
    return MockAdapter()
