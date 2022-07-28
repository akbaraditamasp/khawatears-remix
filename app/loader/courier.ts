import { service } from "~/service";

const courier = () =>
  new Promise((resolve, reject) => {
    service
      .get(`/order/courier`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((e) => {
        if (e.response?.status === 500) {
          reject("Server error");
        }
      });
  });

export default courier;
