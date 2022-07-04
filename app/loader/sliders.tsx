import { service } from "~/service";

const sliders = () =>
  new Promise((resolve, reject) => {
    service
      .get("/sliders")
      .then((response) => {
        resolve(
          ((response.data.data || []) as Array<any>).map((item) => ({
            id: item.id,
            ...item.attributes,
          }))
        );
      })
      .catch((e) => {
        if (e.response?.status === 500) {
          reject("Server error");
        }
      });
  });

export default sliders;
