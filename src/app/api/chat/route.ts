import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const body = await request.json();
    const nestBaseUrl = process.env.NEST_BASE_URL || 'http://localhost:3001';

    const response = await fetch(`${nestBaseUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-request-id': request.headers.get('x-request-id') || crypto.randomUUID()
      },
      body: JSON.stringify(body),
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
