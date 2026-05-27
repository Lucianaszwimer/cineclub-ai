import { NextResponse } from 'next/server';
import { handleChatLogic } from '../../../backend/controllers/chatController';

export async function POST(request: Request) {
  try {
    // 1. Extraemos el cuerpo del JSON enviado por el componente ChatWindow
    const body = await request.json();
    const { messages, sessionId } = body;

    // 2. Validación defensiva rápida
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'El formato de los mensajes no es válido.' },
        { status: 400 }
      );
    }

    // 3. Ejecutamos la lógica de tu controlador que procesa OpenAI, TMDB y MongoDB 🚀
    const controllerResult = await handleChatLogic(messages, sessionId);

    // 4. Devolvemos la respuesta estructurada directo al Frontend con estado HTTP 200 (OK)
    return NextResponse.json(controllerResult);

  } catch (error: unknown) {
    console.error('Error crítico en el endpoint de la API Route /api/chat:', error);
    
    // Si ocurre un error de Zod o de conexión, el cliente recibe un mensaje amigable
    return NextResponse.json(
      { 
        error: 'Hubo un error al procesar el chat.', 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}