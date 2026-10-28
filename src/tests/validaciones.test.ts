import { describe, it, expect } from 'vitest';
import { validarEmail, validarRut, validarVencimiento, validarNumeroTarjeta } from '../utils/validaciones';

describe('Funciones de validación', () => {
  it('acepta RUT válidos con y sin puntos', () => {
    expect(validarRut('11111111-1')).toBe(true);
    expect(validarRut('12.345.678-5')).toBe(true);
  });

  it('rechaza RUT con dígito verificador incorrecto o formato inválido', () => {
    expect(validarRut('12345678-9')).toBe(false);
    expect(validarRut('abc')).toBe(false);
    expect(validarRut('')).toBe(false);
  });

  it('valida el formato del correo electrónico', () => {
    expect(validarEmail('cliente@sonidovivo.cl')).toBe(true);
    expect(validarEmail('cliente@')).toBe(false);
    expect(validarEmail('sin arroba.cl')).toBe(false);
  });

  it('valida número de tarjeta y fecha de vencimiento', () => {
    const hoy = new Date(2026, 9, 27); // 27 de octubre de 2026
    expect(validarNumeroTarjeta('4111 1111 1111 1111')).toBe(true);
    expect(validarNumeroTarjeta('4111')).toBe(false);
    expect(validarVencimiento('12/26', hoy)).toBe(true);
    expect(validarVencimiento('09/26', hoy)).toBe(false); // vencida
    expect(validarVencimiento('13/27', hoy)).toBe(false); // mes inválido
  });
});
