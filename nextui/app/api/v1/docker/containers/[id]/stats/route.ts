import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  // Dynamic import of Dockerode
  const Docker = (await import('dockerode')).default;

  const docker = new Docker();
  const container = await docker.getContainer(params.id);
  console.log(container);
  const containerStats = await container.stats({ stream: false });
  return NextResponse.json(containerStats);
}
