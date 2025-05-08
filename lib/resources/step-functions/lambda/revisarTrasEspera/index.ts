import { Handler } from 'aws-lambda';

interface Event {
  solicitudId: string;
  estado: string;
}

interface Response {
  solicitudId: string;
  estadoFinal: string;
}

export const handler: Handler<Event, Response> = async (event) => {
  console.log('Solicitud recibida:', event);
  return {
    solicitudId: event.solicitudId,
    estadoFinal: 'REVISADA_AUTOMATICAMENTE',
  };
};
