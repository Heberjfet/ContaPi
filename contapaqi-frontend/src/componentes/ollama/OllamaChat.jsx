import React, { useState, useRef, useEffect } from "react";
import { FaTimes, FaPaperPlane } from "react-icons/fa";
import "./OllamaChat.css";

function OllamaChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      role: "assistant",
      content: "Hola, soy el asistente de ContaPi. ¿En qué puedo ayudarte hoy?",
    },
  ]);

  const chatContainerRef = useRef(null);

  // Auto-scroll al último mensaje
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Añadir mensaje del usuario al historial
    setChatHistory([...chatHistory, { role: "user", content: message }]);

    const userMessage = message;
    setMessage("");
    setIsLoading(true);

    try {
      // Aquí iría la llamada a la API de Ollama
      // Por ahora, simulamos una respuesta después de un breve retraso
      setTimeout(() => {
        setChatHistory((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Esta es una respuesta simulada. En una implementación real, aquí vendría la respuesta de Ollama a: "${userMessage}"`,
          },
        ]);
        setIsLoading(false);
      }, 1000);

      // La implementación real sería algo como:
      /*
      const response = await fetch("http://localhost:3002/api/ollama/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });
      
      if (!response.ok) {
        throw new Error("Error en la comunicación con Ollama");
      }
      
      const data = await response.json();
      setChatHistory(prev => [...prev, { role: "assistant", content: data.response }]);
      */
    } catch (error) {
      console.error("Error:", error);
      setChatHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Lo siento, ha ocurrido un error al procesar tu solicitud.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`ollama-chat-container ${isOpen ? "open" : ""}`}>
      {isOpen ? (
        <div className="ollama-chat-window">
          <div className="ollama-chat-header">
            <h5>Asistente ContaPi</h5>
            <button className="close-button" onClick={toggleChat}>
              <FaTimes />
            </button>
          </div>

          <div className="ollama-chat-messages" ref={chatContainerRef}>
            {chatHistory.map((chat, index) => (
              <div
                key={index}
                className={`message ${
                  chat.role === "user" ? "user-message" : "assistant-message"
                }`}
              >
                {chat.content}
              </div>
            ))}

            {isLoading && (
              <div className="message assistant-message loading">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
          </div>

          <form className="ollama-chat-input" onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder="Escribe tu pregunta aquí..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="submit"
              className="send-button"
              disabled={isLoading || !message.trim()}
            >
              <FaPaperPlane />
            </button>
          </form>
        </div>
      ) : (
        <button className="ollama-chat-button" onClick={toggleChat}>
          <img
            src="/ollama-logo.png"
            alt="Ollama"
            onError={(e) => {
              e.target.onerror = null;
              e.target.textContent = "AI";
              e.target.style.fontSize = "18px";
              e.target.style.display = "flex";
              e.target.style.alignItems = "center";
              e.target.style.justifyContent = "center";
            }}
          />
        </button>
      )}
    </div>
  );
}

export default OllamaChat;
