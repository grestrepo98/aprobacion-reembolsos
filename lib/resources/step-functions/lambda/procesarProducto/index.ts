import { Handler } from 'aws-lambda';

interface Producto {
  id: string;
  cantidad: number;
}

interface Resultado {
  id: string;
  enStock: boolean;
}

export const handler: Handler<{ producto: Producto }, Resultado> = async (
  event
) => {
  const producto = event.producto;
  const enStock = producto.cantidad <= 10;
  return {
    id: producto.id,
    enStock,
  };
};
