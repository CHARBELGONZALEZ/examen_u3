"use client";

import { useState, type ReactNode } from "react";
import { IconoOjo } from "@/components/Iconos";

interface CampoTextoProps {
  id: string;
  etiqueta: string;
  tipo?: React.HTMLInputTypeAttribute;
  valor: string;
  alCambiar: (evento: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  deshabilitado?: boolean;
  autoComplete?: React.HTMLInputAutoCompleteAttribute;
  placeholder?: string;
  icono?: ReactNode;
  accionEtiqueta?: ReactNode;
  elementoDerecha?: ReactNode;
}

export default function CampoTexto({
  id,
  etiqueta,
  tipo = "text",
  valor,
  alCambiar,
  error,
  deshabilitado = false,
  autoComplete,
  placeholder,
  icono, 
  accionEtiqueta, 
  elementoDerecha, 
}: CampoTextoProps) {
  const [mostrar, setMostrar] = useState<boolean>(false);
  const esPassword = tipo === "password";
  const tipoReal = esPassword && mostrar ? "text" : tipo;


  const derecha = esPassword ? (
    <button
      type="button"
      onClick={() => setMostrar((m) => !m)}
      disabled={deshabilitado}
      aria-label={mostrar ? "Ocultar contraseña" : "Mostrar contraseña"}
      className="text-on-surface-variant/70 hover:text-on-surface disabled:cursor-not-allowed"
    >
      <IconoOjo tachado={mostrar} />
    </button>
  ) : (
    elementoDerecha
  );

  return (
    <div className="mb-5">
      <div className="mb-2 flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-sm font-medium text-on-surface">
          {etiqueta}
        </label>
        {accionEtiqueta}
      </div>

      <div className="relative">
        {icono && (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-on-surface-variant/70">
            {icono}
          </span>
        )}

        <input
          id={id}
          name={id}
          type={tipoReal}
          value={valor}
          onChange={alCambiar}
          disabled={deshabilitado}
          autoComplete={autoComplete}
          placeholder={placeholder}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full rounded-lg border bg-surface-container-lowest py-3 text-sm text-on-surface placeholder:text-on-surface-variant/40 outline-none transition focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
            icono ? "pl-11" : "pl-3"
          } ${derecha ? "pr-11" : "pr-3"} ${
            error
              ? "border-error focus:ring-error/40"
              : "border-transparent focus:ring-primary"
          }`}
        />

        {derecha && (
          <span className="absolute inset-y-0 right-3 flex items-center">
            {derecha}
          </span>
        )}
      </div>

      
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-error">
          {error}
        </p>
      )}
    </div>
  );
}
