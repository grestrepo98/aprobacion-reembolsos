export const handler = async (event: any) => {
  // Entrada esperada: { name: "Juan" }
  console.log('event', event);
  const saludo = `Hola, ${event.name}`;
  return { saludo };
};
