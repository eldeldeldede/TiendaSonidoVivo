// Funciones de validación reutilizables por todos los formularios

export function validarEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// Valida un RUT chileno con su dígito verificador (acepta 12.345.678-5 o 12345678-5)
export function validarRut(rutIngresado: string): boolean {
  const rut = rutIngresado.replace(/\./g, '').replace(/-/g, '').trim().toUpperCase();
  if (!/^\d{7,8}[0-9K]$/.test(rut)) return false;

  const cuerpo = rut.slice(0, -1);
  const dv = rut.slice(-1);

  let suma = 0;
  let multiplicador = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const resto = 11 - (suma % 11);
  const dvEsperado = resto === 11 ? '0' : resto === 10 ? 'K' : String(resto);
  return dv === dvEsperado;
}

// Tarjeta simulada: 16 dígitos (se permiten espacios)
export function validarNumeroTarjeta(numero: string): boolean {
  return /^\d{16}$/.test(numero.replace(/\s/g, ''));
}

// Vencimiento en formato MM/AA y que no esté vencida
export function validarVencimiento(vencimiento: string, hoy: Date = new Date()): boolean {
  const coincide = /^(\d{2})\/(\d{2})$/.exec(vencimiento.trim());
  if (!coincide) return false;

  const mes = Number(coincide[1]);
  const anio = 2000 + Number(coincide[2]);
  if (mes < 1 || mes > 12) return false;

  const anioActual = hoy.getFullYear();
  const mesActual = hoy.getMonth() + 1;
  return anio > anioActual || (anio === anioActual && mes >= mesActual);
}

export function validarCvv(cvv: string): boolean {
  return /^\d{3}$/.test(cvv.trim());
}
