import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  // Dynamic import of Dockerode
  const Docker = (await import('dockerode')).default;

  const docker = new Docker();
  const container = await docker.getContainer(params.id);
  try {
    await container.stop();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
