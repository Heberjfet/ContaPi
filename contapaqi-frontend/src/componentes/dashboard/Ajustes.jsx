import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Settings.css";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");

  // para Profile: estado del ítem activo
  const [selectedProfileItem, setSelectedProfileItem] = useState("edit");

  // estados originales para Setting
  const [username, setUsername] = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");

  const handleLogout = () => {
    alert("Has salido de la cuenta");
  };
  const handleSave = () => {
    alert("Cambios guardados");
  };

  // definición de ítems de Profile
  const profileItems = [
    { key: "edit",  icon: "bi-pencil",        label: "Edit Profile" },
    { key: "view",  icon: "bi-person",        label: "View Profile" },
    { key: "social",icon: "bi-people",        label: "Social Profile" },
    { key: "billing", icon: "bi-card-checklist", label: "Billing" },
    { key: "logout", icon: "bi-power",        label: "Logout" },
  ];

  return (
    <div className="settings-wrapper px-3">
      {/* --- PESTAÑAS --- */}
      <div className="tabs">
        <button
          className={`tab-item ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </button>
        <button
          className={`tab-item ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          Setting
        </button>
        <div className={`tab-indicator ${activeTab}`}></div>
      </div>

      {/* --- CONTENIDO --- */}
      <div className="tab-content">
        {activeTab === "profile" ? (
          <div className="list-group fade-in" key="profile">
            {profileItems.map(item => (
              <button
                key={item.key}
                type="button"
                className={
                  "list-group-item list-group-item-action d-flex align-items-center" +
                  (selectedProfileItem === item.key ? " active" : "")
                }
                onClick={() => setSelectedProfileItem(item.key)}
              >
                <i className={`bi ${item.icon} me-2`}></i>
                {item.label}
              </button>
            ))}
          </div>
        ) : (
          <form className="fade-in" key="settings">
            <div className="mb-3">
              <label className="form-label fw-semibold">Nombre de usuario</label>
              <input
                type="text"
                className="form-control rounded-3 shadow-sm"
                placeholder="Ingresa tu usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Correo</label>
              <input
                type="email"
                className="form-control rounded-3 shadow-sm"
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Contraseña</label>
              <input
                type="password"
                className="form-control rounded-3 shadow-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-outline-primary w-50 me-2"
                onClick={handleSave}
              >
                Guardar Cambios
              </button>
              <button
                type="button"
                className="btn btn-outline-danger w-50 ms-2"
                onClick={handleLogout}
              >
                Salir de la cuenta
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Settings;
