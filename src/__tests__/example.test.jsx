import { describe, it, expect } from 'vitest';

describe('Ejemplo de test básico', () => {
  it('debería pasar siempre', () => {
    expect(true).toBe(true);
  });
  
  it('debería realizar una suma correctamente', () => {
    expect(1 + 1).toBe(2);
  });
});
