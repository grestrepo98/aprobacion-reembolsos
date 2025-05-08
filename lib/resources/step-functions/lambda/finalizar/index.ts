import { Handler } from 'aws-lambda';

// interface Event {
//   ValidarEmail: { emailValido: boolean };
//   ValidarSaldo: { saldoSuficiente: boolean };
// }

type Event = [{ emailValido: boolean }, { saldoSuficiente: boolean }];

interface Response {
  validacionCompleta: string;
}

export const handler: Handler<Event, Response> = async (event) => {
  console.log('event', event);
  const todoOk = event[0].emailValido && event[1].saldoSuficiente;
  return {
    validacionCompleta: todoOk ? 'TODO_OK' : 'FALLO_VALIDACION',
  };
};
