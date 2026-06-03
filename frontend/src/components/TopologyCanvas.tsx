import React, { useEffect, useState } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import axios from 'axios';

const TopologyCanvas = () => {
  const [elements, setElements] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/edges/');
        const edges = response.data;

        const nodes = edges.map((edge: any) => ({
          data: {
            id: edge.uuid,
            label: edge.hostname,
            type: edge.vendor_type,
            health: edge.health_score
          },
          position: { x: Math.random() * 600, y: Math.random() * 400 }
        }));

        const hubs = nodes.filter((n: any) => n.data.label.toLowerCase().includes('hub'));
        const branches = nodes.filter((n: any) => !n.data.label.toLowerCase().includes('hub'));

        const links: any[] = [];
        branches.forEach((branch: any) => {
          hubs.forEach((hub: any) => {
            links.push({
              data: {
                id: `${branch.data.id}-${hub.data.id}`,
                source: branch.data.id,
                target: hub.data.id,
                label: 'Overlay'
              }
            });
          });
        });

        setElements([...nodes, ...links]);
      } catch (error) {
        console.error("Error fetching edges", error);
      }
    };

    fetchData();
  }, []);

  const layout = {
    name: 'cose',
    animate: false,
    nodeOverlap: 2000,
    componentSpacing: 100,
    nodeRepulsion: 400000,
    edgeElasticity: 100,
    nestingFactor: 5
  };

  const style = [
    {
      selector: 'node',
      style: {
        'label': 'data(label)',
        'background-color': (ele: any) => {
            const health = ele.data('health');
            if (health > 80) return '#4ade80';
            if (health > 50) return '#facc15';
            return '#f87171';
        },
        'color': '#333',
        'text-valign': 'bottom',
        'text-halign': 'center',
        'width': 40,
        'height': 40,
        'font-size': '10px',
        'text-margin-y': 5
      }
    },
    {
      selector: 'edge',
      style: {
        'width': 2,
        'line-color': '#cbd5e1',
        'target-arrow-color': '#cbd5e1',
        'target-arrow-shape': 'triangle',
        'curve-style': 'bezier',
        'label': 'data(label)',
        'font-size': '8px',
        'color': '#94a3b8',
        'text-rotation': 'autorotate',
        'text-margin-y': -10
      }
    }
  ];

  return (
    <div style={{ width: '100%', height: '600px', border: '1px solid #cbd5e1', borderRadius: '8px', background: '#f8fafc' }}>
      <CytoscapeComponent
        elements={elements}
        style={{ width: '100%', height: '100%' }}
        layout={layout as any}
        stylesheet={style as any}
      />
    </div>
  );
};

export default TopologyCanvas;
