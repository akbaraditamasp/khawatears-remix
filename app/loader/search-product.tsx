import { service } from "~/service";

const searchProducts = (product_name: string) =>
  new Promise((resolve, reject) => {
    service
      .get(
        "/products?sort[]=createdAt:descfields[]=product_name&fields[]=price&fields[]=price_before&fields[]=images&fields[]=slug&filters[product_name][$containsi]=" +
          product_name
      )
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

export default searchProducts;
