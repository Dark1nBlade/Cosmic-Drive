from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime
from ..models.models import VendorType, DeviceStatus

class WANLinkBase(BaseModel):
    transport: str
    provider: str
    circuit_id: str
    bandwidth_up: float
    bandwidth_down: float

class WANLinkCreate(WANLinkBase):
    pass

class WANLink(WANLinkBase):
    id: int
    device_id: int
    model_config = ConfigDict(from_attributes=True)

class OverlayBase(BaseModel):
    color: str
    encryption_domain: str
    auth_type: str

class OverlayCreate(OverlayBase):
    pass

class Overlay(OverlayBase):
    id: int
    device_id: int
    model_config = ConfigDict(from_attributes=True)

class EdgeDeviceBase(BaseModel):
    uuid: str
    hostname: str
    site_id: str
    vendor_type: VendorType
    model: str
    serial: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class EdgeDeviceCreate(EdgeDeviceBase):
    pass

class EdgeDevice(EdgeDeviceBase):
    id: int
    status: DeviceStatus
    health_score: int
    wan_links: List[WANLink] = []
    overlays: List[Overlay] = []
    model_config = ConfigDict(from_attributes=True)

class PolicyBase(BaseModel):
    name: str
    description: Optional[str] = None
    definition: dict

class PolicyCreate(PolicyBase):
    pass

class Policy(PolicyBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class TestResultBase(BaseModel):
    source_device_id: int
    target_device_id: int
    test_type: str
    latency: Optional[float] = None
    jitter: Optional[float] = None
    loss: Optional[float] = None
    throughput: Optional[float] = None

class TestResult(TestResultBase):
    id: int
    timestamp: datetime
    model_config = ConfigDict(from_attributes=True)
