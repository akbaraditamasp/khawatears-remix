import { service } from "~/service";

const sliders = () =>
  new Promise((resolve, reject) => {
    service
      .get("/slider")
      .then((response) => {
        resolve(response.data.data);
      })
      .catch((e) => {
        if (e.response?.status === 500) {
          reject("Server error");
        }
      });
  });

export default sliders;
