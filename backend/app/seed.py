from .core.database import SessionLocal, init_db
from .models import models
from .schemas import schemas
from .models.models import VendorType, DeviceStatus

def seed_demo_data():
    db = SessionLocal()

    # 1. Hubs
    hubs = [
        {"uuid": "hub-us-east", "hostname": "Hub-US-East", "site_id": "DC-1", "vendor_type": VendorType.CISCO, "model": "vEdge-5000", "serial": "HUB001", "lat": 38.8951, "lng": -77.0364},
        {"uuid": "hub-us-west", "hostname": "Hub-US-West", "site_id": "DC-2", "vendor_type": VendorType.VELOCLOUD, "model": "Edge-3800", "serial": "HUB002", "lat": 34.0522, "lng": -118.2437},
        {"uuid": "hub-eu-central", "hostname": "Hub-EU-Central", "site_id": "DC-3", "vendor_type": VendorType.CISCO, "model": "vEdge-5000", "serial": "HUB003", "lat": 50.1109, "lng": 8.6821}
    ]

    db_hubs = []
    for hub_data in hubs:
        hub = models.EdgeDevice(
            uuid=hub_data["uuid"],
            hostname=hub_data["hostname"],
            site_id=hub_data["site_id"],
            vendor_type=hub_data["vendor_type"],
            model=hub_data["model"],
            serial=hub_data["serial"],
            latitude=hub_data["lat"],
            longitude=hub_data["lng"],
            status=DeviceStatus.PRODUCTION
        )
        db.add(hub)
        db_hubs.append(hub)

    db.commit()

    # 2. Branches
    for i in range(1, 11):
        vendor = VendorType.CISCO if i % 2 == 0 else VendorType.VELOCLOUD
        branch = models.EdgeDevice(
            uuid=f"branch-{i}",
            hostname=f"Branch-{i}",
            site_id=f"Site-{100+i}",
            vendor_type=vendor,
            model="vEdge-100" if vendor == VendorType.CISCO else "Edge-510",
            serial=f"BR{1000+i}",
            latitude=30.0 + i,
            longitude=-100.0 + i,
            status=DeviceStatus.PRODUCTION
        )
        db.add(branch)
        db.flush()

        # Add WAN links
        db.add(models.WANLink(device_id=branch.id, transport="mpls", provider="Verizon", circuit_id=f"VZ-{i}", bandwidth_up=100, bandwidth_down=100))
        db.add(models.WANLink(device_id=branch.id, transport="broadband", provider="Comcast", circuit_id=f"CC-{i}", bandwidth_up=1000, bandwidth_down=100))

    # 3. Policies
    db.add(models.Policy(
        name="M365-Priority",
        description="Prioritize Microsoft 365 traffic over Broadband",
        definition={
            "app": "Microsoft 365",
            "sla": {"latency": 150, "loss": 1},
            "steering": {"primary": "broadband", "fallback": "mpls"}
        }
    ))

    db.add(models.Policy(
        name="Voice-SLA",
        description="Strict SLA for VoIP traffic",
        definition={
            "app": "VoIP",
            "sla": {"latency": 50, "jitter": 20, "loss": 0.5},
            "steering": {"primary": "mpls", "fallback": "broadband"}
        }
    ))

    db.commit()
    db.close()

if __name__ == "__main__":
    init_db()
    seed_demo_data()
    print("Demo data seeded.")
