import { service } from "~/service";

const detailOrder = (identifier: string) =>
  new Promise((resolve, reject) => {
    service
      .get(`/order/identifier/${identifier}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((e) => {
        if (e.response?.status === 500) {
          reject("Server error");
        }
      });
  });

export default detailOrder;
