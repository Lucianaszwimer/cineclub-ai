import { IChatRepository, IChatSession, IChatMessage } from '../interfaces/chatRepositoryInterface';
import { ChatSession } from '../schemas/chatModel'; 

export class MongoChatRepository implements IChatRepository {
  
  async findSessionById(sessionId: string): Promise<IChatSession | null> {
    return await ChatSession.findOne({ sessionId }).lean();
  }

  async createSession(sessionId: string, initialMessage: IChatMessage): Promise<IChatSession> {
    const messageWithDate = {
      ...initialMessage,
      createdAt: new Date()
    };

    const newSession = new ChatSession({
      sessionId,
      messages: [messageWithDate]
    });
    
    const saved = await newSession.save();
    return saved.toObject();
  }

  async addMessageToSession(sessionId: string, message: IChatMessage): Promise<IChatSession | null> {
   const messageWithDate = {
      ...message,
      createdAt: new Date()
    };

    return await ChatSession.findOneAndUpdate(
      { sessionId },
      { $push: { messages: messageWithDate } },
      { returnDocument: 'after' }
    ).lean();
  }

  async saveOrUpdateSession(sessionId: string, messages: IChatMessage[]): Promise<IChatSession> {
  const messagesWithDates = messages.map(msg => ({
    role: msg.role,
    content: msg.content,
    movies: msg.movies || undefined,
    createdAt: msg.createdAt || new Date()
  }));

  const updatedSession = await ChatSession.findOneAndUpdate(
    { sessionId: sessionId.trim() },
    { $set: { messages: messagesWithDates } },
    { 
      returnDocument: 'after', 
      upsert: true,            // Si existe lo pisa, si no existe lo crea de una
      runValidators: true 
    }
  ).lean();

  return updatedSession as unknown as IChatSession;
}
}