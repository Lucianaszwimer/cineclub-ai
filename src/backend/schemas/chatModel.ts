import mongoose, { Schema  } from 'mongoose';

//mensaje suelto
const MessageSchema = new Schema({
  role: { 
    type: String, 
    required: true, 
    enum: ["user", "assistant"] 
  },
  content: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

//una sesión va a contener un identificador único, una fecha de creación y un array de mensajes
// sesion (lista de mensajes)
const ChatSessionSchema = new Schema({
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  messages: [MessageSchema] // Guardamos un array de mensajes adentro
});

// exportamos el modelo asegurando que Next.js no lo duplique en memoria
export const ChatSession = mongoose.models.ChatSession || mongoose.model("ChatSession", ChatSessionSchema);
