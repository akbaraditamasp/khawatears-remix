import { service } from "~/service";

const product = (slug: string) =>
  new Promise((resolve, reject) => {
    service
      .get(`/product/slug/${slug}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((e) => {
        if (e.response?.status === 500) {
          reject("Server error");
        }
      });
  });

export default product;
