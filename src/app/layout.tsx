import React from 'react';
import './globals.css'; 
import ChatWindow from './components/chatWindow/ChatWindow';

export const metadata = {
  title: 'Cineclub AI',
  description: 'Tu asistente cinéfilo con IA integrada',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-zinc-950 text-zinc-100 antialiased">
          {/* Aquí es donde Next.js va a renderizar tu ChatPage automáticamente */}
        {children}
      </body>
    </html>
  );
}