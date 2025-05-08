import { Handler } from 'aws-lambda';

interface Event {
  ValidarEmail: { emailValido: boolean };
  ValidarSaldo: { saldoSuficiente: boolean };
}

interface Response {
  validacionCompleta: string;
}

export const handler: Handler<Event, Response> = async (event) => {
  const todoOk =
    event.ValidarEmail.emailValido && event.ValidarSaldo.saldoSuficiente;
  return {
    validacionCompleta: todoOk ? 'TODO_OK' : 'FALLO_VALIDACION',
  };
};
