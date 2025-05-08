import { Handler } from 'aws-lambda';

interface Event {
  monto: number;
}

interface Response {
  monto: number;
  requiereRevision: boolean;
}

export const handler: Handler<Event, Response> = async (event) => {
  const requiereRevision = event.monto > 5000;
  return {
    monto: event.monto,
    requiereRevision,
  };
};
