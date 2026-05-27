import { NextResponse } from 'next/server';
import { handleChatLogic } from '../../../backend/controllers/chatController';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages, sessionId } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'El formato de los mensajes no es válido.' },
        { status: 400 }
      );
    }

    const controllerResult = await handleChatLogic(messages, sessionId);

    return NextResponse.json(controllerResult);

  } catch (error: unknown) {
    console.error('Error crítico en el endpoint de la API Route /api/chat:', error);
    
    // error de Zod o de conexión
    return NextResponse.json(
      { 
        error: 'Hubo un error al procesar el chat.', 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}