import { service } from "~/service";

const basicInformation = () =>
  new Promise((resolve, reject) => {
    service
      .get("/basic-information")
      .then((response) => {
        resolve(response.data.data.attributes);
      })
      .catch((e) => {
        if (e.response?.status === 500) {
          reject("Server error");
        }
      });
  });

export default basicInformation;
