import { AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * Validador personalizado para URLs en formularios de Angular.
 * Verifica que el valor sea una URL válida con protocolo http o https.
 * @param control El control del formulario a validar.
 * @returns ValidationErrors si no es válida, null si lo es.
 */
export function urlValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value || typeof value !== 'string') {
    return null; // No validar si está vacío
  }

  const trimmedValue = value.trim();
  if (!trimmedValue) {
    return null;
  }

  try {
    const parsedUrl = new URL(trimmedValue);
    // Solo permite protocolos seguros
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return { invalidUrl: { message: 'La URL debe usar protocolo http o https' } };
    }
    return null; // Válida
  } catch {
    return { invalidUrl: { message: 'Formato de URL inválido' } };
  }
}
