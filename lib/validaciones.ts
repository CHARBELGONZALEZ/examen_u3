export interface ErroresLogin {
  email?: string;
  password?: string;
}

export interface ErroresRegistro extends ErroresLogin {
  confirmar?: string;
}

const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validarCorreo(email: string): string {
  if (email.trim() === "") return "El correo es obligatorio.";
  if (!formatoCorreo.test(email.trim())) return "El formato del correo no es válido.";
  return "";
}

export function validarLogin(email: string, password: string): ErroresLogin {
  const errores: ErroresLogin = {};
  const errorCorreo = validarCorreo(email);
  if (errorCorreo) errores.email = errorCorreo;

  const errorPassword = validarPasswordLogin(password);
  if (errorPassword) errores.password = errorPassword;

  return errores;
}

export function validarPasswordLogin(password: string): string {
  if (password === "") return "La contraseña es obligatoria.";
  if (password.length < 8) return "La contraseña debe de ser tu numero de control";
  return "";
}

export function validarRegistro(
  email: string,
  password: string,
  confirmar: string,
): ErroresRegistro {
  const errores: ErroresRegistro = {};
  const errorCorreo = validarCorreo(email);
  if (errorCorreo) errores.email = errorCorreo;

  if (password === "") {
    errores.password = "La contraseña es obligatoria.";
  } else if (password.length < 6) {
    errores.password = "La contraseña debe de ser tu numero de control.";
  }

  if (confirmar === "") {
    errores.confirmar = "Confirma tu contraseña.";
  } else if (confirmar !== password) {
    errores.confirmar = "Las contraseñas no coinciden.";
  }

  return errores;
}

export function mensajeDeError(codigo: string): string {
  switch (codigo) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Correo o contraseña incorrectos.";
    case "auth/email-already-in-use":
      return "Ese correo ya está registrado.";
    case "auth/weak-password":
      return "La contraseña debe de ser tu numero de control.";
    case "auth/operation-not-allowed":
    case "auth/admin-restricted-operation":
      return "El registro no está habilitado en este proyecto.";
    case "auth/invalid-email":
      return "El formato del correo no es válido.";
    case "auth/too-many-requests":
      return "Ingresa tu correo electrónico.";
    case "auth/network-request-failed":
      return "Error de conexión. Revisa tu internet.";
    default:
      return "Ocurrió un error. Inténtalo de nuevo.";
  }
}
