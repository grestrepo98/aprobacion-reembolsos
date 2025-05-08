import { Handler } from 'aws-lambda';

interface Event {
  monto: number;
  requiereRevision: boolean;
}

interface Response {
  estado: string;
}

export const handler: Handler<Event, Response> = async (event) => {
  return {
    estado: 'APROBADO_AUTOMATICAMENTE',
  };
};
