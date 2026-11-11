import type { ReactNode } from "react";

interface EncabezadoTarjetaProps {
  titulo: string;
  subtitulo?: string;
}

export function EncabezadoTarjeta({ titulo, subtitulo }: EncabezadoTarjetaProps) {
  return (
    <div className="mb-6 text-center">
      <h1 className="font-headline-lg text-headline-lg font-bold tracking-tight text-on-surface">{titulo}</h1>
      {subtitulo && (
        <p className="mx-auto mt-3 max-w-xs text-body-md text-on-surface-variant">
          {subtitulo}
        </p>
      )}
    </div>
  );
}


interface SeparadorProps {
  texto: string;
}

export function Separador({ texto }: SeparadorProps) {
  return (
    <div className="my-6 flex items-center gap-3">
      <span className="h-px flex-1 bg-surface-variant" />
      <span className="font-label-caps text-label-caps text-on-surface-variant/80">
        {texto}
      </span>
      <span className="h-px flex-1 bg-surface-variant" />
    </div>
  );
}


interface BotonPrincipalProps {
  cargando: boolean;
  textoCargando: string;
  children: ReactNode;
}

export function BotonPrincipal({ cargando, textoCargando, children }: BotonPrincipalProps) {
  return (
    <button
      type="submit"
      disabled={cargando}
      className="flex w-full items-center justify-center gap-2 h-12 rounded-lg bg-gradient-to-r from-primary-container to-secondary-container font-semibold text-on-surface shadow-lg shadow-primary-container/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {cargando ? textoCargando : children}
      {!cargando && <span aria-hidden="true">→</span>}
    </button>
  );
}


export const claseTarjeta =
  "w-full max-w-md rounded-xl bg-surface-container/85 p-6 shadow-2xl backdrop-blur-2xl sm:p-10";
