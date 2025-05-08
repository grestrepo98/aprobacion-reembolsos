export const handler = async (event: any) => {
  // Entrada: { saludo: "Hola, Juan" }
  console.log('event', event);
  const mensajeFinal = `${event.saludo}. ¡Bienvenido al sistema!`;
  return { mensajeFinal };
};
