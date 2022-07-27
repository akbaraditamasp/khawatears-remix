import { service } from "~/service";

const basicInformation = () =>
  new Promise((resolve, reject) => {
    service
      .get("/store")
      .then((response) => {
        resolve(response.data);
      })
      .catch((e) => {
        if (e.response?.status === 500) {
          reject("Server error");
        }
      });
  });

export default basicInformation;
