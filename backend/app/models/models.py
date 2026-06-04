from sqlalchemy import Column, Integer, String, Float, ForeignKey, JSON, Enum, DateTime, Table
from sqlalchemy.orm import relationship, declarative_base
import enum
from datetime import datetime

Base = declarative_base()

class VendorType(str, enum.Enum):
    CISCO = "cisco"
    VELOCLOUD = "velocloud"
    FORTINET = "fortinet"
    PALO_ALTO = "palo_alto"
    JUNIPER = "juniper"
    SILVER_PEAK = "silver_peak"
    VERSA = "versa"
    MOCK = "mock"

class DeviceStatus(str, enum.Enum):
    PENDING = "pending"
    STAGING = "staging"
    PRODUCTION = "production"
    VALIDATED = "validated"

class PolicyStatus(str, enum.Enum):
    DRAFT = "draft"
    DEPLOYING = "deploying"
    DEPLOYED = "deployed"
    FAILED = "failed"

class ControllerStatus(str, enum.Enum):
    ONLINE = "online"
    OFFLINE = "offline"
    ERROR = "error"

class Controller(Base):
    __tablename__ = "controllers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    vendor_type = Column(Enum(VendorType))
    hostname = Column(String)
    port = Column(Integer, default=443)
    username = Column(String, nullable=True)
    password = Column(String, nullable=True)  # Should be encrypted
    api_key = Column(String, nullable=True)   # Should be encrypted
    use_ssl = Column(String, default="true")
    verify_ssl = Column(String, default="true")
    proxy_url = Column(String, nullable=True)
    status = Column(Enum(ControllerStatus), default=ControllerStatus.OFFLINE)
    last_sync = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class EdgeDevice(Base):
    __tablename__ = "edge_devices"

    id = Column(Integer, primary_key=True, index=True)
    uuid = Column(String, unique=True, index=True)
    hostname = Column(String)
    site_id = Column(String, index=True)
    vendor_type = Column(Enum(VendorType))
    model = Column(String)
    serial = Column(String)
    status = Column(Enum(DeviceStatus), default=DeviceStatus.PENDING)
    health_score = Column(Integer, default=100)
    latitude = Column(Float)
    longitude = Column(Float)

    wan_links = relationship("WANLink", back_populates="device")
    overlays = relationship("Overlay", back_populates="device")

class WANLink(Base):
    __tablename__ = "wan_links"

    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(Integer, ForeignKey("edge_devices.id"))
    transport = Column(String)
    provider = Column(String)
    circuit_id = Column(String)
    bandwidth_up = Column(Float)
    bandwidth_down = Column(Float)

    device = relationship("EdgeDevice", back_populates="wan_links")

class Overlay(Base):
    __tablename__ = "overlays"

    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(Integer, ForeignKey("edge_devices.id"))
    color = Column(String)
    encryption_domain = Column(String)
    auth_type = Column(String)

    device = relationship("EdgeDevice", back_populates="overlays")

class Policy(Base):
    __tablename__ = "policies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)
    definition = Column(JSON)
    status = Column(Enum(PolicyStatus), default=PolicyStatus.DRAFT)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_deployed_at = Column(DateTime, nullable=True)

class TestResult(Base):
    __tablename__ = "test_results"

    id = Column(Integer, primary_key=True, index=True)
    source_device_id = Column(Integer, ForeignKey("edge_devices.id"))
    target_device_id = Column(Integer, ForeignKey("edge_devices.id"))
    test_type = Column(String)
    latency = Column(Float)
    jitter = Column(Float)
    loss = Column(Float)
    throughput = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)
