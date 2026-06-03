# Unified SD-WAN Platform

A web-based platform that deploys, manages, and continuously validates multi-vendor SD-WAN fabrics across heterogeneous edge environments.

## Features

- **Multi-Vendor Edge Controller**: Abstracted API layer supporting Cisco vManage and VeloCloud Orchestrator.
- **Interactive Topology Canvas**: Real-time visualization of the SD-WAN fabric including hubs, branches, and overlay tunnels.
- **Unified Policy Engine**: Traffic steering and SLA-based path selection policies.
- **Synthetic Testing**: Continuous validation of fabric health using latency, jitter, and loss probes.
- **Zero-Touch Provisioning (ZTP)**: Standardized device onboarding and configuration management.
- **Configuration Drift Detection**: Automatic identification of config anomalies against golden templates.

## Architecture

- **Frontend**: React with Cytoscape.js for topology visualization and Tailwind CSS for styling.
- **Backend**: FastAPI (Python) providing a RESTful API and vendor abstraction layer.
- **Database**: PostgreSQL (main state) and Redis (task queue).
- **Task Engine**: Celery for asynchronous synthetic probes and policy deployments.
- **Infrastructure**: Containerized with Docker and Docker Compose.

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local frontend development)
- Python 3.11+ (for local backend development)

### Running with Docker Compose

1. Clone the repository.
2. Run the platform:
   ```bash
   docker-compose up --build
   ```
3. Access the web UI at `http://localhost:3000`.
4. Access the API documentation at `http://localhost:8000/docs`.

## Demo Scenario

The platform comes pre-seeded with a demo scenario:
- **3 Hub Sites**: US-East (Cisco), US-West (VeloCloud), EU-Central (Cisco).
- **10 Branch Sites**: Dual WAN links (MPLS + Broadband).
- **SLA Policies**: Voice-SLA (prioritizing MPLS) and M365-Priority (steering to Broadband).

### Synthetic Failover Test
You can trigger a synthetic probe between any two edges via the API or the UI (Sync Inventory) to see real-time health score updates on the topology canvas. Nodes change color based on their calculated health (Green > 80%, Yellow 50-80%, Red < 50%).

## Development

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
export DATABASE_URL=postgresql://user:password@localhost/sdwan
uvicorn app.main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## Vendor Adapters

The platform abstracts vendor-specific logic into `BaseVendorAdapter`. Currently implemented:
- `CiscoVManageAdapter`
- `VeloCloudOrchestratorAdapter`
- `MockAdapter` (used for demo and testing)
