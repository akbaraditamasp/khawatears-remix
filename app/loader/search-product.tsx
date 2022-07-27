import { service } from "~/service";

const searchProducts = (product_name: string) =>
  new Promise((resolve, reject) => {
    service
      .get("/product?q=" + product_name)
      .then((response) => {
        resolve(response.data.data);
      })
      .catch((e) => {
        if (e.response?.status === 500) {
          reject("Server error");
        }
      });
  });

export default searchProducts;
