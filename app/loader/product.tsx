import { service } from "~/service";

const product = (slug: string) =>
  new Promise((resolve, reject) => {
    service
      .get(`/products?filters[slug]=${slug}`)
      .then((response) => {
        if (!response.data.data.length) {
          resolve({});
          return;
        }

        const item = response.data.data[0];
        resolve({
          id: item.id,
          ...item.attributes,
        });
      })
      .catch((e) => {
        if (e.response?.status === 500) {
          reject("Server error");
        }
      });
  });

export default product;
