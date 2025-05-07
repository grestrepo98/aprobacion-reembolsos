export const handler = async (event: any) => {
  // Entrada: { saludo: "Hola, Juan" }
  const mensajeFinal = `${event.saludo}. ¡Bienvenido al sistema!`;
  return { mensajeFinal };
};
