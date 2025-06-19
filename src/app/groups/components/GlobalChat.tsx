// src/app/community/components/GlobalChat.tsx

"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send } from "lucide-react";

// Definimos los tipos para los mensajes, incluyendo los datos del perfil
type MessageWithProfile = {
  id: number;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    username: string | null;
    avatar_url: string | null;
  } | null;
};

export default function GlobalChat() {
  const { user, supabase } = useAuth();
  const [messages, setMessages] = useState<MessageWithProfile[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Carga de mensajes iniciales (sin cambios)
  useEffect(() => {
    const fetchInitialMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*, profiles(username, avatar_url)")
        .order("created_at", { ascending: true })
        .limit(50);
      setMessages(data || []);
    };
    fetchInitialMessages();
  }, [supabase]);

  // Suscripción en tiempo real (sin cambios)
  useEffect(() => {
    const channel = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        async (payload) => {
          // Esta lógica es para los mensajes de OTROS usuarios
          if (payload.new.user_id === user?.id) return; // Ignoramos nuestro propio eco si llegara

          const { data: profileData } = await supabase
            .from("profiles")
            .select("username, avatar_url")
            .eq("id", payload.new.user_id)
            .single();
          const newMessageWithProfile = {
            ...payload.new,
            profiles: profileData,
          } as MessageWithProfile;
          setMessages((currentMessages) => [
            ...currentMessages,
            newMessageWithProfile,
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // --- FUNCIÓN DE ENVIAR MENSAJE MEJORADA ---
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "" || !user) return;

    const content = newMessage.trim();
    setNewMessage("");

    // 1. Insertamos el nuevo mensaje y le pedimos a Supabase que nos lo devuelva
    //    con los datos del perfil ya incluidos, usando .select()
    const { data: insertedMessage, error } = await supabase
      .from("messages")
      .insert({ content, user_id: user.id })
      .select(
        `
        *,
        profiles (
          username,
          avatar_url
        )
      `
      )
      .single(); // .single() para que devuelva un objeto, no un array

    if (error) {
      console.error("Error enviando el mensaje:", error);
      setNewMessage(content); // Devolvemos el texto al input si hay un error
    } else if (insertedMessage) {
      // 2. Si la inserción fue exitosa, añadimos el mensaje completo a nuestro estado local.
      // ¡Esta es la actualización optimista!
      setMessages((currentMessages) => [
        ...currentMessages,
        insertedMessage as MessageWithProfile,
      ]);
    }
  };

  return (
    <div className="flex flex-col h-[80vh] bg-slate-900/50 border border-slate-800 rounded-lg">
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-xl font-bold text-white">Chat de la Comunidad</h2>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${
              message.user_id === user?.id ? "justify-end" : "justify-start"
            }`}
          >
            {message.user_id !== user?.id && (
              <Avatar className="h-8 w-8">
                <AvatarImage src={message.profiles?.avatar_url || undefined} />
                <AvatarFallback>
                  {message.profiles?.username?.charAt(0) || "?"}
                </AvatarFallback>
              </Avatar>
            )}
            <div
              className={`max-w-xs md:max-w-md p-3 rounded-lg ${
                message.user_id === user?.id
                  ? "bg-cyan-600 text-white rounded-br-none"
                  : "bg-slate-700 text-slate-200 rounded-bl-none"
              }`}
            >
              <p className="text-xs font-bold text-purple-300 mb-1">
                {message.user_id === user?.id
                  ? "Tú"
                  : message.profiles?.username || "Usuario"}
              </p>
              <p className="text-sm break-words">{message.content}</p>
            </div>
            {message.user_id === user?.id && (
              <Avatar className="h-8 w-8">
                <AvatarImage src={message.profiles?.avatar_url || undefined} />
                <AvatarFallback>
                  {message.profiles?.username?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-slate-700">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="bg-slate-800 border-slate-600 text-white"
          />
          <Button
            type="submit"
            size="icon"
            className="bg-cyan-500 hover:bg-cyan-600"
            disabled={!newMessage.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
