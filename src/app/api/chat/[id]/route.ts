import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const nestBaseUrl = process.env.NEST_BASE_URL || 'http://localhost:3001';

    const response = await fetch(`${nestBaseUrl}/chat/${params.id}`, {
      method: 'GET',
      headers: {
        'x-request-id': request.headers.get('x-request-id') || crypto.randomUUID()
      },
      cache: 'no-store',
      signal: controller.signal
    });

    const payload = await response.json().catch(() => ({
      error: 'Respuesta inválida del backend.',
      code: 'INVALID_BACKEND_RESPONSE'
    }));

    return NextResponse.json(payload, { status: response.status });
  } catch {
    return NextResponse.json(
      { error: 'No se pudo conectar con el backend Nest.', code: 'BACKEND_UNAVAILABLE' },
      { status: 503 }
    );
  } finally {
    clearTimeout(timeout);
  }
}
