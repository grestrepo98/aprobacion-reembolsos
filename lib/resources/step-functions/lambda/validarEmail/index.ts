import { Handler } from 'aws-lambda';

interface Event {
  email: string;
}

interface Response {
  emailValido: boolean;
}

export const handler: Handler<Event, Response> = async (event) => {
  const emailValido = event.email?.includes('@') ?? false;
  return { emailValido };
};
