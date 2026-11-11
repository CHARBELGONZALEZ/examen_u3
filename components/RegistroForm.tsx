"use client";

import { useState } from "react";
import { FirebaseError } from "firebase/app";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  validarRegistro,
  mensajeDeError,
  type ErroresRegistro,
} from "@/lib/validaciones";
import CampoTexto from "@/components/CampoTexto";
import { IconoCorreo, IconoCandado } from "@/components/Iconos";
import {
  EncabezadoTarjeta,
  Separador,
  BotonPrincipal,
  claseTarjeta,
} from "@/components/Tarjeta";

export default function RegistroForm() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmar, setConfirmar] = useState<string>("");
  const [errores, setErrores] = useState<ErroresRegistro>({});
  const [errorAuth, setErrorAuth] = useState<string>("");
  const [cargando, setCargando] = useState<boolean>(false);

  function crearManejador(
    setValor: React.Dispatch<React.SetStateAction<string>>,
    campo: keyof ErroresRegistro,
  ) {
    return (evento: React.ChangeEvent<HTMLInputElement>) => {
      setValor(evento.target.value);
      setErrores((previos) => ({ ...previos, [campo]: "" }));
      setErrorAuth("");
    };
  }

  async function manejarEnvio(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (cargando) return;

    const erroresEncontrados = validarRegistro(email, password, confirmar);
    setErrores(erroresEncontrados);
    setErrorAuth("");

    if (Object.keys(erroresEncontrados).length > 0) return;

    setCargando(true);
    try {
      const credencial = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );
      alert(`Cuenta creada. Bienvenido, ${credencial.user.email}`);
      router.push("/");
    } catch (error) {
      const codigo = error instanceof FirebaseError ? error.code : "";
      setErrorAuth(mensajeDeError(codigo));
      setCargando(false);
    }
  }

  return (
    <form onSubmit={manejarEnvio} noValidate className={claseTarjeta}>
      <EncabezadoTarjeta
        titulo="Crear cuenta"
        subtitulo="Regístrate con tu correo para acceder a la plataforma del examen."
      />

      <Separador texto="REGÍSTRATE CON CORREO" />

      <CampoTexto
        id="email"
        etiqueta="Correo Electrónico"
        tipo="email"
        valor={email}
        alCambiar={crearManejador(setEmail, "email")}
        error={errores.email}
        deshabilitado={cargando}
        autoComplete="email"
        placeholder="alex.dev@empresa.io"
        icono={<IconoCorreo />}
      />

      <CampoTexto
        id="password"
        etiqueta="Contraseña"
        tipo="password"
        valor={password}
        alCambiar={crearManejador(setPassword, "password")}
        error={errores.password}
        deshabilitado={cargando}
        autoComplete="new-password"
        placeholder="Mínimo 6 caracteres"
        icono={<IconoCandado />}
      />

      <CampoTexto
        id="confirmar"
        etiqueta="Confirmar contraseña"
        tipo="password"
        valor={confirmar}
        alCambiar={crearManejador(setConfirmar, "confirmar")}
        error={errores.confirmar}
        deshabilitado={cargando}
        autoComplete="new-password"
        placeholder="Repite la contraseña"
        icono={<IconoCandado />}
      />

      {errorAuth && (
        <p
          role="alert"
          className="mb-4 rounded-xl border border-error/30 bg-error-container/40 px-3 py-2 text-sm text-on-error-container"
        >
          {errorAuth}
        </p>
      )}

      <BotonPrincipal cargando={cargando} textoCargando="Creando cuenta...">
        Crear cuenta
      </BotonPrincipal>

      <hr className="my-6 border-surface-variant" />

      <p className="text-center text-sm text-on-surface-variant">
        ¿Ya tienes una cuenta?{" "}
        <Link href="/" className="font-semibold text-secondary hover:text-secondary-fixed">
          Iniciar sesión
        </Link>
      </p>
    </form>
  );
}
