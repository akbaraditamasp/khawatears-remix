import axios from "axios";
import { Address } from "~/payment-data";

const checkAddress = (apiUrl: string, address: Address) =>
  new Promise((resolve) => {
    axios
      .post(`${apiUrl}/api/order/check-address`, { address })
      .then((response) => {
        resolve(true);
      })
      .catch(() => {
        resolve(false);
      });
  });

export { checkAddress };
