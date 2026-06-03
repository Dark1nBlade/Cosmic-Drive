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
    transport = Column(String) # mpls, broadband, lte, 5g
    provider = Column(String)
    circuit_id = Column(String)
    bandwidth_up = Column(Float) # in Mbps
    bandwidth_down = Column(Float)

    device = relationship("EdgeDevice", back_populates="wan_links")

class Overlay(Base):
    __tablename__ = "overlays"

    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(Integer, ForeignKey("edge_devices.id"))
    color = Column(String)
    encryption_domain = Column(String)
    auth_type = Column(String) # psk, certificate

    device = relationship("EdgeDevice", back_populates="overlays")

class Policy(Base):
    __tablename__ = "policies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)
    definition = Column(JSON) # Stores traffic steering, SLA, security rules
    created_at = Column(DateTime, default=datetime.utcnow)

class TestResult(Base):
    __tablename__ = "test_results"

    id = Column(Integer, primary_key=True, index=True)
    source_device_id = Column(Integer, ForeignKey("edge_devices.id"))
    target_device_id = Column(Integer, ForeignKey("edge_devices.id"))
    test_type = Column(String) # ping, iperf, http
    latency = Column(Float)
    jitter = Column(Float)
    loss = Column(Float)
    throughput = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)
