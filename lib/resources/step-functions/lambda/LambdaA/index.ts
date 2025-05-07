export const handler = async (event: any) => {
  // Entrada esperada: { name: "Juan" }
  const saludo = `Hola, ${event.name}`;
  return { saludo };
};
