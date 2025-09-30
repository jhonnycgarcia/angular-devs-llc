import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';

/**
 * Sanitiza una URL para prevenir inyecciones o URLs malformadas.
 * Usa DomSanitizer de Angular para una sanitización más robusta contra XSS.
 * @param sanitizer Instancia de DomSanitizer inyectada.
 * @param url La URL como string a sanitizar.
 * @returns La URL sanitizada como SafeUrl o null si no es segura.
 */
export function sanitizeUrl(sanitizer: DomSanitizer, url: string): SafeUrl | null {
  if (!url || typeof url !== 'string') {
    return null;
  }

  // Trim espacios y caracteres de control
  const trimmedUrl = url.trim();

  // Usa DomSanitizer para sanitizar la URL
  return sanitizer.sanitize(SecurityContext.URL, trimmedUrl) as SafeUrl | null;
}

/**
 * Función auxiliar para simular un retardo (sleep) en operaciones asíncronas.
 * Útil para pruebas o simulaciones de carga.
 * @param ms Tiempo en milisegundos para pausar la ejecución.
 * @returns Una promesa que se resuelve después del tiempo especificado.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
