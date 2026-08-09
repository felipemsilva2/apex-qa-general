export type PasswordStrength = {
  score: number;
  label: "Muito fraca" | "Fraca" | "Razoável" | "Forte";
  color: "danger" | "warning" | "good";
  checks: {
    length: boolean;
    lowercase: boolean;
    uppercase: boolean;
    number: boolean;
    symbol: boolean;
  };
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
export const PASSWORD_POLICY_MESSAGE = "Use 8 caracteres ou mais e combine letras maiúsculas, minúsculas, número e símbolo.";
export const STUDENT_PASSWORD_MIN_LENGTH = 6;
export const STUDENT_PASSWORD_POLICY_MESSAGE = "A senha do aluno deve ter pelo menos 6 caracteres.";

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function isValidEmail(value: string) {
  return EMAIL_PATTERN.test(normalizeEmail(value));
}

export function getPasswordStrength(password: string): PasswordStrength {
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  };
  const score = Object.values(checks).filter(Boolean).length;

  if (score >= 5) return { score, label: "Forte", color: "good", checks };
  if (score >= 4) return { score, label: "Razoável", color: "good", checks };
  if (score >= 2) return { score, label: "Fraca", color: "warning", checks };
  return { score, label: "Muito fraca", color: "danger", checks };
}

export function isStrongPassword(password: string) {
  const strength = getPasswordStrength(password);
  return Object.values(strength.checks).every(Boolean);
}

/** Senha provisória simples para alunos criados pelo coach. */
export function isStudentPassword(password: string) {
  return password.length >= STUDENT_PASSWORD_MIN_LENGTH;
}

export function generateStrongPassword() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
  const required = ["A", "p", "7", "!"];
  const values = new Uint32Array(12);
  crypto.getRandomValues(values);
  const characters = [...required, ...Array.from(values, (value) => alphabet[value % alphabet.length])];

  for (let index = characters.length - 1; index > 0; index -= 1) {
    const swap = values[index % values.length] % (index + 1);
    [characters[index], characters[swap]] = [characters[swap], characters[index]];
  }

  return characters.slice(0, 12).join("");
}

export function authErrorInPortuguese(message = "") {
  const value = message.toLowerCase();

  if (value.includes("invalid login credentials")) {
    return "E-mail ou senha incorretos. Confira os dados e tente novamente.";
  }
  if (value.includes("email not confirmed")) {
    return "Seu e-mail ainda não foi confirmado. Abra o link enviado para sua caixa de entrada.";
  }
  if (value.includes("user already registered") || value.includes("already been registered")) {
    return "Este e-mail já possui uma conta. Entre com sua senha ou recupere o acesso.";
  }
  if (value.includes("password should be")) {
    return "A senha não atende aos requisitos mínimos de segurança.";
  }
  if (value.includes("rate limit") || value.includes("too many requests")) {
    return "Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente novamente.";
  }
  if (value.includes("expired") || value.includes("invalid token") || value.includes("otp")) {
    return "Este link expirou ou já foi utilizado. Solicite um novo e-mail.";
  }
  if (value.includes("network") || value.includes("fetch")) {
    return "Não foi possível conectar agora. Verifique sua internet e tente novamente.";
  }
  return "Não foi possível concluir a solicitação. Tente novamente em instantes.";
}
