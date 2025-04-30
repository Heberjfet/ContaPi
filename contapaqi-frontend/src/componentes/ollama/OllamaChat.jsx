import React, { useState, useRef, useEffect } from "react";
import { FaTimes, FaPaperPlane, FaSync, FaCog } from "react-icons/fa";
import axios from "axios";
import "./OllamaChat.css";

function OllamaChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [serviceStatus, setServiceStatus] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [chatContext, setChatContext] = useState("general");
  const [chatHistory, setChatHistory] = useState([
    {
      role: "assistant",
      content:
        "Hola, soy el asistente ContaPi con Llama3.2. ¿Cómo puedo ayudarte hoy con temas contables o financieros?",
    },
  ]);

  const chatContainerRef = useRef(null);
  const OLLAMA_SERVICE_URL = "http://localhost:3007";

  // Verificar estado del servicio cuando se abre el chat
  useEffect(() => {
    if (isOpen) {
      checkServiceStatus();
    }
  }, [isOpen]);

  // Auto-scroll al último mensaje
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Verificar si el servicio de Ollama está disponible
  const checkServiceStatus = async () => {
    try {
      const response = await axios.get(`${OLLAMA_SERVICE_URL}/status`);
      setServiceStatus(response.data.status);
    } catch (error) {
      console.error("Error al verificar el estado del servicio:", error);
      setServiceStatus("offline");
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  // Función para enriquecer el mensaje con contexto contable específico
  const enrichMessageWithContext = (message) => {
    // Aquí podríamos añadir contexto adicional según el tipo de consulta
    // Por ejemplo, si detectamos que es una pregunta sobre impuestos, podríamos añadir contexto específico

    // Este es un ejemplo simple, pero podría ser más sofisticado con NLP
    if (
      message.toLowerCase().includes("impuesto") ||
      message.toLowerCase().includes("iva") ||
      message.toLowerCase().includes("isr")
    ) {
      return `[CONTEXTO: Consulta sobre impuestos] ${message}`;
    } else if (
      message.toLowerCase().includes("balance") ||
      message.toLowerCase().includes("estado financiero")
    ) {
      return `[CONTEXTO: Consulta sobre estados financieros] ${message}`;
    } else {
      return message;
    }
  };

  // Modifica la función handleSendMessage para enviar la categoría

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Verificar estado del servicio
    if (serviceStatus === "offline") {
      setChatHistory((prev) => [
        ...prev,
        { role: "user", content: message },
        {
          role: "assistant",
          content:
            "Lo siento, el servicio de Ollama no está disponible en este momento.",
        },
      ]);
      setMessage("");
      return;
    }

    // Añadir mensaje del usuario al historial con la categoría
    setChatHistory((prev) => [
      ...prev,
      {
        role: "user",
        content: message,
        category: chatContext,
      },
    ]);

    setMessage("");
    setIsLoading(true);

    try {
      // Llamada al microservicio incluyendo la categoría
      const response = await axios.post(`${OLLAMA_SERVICE_URL}/chat`, {
        message: message,
        category: chatContext, // Enviamos la categoría al backend
      });

      // Añadir respuesta de Ollama al historial de chat
      setChatHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.data.response,
          fromCache: response.data.fromCache,
          category: response.data.category,
        },
      ]);
    } catch (error) {
      console.error("Error al comunicarse con el servicio:", error);

      // Mensaje de error apropiado según el tipo de error
      let errorMessage =
        "Lo siento, ha ocurrido un error al procesar tu solicitud.";

      if (error.response) {
        if (error.response.status === 503) {
          errorMessage =
            "No se pudo conectar con el servicio de Ollama. Asegúrate de que esté en ejecución.";
          setServiceStatus("offline");
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }

      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", content: errorMessage },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Gestiona el cambio de contexto
  const handleContextChange = (e) => {
    setChatContext(e.target.value);
  };

  return (
    <div className={`ollama-chat-container ${isOpen ? "open" : ""}`}>
      {isOpen ? (
        <div className="ollama-chat-window">
          <div className="ollama-chat-header">
            <h5>Asistente ContaPi</h5>

            <div className="header-controls">
              {serviceStatus === "offline" && (
                <span
                  className="status-indicator offline"
                  title="Servicio no disponible"
                >
                  ⚠️
                </span>
              )}

              <button
                className="settings-button"
                onClick={toggleSettings}
                title="Configuración"
              >
                <FaCog />
              </button>

              <button className="close-button" onClick={toggleChat}>
                <FaTimes />
              </button>
            </div>
          </div>

          {showSettings && (
            <div className="settings-panel">
              <div className="setting-item">
                <label htmlFor="contextSelect">Contexto de consulta:</label>
                <select
                  id="contextSelect"
                  value={chatContext}
                  onChange={handleContextChange}
                  className="context-select"
                >
                  <option value="general">General</option>
                  <option value="impuestos">Impuestos</option>
                  <option value="contabilidad">Contabilidad</option>
                  <option value="normativa">Normativa contable</option>
                  <option value="finanzas">Finanzas</option>
                </select>
              </div>

              <div className="setting-item">
                <button
                  className="refresh-button"
                  onClick={checkServiceStatus}
                  title="Comprobar estado del servicio"
                >
                  <FaSync /> Verificar servicio
                </button>
              </div>
            </div>
          )}

          <div className="ollama-chat-messages" ref={chatContainerRef}>
            {chatHistory.map((chat, index) => (
              <div
                key={index}
                className={`message ${
                  chat.role === "user" ? "user-message" : "assistant-message"
                } ${chat.fromCache ? "cached" : ""}`}
                data-context={chat.category || "general"}
              >
                {chat.role === "user" &&
                  chat.category &&
                  chat.category !== "general" && (
                    <span className="category-tag">{chat.category}</span>
                  )}
                {chat.content}
                {chat.fromCache && (
                  <span className="cache-indicator" title="Respuesta de caché">
                    🔄
                  </span>
                )}
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
              placeholder="Escribe tu pregunta aquí... "
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="submit"
              className="send-button"
              disabled={
                isLoading || !message.trim() || serviceStatus === "offline"
              }
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
