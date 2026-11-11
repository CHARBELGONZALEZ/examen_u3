"use client";

import { useState } from "react";
import { FirebaseError } from "firebase/app";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  validarLogin,
  validarCorreo,
  validarPasswordLogin,
  mensajeDeError,
  type ErroresLogin,
} from "@/lib/validaciones";

interface IconoProps {
  nombre: string;
  className?: string;
}

function Icono({ nombre, className = "" }: IconoProps) {
  return (
    <span aria-hidden="true" className={`material-symbols-outlined ${className}`}>
      {nombre}
    </span>
  );
}

const claseInput =
  "w-full h-12 pl-11 rounded-lg bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/40 font-body-md text-body-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary shadow-inner disabled:opacity-60 disabled:cursor-not-allowed";

type TipoBanner = "error" | "exito" | "info";

interface Banner {
  tipo: TipoBanner;
  titulo: string;
  mensaje: string;
}

interface EstiloBanner {
  caja: string;
  icono: string;
  colorIcono: string;
}

const estilosBanner: Record<TipoBanner, EstiloBanner> = {
  error: {
    caja: "bg-error-container/40 text-on-error-container border border-error/30",
    icono: "warning",
    colorIcono: "text-error",
  },
  exito: {
    caja: "bg-emerald-950/40 text-emerald-200 border border-emerald-500/30",
    icono: "verified",
    colorIcono: "text-emerald-400",
  },
  info: {
    caja: "bg-surface-variant text-on-surface",
    icono: "info",
    colorIcono: "text-primary",
  },
};

interface MensajeErrorProps {
  id: string;
  texto?: string;
}

function MensajeError({ id, texto }: MensajeErrorProps) {
  if (!texto) return null;
  return (
    <p
      id={id}
      className="font-body-sm text-body-sm text-error flex items-center gap-1.5 pt-1"
    >
      <Icono nombre="error" className="text-sm" />
      <span>{texto}</span>
    </p>
  );
}

export default function LoginForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [mostrarPassword, setMostrarPassword] = useState<boolean>(false);
  const [errores, setErrores] = useState<ErroresLogin>({});
  const [banner, setBanner] = useState<Banner | null>(null);
  const [cargando, setCargando] = useState<boolean>(false);

  const correoValido = validarCorreo(email) === "";

  function mostrarBanner(tipo: TipoBanner, titulo: string, mensaje: string) {
    setBanner({ tipo, titulo, mensaje });
  }

  function manejarCambioEmail(evento: React.ChangeEvent<HTMLInputElement>) {
    setEmail(evento.target.value);
    setErrores((previos) => ({ ...previos, email: "" }));
    setBanner(null);
  }

  function manejarCambioPassword(evento: React.ChangeEvent<HTMLInputElement>) {
    setPassword(evento.target.value);
    setErrores((previos) => ({ ...previos, password: "" }));
    setBanner(null);
  }

  async function manejarEnvio(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (cargando) return;

    const erroresEncontrados = validarLogin(email, password);
    setErrores(erroresEncontrados);

    if (Object.keys(erroresEncontrados).length > 0) {
      mostrarBanner(
        "error",
        "Campos incompletos o inválidos",
        "Por favor verifica los campos resaltados en rojo antes de continuar.",
      );
      return;
    }

    setBanner(null);
    setCargando(true);
    try {
      const credencial = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );
      mostrarBanner(
        "exito",
        "Autenticación exitosa",
        "Credenciales validadas con Firebase Authentication.",
      );
      alert(`Bienvenido, ${credencial.user.email}`);
    } catch (error) {
      const codigo = error instanceof FirebaseError ? error.code : "";
      mostrarBanner("error", "Error de autenticación", mensajeDeError(codigo));
      setPassword("");
    } finally {
      setCargando(false);
    }
  }

  const banerActual = banner && estilosBanner[banner.tipo];

  return (
    <div className="relative w-full min-h-screen py-10 px-4 sm:px-6 lg:px-12 flex items-center justify-center overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary-container/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-20 w-[30rem] h-[30rem] bg-secondary-container/25 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-80 h-80 bg-tertiary-container/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center justify-center">
        <section className="w-full flex flex-col justify-center rounded-xl bg-surface-container/85 p-6 sm:p-10 backdrop-blur-2xl shadow-2xl relative">
          <div className="w-full space-y-7">
            <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
              Iniciar Sesión
            </h1>

            {banerActual && (
              <div
                role={banner.tipo === "error" ? "alert" : "status"}
                className={`rounded-xl p-4 transition-all duration-300 ${banerActual.caja}`}
              >
                <div className="flex items-start gap-3">
                  <Icono
                    nombre={banerActual.icono}
                    className={`mt-0.5 ${banerActual.colorIcono}`}
                  />
                  <div className="flex-1">
                    <h2 className="font-label-action text-label-action font-semibold">
                      {banner.titulo}
                    </h2>
                    <p className="font-body-sm text-body-sm mt-0.5 leading-snug">
                      {banner.mensaje}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setBanner(null)}
                    aria-label="Cerrar mensaje"
                    className="text-current opacity-70 hover:opacity-100 p-0.5"
                  >
                    <Icono nombre="close" className="text-sm" />
                  </button>
                </div>
              </div>
            )}

            <form className="space-y-5" onSubmit={manejarEnvio} noValidate>
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block font-label-action text-label-action text-on-surface"
                >
                  Correo Electrónico
                </label>
                <div className="relative flex items-center">
                  <Icono
                    nombre="mail"
                    className="absolute left-3.5 text-on-surface-variant/70 text-lg pointer-events-none"
                  />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="username"
                    placeholder="ejemplo@web218500.com"
                    value={email}
                    onChange={manejarCambioEmail}
                    onBlur={() =>
                      email &&
                      setErrores((p) => ({ ...p, email: validarCorreo(email) }))
                    }
                    disabled={cargando}
                    aria-invalid={errores.email ? "true" : "false"}
                    aria-describedby={errores.email ? "email-error" : undefined}
                    className={`${claseInput} pr-10 ${errores.email ? "ring-2 ring-error" : ""}`}
                  />
                  {correoValido && !errores.email && (
                    <Icono
                      nombre="check_circle"
                      className="absolute right-3.5 text-emerald-400 text-lg"
                    />
                  )}
                </div>
                <MensajeError id="email-error" texto={errores.email} />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="block font-label-action text-label-action text-on-surface"
                >
                  Contraseña
                </label>
                <div className="relative flex items-center">
                  <Icono
                    nombre="lock"
                    className="absolute left-3.5 text-on-surface-variant/70 text-lg pointer-events-none"
                  />
                  <input
                    id="password"
                    name="password"
                    type={mostrarPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={manejarCambioPassword}
                    onBlur={() =>
                      password &&
                      setErrores((p) => ({
                        ...p,
                        password: validarPasswordLogin(password),
                      }))
                    }
                    disabled={cargando}
                    aria-invalid={errores.password ? "true" : "false"}
                    aria-describedby={errores.password ? "password-error" : undefined}
                    className={`${claseInput} pr-11 ${errores.password ? "ring-2 ring-error" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarPassword((m) => !m)}
                    aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    className="absolute right-3 text-on-surface-variant/70 hover:text-on-surface transition-colors p-1 flex items-center justify-center"
                  >
                    <Icono
                      nombre={mostrarPassword ? "visibility_off" : "visibility"}
                      className="text-lg"
                    />
                  </button>
                </div>
                <MensajeError id="password-error" texto={errores.password} />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={cargando}
                  className="w-full h-12 rounded-lg bg-gradient-to-r from-primary-container to-secondary-container text-on-surface font-label-action text-label-action font-semibold flex items-center justify-center gap-2.5 shadow-lg shadow-primary-container/25 hover:brightness-110 active:scale-[0.99] transition-all duration-150 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {cargando ? (
                    <>
                      <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                      <span>Verificando con Firebase...</span>
                    </>
                  ) : (
                    <>
                      <span>Iniciar Sesión</span>
                      <Icono nombre="arrow_forward" className="text-lg" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <p className="text-center font-body-sm text-body-sm text-on-surface-variant">
              ¿No tienes una cuenta?{" "}
              <Link href="/registro" className="font-semibold text-secondary hover:text-secondary-fixed">
                Crear cuenta
              </Link>
            </p>

            <p className="text-center font-body-sm text-body-sm text-on-surface-variant/60">
              hola profee,Como esta?? .{" "}
              <span className="inline-block">Examen Web </span>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}