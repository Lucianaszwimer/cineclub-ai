import mongoose, { Schema, model, models } from 'mongoose';

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
// src/backend/schemas/chatModel.ts

const ChatSessionSchema = new Schema({
  sessionId: { 
    type: String, 
    required: true, 
    unique: true, // Evita duplicados a nivel base de datos
    trim: true 
  },
  messages: [
    {
      role: { type: String, required: true, enum: ['user', 'assistant', 'system'] },
      content: { type: String, required: true },
      movies: { type: Array, default: undefined }, // Para tus MovieCards
      createdAt: { type: Date, default: Date.now }
    }
  ]
}, {
  timestamps: true // Te crea automáticamente el createdAt y updatedAt de la sesión entera
});

// Exportamos protegiendo contra la recompilación de Next.js
export const ChatSession = models.ChatSession || model('ChatSession', ChatSessionSchema);
