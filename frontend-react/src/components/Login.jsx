import { useEffect, useState } from "react";
import "../styles/Login.css";

const API = "http://localhost:4000/api";
const vacio = { nombre: "", telefono: "", correo: "", contrasena: "", proveedor: false, rfcempresarial: "" };

export default function Login({ onLogin, onClose }) {
  const [modo, setModo] = useState("login"); // "login" | "registro"
  const [form, setForm] = useState(vacio);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });
  const [cargando, setCargando] = useState(false);

  // Cerrar con la tecla Escape
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const cambiar = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const cambiarModo = () => {
    setMensaje({ tipo: "", texto: "" });
    setModo(modo === "login" ? "registro" : "login");
  };

  const enviar = async (e) => {
    e.preventDefault();
    setMensaje({ tipo: "", texto: "" });
    setCargando(true);
    try {
      const esLogin = modo === "login";
      const body = esLogin
        ? { correo: form.correo, contrasena: form.contrasena }
        : form;

      const res = await fetch(`${API}/${esLogin ? "login" : "registro"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ocurrió un error.");

      if (esLogin) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("usuario", JSON.stringify(data.usuario));
        onLogin?.(data.usuario);
      } else {
        setForm({ ...vacio, correo: form.correo });
        setModo("login");
        setMensaje({ tipo: "ok", texto: "Cuenta creada. Ahora inicia sesión." });
      }
    } catch (err) {
      setMensaje({ tipo: "error", texto: err.message });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div
      className="login-pagina"
      onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <form className="login-form" onSubmit={enviar} role="dialog" aria-modal="true">
        <button type="button" className="login-cerrar" onClick={onClose} aria-label="Cerrar">
          ✕
        </button>
        <h2>{modo === "login" ? "Iniciar sesión" : "Crear cuenta"}</h2>

        {modo === "registro" && (
          <>
            <label>
              Nombre
              <input name="nombre" value={form.nombre} onChange={cambiar} required />
            </label>
            <label>
              Teléfono
              <input type="tel" name="telefono" value={form.telefono} onChange={cambiar} required />
            </label>
          </>
        )}

        <label>
          Correo
          <input type="email" name="correo" value={form.correo} onChange={cambiar} required />
        </label>

        <label>
          Contraseña
          <input
            type="password"
            name="contrasena"
            value={form.contrasena}
            onChange={cambiar}
            minLength={6}
            required
          />
        </label>

        {modo === "registro" && (
          <>
            <label className="login-check">
              <input type="checkbox" name="proveedor" checked={form.proveedor} onChange={cambiar} />
              Soy proveedor
            </label>
            {form.proveedor && (
              <label>
                RFC empresarial
                <input
                  name="rfcempresarial"
                  value={form.rfcempresarial}
                  onChange={cambiar}
                  maxLength={13}
                  required
                />
              </label>
            )}
          </>
        )}

        {mensaje.texto && (
          <p className={mensaje.tipo === "ok" ? "login-ok" : "login-error"} role="alert">
            {mensaje.texto}
          </p>
        )}

        <button type="submit" disabled={cargando}>
          {cargando ? "Enviando..." : modo === "login" ? "Entrar" : "Registrarme"}
        </button>

        <p className="login-cambio">
          {modo === "login" ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
          <button type="button" className="link" onClick={cambiarModo}>
            {modo === "login" ? "Regístrate" : "Inicia sesión"}
          </button>
        </p>
      </form>
    </div>
  );
}
