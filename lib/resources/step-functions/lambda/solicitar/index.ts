import { Handler } from 'aws-lambda';

interface Event {
  solicitudId: string;
}

interface Response {
  solicitudId: string;
  estado: string;
}

export const handler: Handler<Event, Response> = async (event) => {
  console.log('Solicitud recibida:', event);
  return {
    solicitudId: event.solicitudId,
    estado: 'SOLICITUD_ENVIADA',
  };
};
