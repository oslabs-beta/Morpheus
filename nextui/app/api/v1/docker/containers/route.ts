import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Dynamic import of Dockerode
  const Docker = (await import('dockerode')).default;

  const docker = new Docker();
  const containers = await docker.listContainers({ all: true });
  return NextResponse.json(containers);
}
