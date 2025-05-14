import { Handler } from 'aws-lambda';

interface Event {
  intento?: number;
}

interface Output {
  resultado: string;
}

export const handler: Handler<Event, Output> = async (event) => {
  if (Math.random() < 0.5) {
    throw new Error('Fallo aleatorio simulado');
  }

  return {
    resultado: 'Éxito en la tarea crítica',
  };
};
