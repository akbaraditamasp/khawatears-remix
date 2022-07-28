import axios from "axios";
import { CartItem } from "~/cart";

const cart = (apiUrl: string, carts: CartItem[]) =>
  new Promise((resolve, reject) => {
    axios
      .post(`${apiUrl}/api/order/cart`, { carts })
      .then((response) => {
        resolve(response.data);
      })
      .catch(() => {
        reject();
      });
  });

export { cart };
