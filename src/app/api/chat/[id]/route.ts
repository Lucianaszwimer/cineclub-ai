import { NextResponse } from 'next/server';
import { connectToDB } from '../../../../backend/db';
import { MongoChatRepository } from '../../../../backend/repositories/mongoChatRepository';

const chatRepository = new MongoChatRepository();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const uri = process.env.DATABASE_URL || "mongodb://localhost:27017/cineclub";
    await connectToDB(uri);

    const existingSession = await chatRepository.findSessionById(id);

    if (!existingSession) {
      return NextResponse.json(
        { error: 'El ID de sesión ingresado no es válido.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      sessionId: existingSession.sessionId,
      messages: existingSession.messages
    });

  } catch (error) {
    console.error("Error al recuperar la sesión pasada:", error);
    return NextResponse.json(
      { error: 'Error interno del servidor.' },
      { status: 500 }
    );
  }
}