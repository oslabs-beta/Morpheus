'use client';

import React, { useState, useEffect } from 'react';
import Graph from 'react-graph-vis';
import nodeImage from '../../public/node-128.png';
import podImage from '../../public/pod-128.png';
import serviceImage from '../../public/svc-128.png';
import deploymentImage from '../../public/deploy-128.png';
import './clusterView.css';

const Dashboard = () => {
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(true);
  const [clusterData, setclusterData] = useState({});

  useEffect(() => {
    fetch('/api/v1/clusterview')
      .then((response) => response.json())
      .then((data) => {
        const { nodes, edges } = processClusterData(data);
        setclusterData(data);

        setGraphData({ nodes, edges });
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching cluster data:', error);
        setLoading(false);
      });
  }, []);

  const processClusterData = (clusterData) => {
    const nodes = [];
    const edges = [];

    // Create nodes for each Kubernetes Node
    clusterData.nodes.forEach((node, index) => {
      nodes.push({
        id: `node-${index}`,
        label: `${node}`, // label would be the same thing
        title: `Node: ${node}`, // label would be the same thing
        shape: 'image',
        image: nodeImage.src,
        size: 40,
      });
    });

    // Create nodes for each Pod
    clusterData.pods.forEach((pod, index) => {
      nodes.push({
        id: `pod-${index}`,
        label: `${pod.name}`,
        title: `Pod: ${pod.name}`,
        shape: 'image',
        image: podImage.src,
      });

      // Create edges from Node to Pod
      const nodeIndex = clusterData.nodes.indexOf(pod.nodeName);
      console.log(nodeIndex);
      if (nodeIndex !== -1) {
        edges.push({
          from: `node-${nodeIndex}`,
          to: `pod-${index}`,
          length: 200,
          arrows: 'to',
        });
      }
    });

    // Map Services to graph nodes
    clusterData.services.forEach((service, index) => {
      nodes.push({
        id: `service-${index}`,
        label: `${service}`,
        title: `Service: ${service}`,
        shape: 'image',
        image: serviceImage.src,
      });

      if (clusterData.serviceToPods[service]) {
        // Create edges from Service to Pod
        clusterData.serviceToPods[service].forEach((podName) => {
          const podIndex = clusterData.pods.findIndex((pod) => pod.name === podName);
          if (podIndex !== -1) {
            edges.push({
              from: `service-${index}`,
              to: `pod-${podIndex}`,
              length: 160,
              arrows: 'to',
            });
          }
        });
      }
    });

    // Create nodes for each Deployment
    clusterData.deployments.forEach((deployment, index) => {
      nodes.push({
        id: `deployment-${index}`,
        label: `${deployment}`,
        title: `Deployment: ${deployment}`,
        shape: 'image',
        image: deploymentImage.src,
      });

      // Create edges from Deployment to Pod (based on naming convention or //label matching)
      clusterData.pods.forEach((pod, podIndex) => {
        if (pod.name.includes(deployment)) {
          edges.push({
            from: `deployment-${index}`,
            to: `pod-${podIndex}`,
            length: 150,
            arrows: 'to',
          });
        }
      });
    });
    return { nodes, edges };
  };

  const graphOptions = {
    layout: {
      hierarchical: false, // try switching to true
    },
    edges: {
      color: '#000000',
    },
    height: '1400px',
    width: '2400px',
    interaction: {
      hover: true,
      // tooltipDelay: 250,
    },
  };

  const events = {
    select: function (event) {
      var { nodes, edges } = event;
    },
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <Graph graph={graphData} options={graphOptions} events={events} />
    </div>
  );
};

export default Dashboard;
