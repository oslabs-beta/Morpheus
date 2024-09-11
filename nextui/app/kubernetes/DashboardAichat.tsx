'use client';

import React, { useState, useEffect } from 'react';
import Graph from 'react-graph-vis';
import nodeImage from '../../public/node-128.png';
import podImage from '../../public/pod-128.png';
import serviceImage from '../../public/svc-128.png';
import deploymentImage from '../../public/deploy-128.png';
import './clusterView.css';
import AIChatApi from './aichat-api';
import { Box, Grid, Typography, CssBaseline } from '@mui/material';
import { styled } from '@mui/material/styles';
import { StyledEngineProvider } from '@mui/material/styles';

// ... (keep your existing interfaces and type definitions)

// Add type definitions for cluster data and graph data
interface ClusterData {
  nodes: string[];
  pods: { name: string; nodeName: string }[];
  services: string[];
  serviceToPods: { [key: string]: string[] };
  deployments: string[];
}

interface GraphNode {
  id: string;
  label: string;
  title: string;
  shape: string;
  image: string;
  size?: number;
}

interface GraphEdge {
  from: string;
  to: string;
  length: number;
  arrows: string;
}

interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

const StyledContainer = styled(Box)(({ theme }) => ({
  minHeight: '90.3vh',
  width: '100%',
  background: 'linear-gradient(to bottom, #d7dcdd 0%, #6981ac 100%)',
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
}));

const BackgroundShape = styled(Box)(({ theme }) => ({
  position: 'absolute',
  borderRadius: '50%',
  background: 'rgba(255, 255, 255, 0.2)',
  zIndex: 1,
}));

const GlassContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 3,
  background: 'rgba(255, 255, 255, 0.01)',
  backdropFilter: 'blur(10px)',
  borderRadius: '20px',
  border: '1px solid rgba(255, 255, 255, 1)',
  padding: theme.spacing(2),
  boxSizing: 'border-box',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  width: '95%',
  height: 'auto',
  margin: 'auto',
  display: 'flex',
  flexDirection: 'column',
}));

const FrostedElement = styled(Box)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.3)',
  backdropFilter: 'blur(10px)',
  borderRadius: '10px',
  border: '1px solid rgba(255, 255, 255, 1)',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  width: '100%',
  boxSizing: 'border-box',
  '&::-webkit-scrollbar': {
    width: '8px',
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: '10px',
    border: '2px solid transparent',
    backgroundClip: 'content-box',
  },
  scrollbarWidth: 'thin',
  scrollbarColor: 'rgba(255, 255, 255, 0.5) transparent',
}));

const StyledHeader = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'linear-gradient(45deg, #59D7F7 20%, #2196F3 60%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  color: 'transparent',
}));

const LeftContainer = styled(FrostedElement)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  overflow: 'hidden',
  padding: theme.spacing(2),
}));

const DashboardAichat = () => {
  const [loading, setLoading] = useState(true);
  const [graphData, setGraphData] = useState<GraphData>({
    nodes: [],
    edges: [],
  });
  const [clusterData, setClusterData] = useState<ClusterData | null>(null);

  useEffect(() => {
    fetch('/api/v1/clusterview')
      .then((response) => response.json())
      .then((data: ClusterData) => {
        const { nodes, edges } = processClusterData(data);
        setClusterData(data);
        setGraphData({ nodes, edges });
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching cluster data:', error);
        setLoading(false);
      });
  }, []);

  const processClusterData = (clusterData: ClusterData): GraphData => {
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];

    // Create nodes for each Kubernetes Node
    clusterData.nodes.forEach((node, index) => {
      nodes.push({
        id: `node-${index}`,
        label: `${node}`,
        title: `Node: ${node}`,
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
          const podIndex = clusterData.pods.findIndex(
            (pod) => pod.name === podName
          );
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

      // Create edges from Deployment to Pod (based on naming convention or label matching)
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
      hierarchical: false,
    },
    edges: {
      color: '#000000',
    },
    autoResize: true,
    height: '100%',
    width: '100%',
    interaction: {
      hover: true,
      dragNodes: true,
      dragView: true,
      zoomView: true,
    },
    physics: {
      enabled: true,
      stabilization: {
        enabled: true,
        iterations: 100, // settles the graph
        fit: true,
      },
      solver: 'forceAtlas2Based', // most important for 'anchoring'
      forceAtlas2Based: {
        gravitationalConstant: -50, //prevents crowding
        centralGravity: 0.01, //reduces pull
        springLength: 100,
        springConstant: 0.08,
      },
      maxVelocity: 50,
      minVelocity: 0.1,
      timestep: 0.5, //speed to settle
    },
  };

  const events = {
    select: function (event: { nodes: string[]; edges: string[] }) {
      var { nodes, edges } = event;
      // Handle selection event
    },
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <StyledEngineProvider injectFirst>
      <StyledContainer>
        <CssBaseline />
        <BackgroundShape
          sx={{
            width: '30vw',
            height: '30vw',
            top: '-10vw',
            left: '-10vw',
          }}
        />
        <BackgroundShape
          sx={{
            width: '30vw',
            height: '30vw',
            top: '-20vw',
            left: '50vw',
          }}
        />
        <BackgroundShape
          sx={{
            width: '30vw',
            height: '30vw',
            bottom: '-5vw',
            right: '-5vw',
          }}
        />
        <GlassContainer
          sx={{
            height: 'calc(100vh - 100px)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <StyledHeader variant='h3'>Kubernetes Cluster View</StyledHeader>
          <Grid
            container
            spacing={2}
            sx={{ flexGrow: 1, mt: 2, height: 'calc(100% - 71px)' }}
          >
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                height: '100%',
              }}
            >
              <LeftContainer>
                <AIChatApi />
              </LeftContainer>
            </Grid>
            <Grid item xs={12} md={8} sx={{ height: '60vh' }}>
              <FrostedElement
                sx={{
                  height: '130%',
                  overflow: 'hidden',
                }}
              >
                <Box sx={{ width: '100%', height: '100%' }}>
                  <Graph
                    graph={graphData}
                    options={{
                      ...graphOptions,
                      height: '100%',
                      width: '100%',
                    }}
                    events={events}
                  />
                </Box>
              </FrostedElement>
            </Grid>
          </Grid>
        </GlassContainer>
      </StyledContainer>
    </StyledEngineProvider>
  );
};

export default DashboardAichat;
