import axios from "axios";
import { CartItem } from "~/cart";
import { PaymentData } from "~/payment-data";

const order = (
  apiUrl: string,
  payment: PaymentData,
  carts: CartItem[],
  preview: boolean
) =>
  new Promise((resolve, reject) => {
    axios
      .post(`${apiUrl}/api/order`, { ...payment, carts, preview })
      .then((response) => {
        resolve(response.data);
      })
      .catch(() => {
        reject();
      });
  });

export { order };
