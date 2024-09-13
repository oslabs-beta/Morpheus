import * as k8s from '@kubernetes/client-node';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const kc = new k8s.KubeConfig();
  kc.loadFromDefault();

  const coreApi = kc.makeApiClient(k8s.CoreV1Api);
  const appsApi = kc.makeApiClient(k8s.AppsV1Api);

  try {
    const nodes = await coreApi.listNode();
    const pods = await coreApi.listPodForAllNamespaces();
    const services = await coreApi.listServiceForAllNamespaces();
    const deployments = await appsApi.listDeploymentForAllNamespaces();

    // Create a map of services to pods based on selectors
    const serviceToPods = services.body.items.reduce((acc, service) => {
      if (service.metadata && service.spec?.selector) {
        const matchingPods = pods.body.items
          .filter((pod) => matchLabels(pod.metadata?.labels, service.spec.selector))
          .map((pod) => pod.metadata?.name)
          .filter(Boolean); // Filter out undefined names

        acc[service.metadata.name] = matchingPods;
      }
      return acc;
    }, {} as Record<string, string[]>);

    return NextResponse.json({
      nodes: nodes.body.items.map((node) => node.metadata?.name).filter(Boolean),
      pods: pods.body.items
        .map((pod) => ({
          name: pod.metadata?.name,
          nodeName: pod.spec?.nodeName,
        }))
        .filter((pod) => pod.name),
      services: services.body.items.map((service) => service.metadata?.name).filter(Boolean),
      serviceToPods,
      deployments: deployments.body.items.map((deployment) => deployment.metadata?.name).filter(Boolean),
    });
  } catch (err) {
    console.error('Error fetching Kubernetes components:', err);
    return NextResponse.json({ error: 'Error fetching Kubernetes components' });
  }
}

const matchLabels = (podLabels, serviceSelector) => {
  if (!podLabels || !serviceSelector) return false;
  return Object.keys(serviceSelector).every((key) => serviceSelector[key] === podLabels[key]);
};
