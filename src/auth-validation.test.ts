import { describe, expect, it } from "vitest";
import {
  authErrorInPortuguese,
  generateStrongPassword,
  getPasswordStrength,
  isStrongPassword,
  isStudentPassword,
  isValidEmail,
  normalizeEmail,
} from "./auth-validation";

describe("auth-validation", () => {
  it("normaliza e valida e-mails", () => {
    expect(normalizeEmail("  Pessoa@Exemplo.COM ")).toBe("pessoa@exemplo.com");
    expect(isValidEmail("pessoa@exemplo.com")).toBe(true);
    expect(isValidEmail("pessoa@exemplo")).toBe(false);
    expect(isValidEmail("pessoa exemplo.com")).toBe(false);
  });

  it("exige senha com combinação segura", () => {
    expect(isStrongPassword("abc123")).toBe(false);
    expect(isStrongPassword("Apex2026")).toBe(false);
    expect(isStrongPassword("Apex#2026")).toBe(true);
    expect(getPasswordStrength("Apex#2026").label).toBe("Forte");
  });

  it("aceita senha provisória simples para alunos", () => {
    expect(isStudentPassword("abc123")).toBe(true);
    expect(isStudentPassword("Apex#2026")).toBe(true);
    expect(isStudentPassword("12345")).toBe(false);
  });

  it("gera credenciais que já atendem à política", () => {
    const generated = generateStrongPassword();
    expect(generated).toHaveLength(12);
    expect(isStrongPassword(generated)).toBe(true);
  });

  it("traduz erros sensíveis sem expor detalhes técnicos", () => {
    expect(authErrorInPortuguese("Invalid login credentials")).toContain("incorretos");
    expect(authErrorInPortuguese("Email not confirmed")).toContain("não foi confirmado");
    expect(authErrorInPortuguese("unexpected database internals")).not.toContain("database");
  });
});
