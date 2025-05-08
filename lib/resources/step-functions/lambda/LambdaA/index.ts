import { Handler } from 'aws-lambda';

interface Event {
  name: string;
}

interface Response {
  saludo: string;
}

export const handler: Handler<Event, Response> = async (event) => {
  console.log('event', event);
  const saludo = `Hola, ${event.name}`;
  return { saludo };
};
