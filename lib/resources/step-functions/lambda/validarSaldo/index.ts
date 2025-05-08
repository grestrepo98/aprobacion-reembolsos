import { Handler } from 'aws-lambda';

interface Event {
  saldo: number;
}

interface Response {
  saldoSuficiente: boolean;
}

export const handler: Handler<Event, Response> = async (event) => {
  const saldoSuficiente = event.saldo >= 500;
  return { saldoSuficiente };
};
