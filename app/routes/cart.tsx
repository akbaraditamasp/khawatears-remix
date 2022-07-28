import { json, LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData, useOutletContext } from "@remix-run/react";
import { useContext, useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import NumberFormat from "react-number-format";
import { CartContext } from "~/cart";
import Steps from "~/components/Steps";
import basicInformation from "~/loader/basic-information";
import { cart as getCart } from "~/loader/cart.client";
import sliders from "~/loader/sliders";

type Product = {
  id: number;
  product_name: string;
  price: number;
};

type CartData = {
  id: number;
  qty: number;
  message: string | null;
  product: Product;
};

export const meta: MetaFunction = ({ data }) => {
  return {
    title: `Keranjang`,
    "og:title": `Keranjang`,
    "og:url": data.url,
    "og:type": "website",
  };
};

export const loader: LoaderFunction = async ({ request }) => {
  let basicInfo: any = null;
  let getSliders: any = null;
  try {
    basicInfo = await basicInformation();
    getSliders = await sliders();
  } catch (e) {
    return json({});
  }

  return json({
    basicInfo,
    sliders: getSliders,
    apiUrl: process.env.API_URL,
    url: request.url,
  });
};

export default function cart() {
  const data = useLoaderData();
  const { setData }: any = useOutletContext();
  const { carts, cartsDispatch } = useContext(CartContext)!;
  const [loading, setLoading] = useState(true);
  const [cartData, setCartData] = useState<CartData[]>([]);
  const [total, setTotal] = useState(0);

  const getData = async () => {
    let cart: CartData[] = [];
    try {
      cart = (await getCart(data.apiUrl, carts)) as CartData[];
    } catch (e) {}

    setCartData(cart);
    setLoading(false);
  };

  useEffect(() => {
    setData({
      basicInformation: data.basicInfo,
    });

    getData();
  }, []);

  useEffect(() => {
    let total = 0;
    for (let val of cartData) {
      total += val.qty * val.product.price;
    }

    setTotal(total);
  }, [cartData]);

  if (loading)
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="lds-dual-ring"></div>
      </div>
    );

  return (
    <div className="flex justify-center py-12 mb-12">
      <div className="container">
        <Steps active="cart" />
        <div className="flex flex-col bg-white rounded-sm">
          {cartData.length ? (
            cartData.map((item, i) => (
              <div className="border-b p-5" key={`${i}`}>
                <div className="flex">
                  <div className="flex-1">
                    <div className="font-bold montserrat text-sm lg:text-base">
                      {item.product.product_name}
                    </div>
                    <div className="text-xs lg:text-sm">{item.message}</div>
                  </div>
                  <div className="ml-5">
                    <NumberFormat
                      displayType="text"
                      prefix="Rp"
                      thousandSeparator={true}
                      value={item.product.price * item.qty}
                      className="text-lg"
                    />
                  </div>
                </div>
                <div className="flex items-center mt-3">
                  <button
                    type="button"
                    onClick={() => {
                      const qty = Number(carts[i].qty) - 1;
                      if (qty > 0) {
                        cartsDispatch({ type: "CHANGE", payload: { i, qty } });
                        setCartData((value) => {
                          const temp = value;
                          temp[i].qty = qty;
                          return [...temp];
                        });
                      } else {
                        cartsDispatch({ type: "REMOVE", payload: { i } });
                        setCartData((value) => {
                          const temp = value;
                          temp.splice(i, 1);
                          return [...temp];
                        });
                      }
                    }}
                    className="text-xs rounded-sm bg-gray-500 text-white w-8 h-8 flex justify-center items-center"
                  >
                    <FaMinus />
                  </button>
                  <input
                    type="number"
                    className="w-16 h-8 mx-3 rounded-sm bg-white border text-center"
                    value={`${item.qty}`}
                    onChange={(e) => {
                      const qty = Number(e.target.value);
                      cartsDispatch({
                        type: "CHANGE",
                        payload: { i, qty: qty },
                      });
                      setCartData((value) => {
                        const temp = value;
                        temp[i].qty = qty;
                        return [...temp];
                      });
                    }}
                    onBlur={(e) => {
                      const qty = Number(e.target.value);
                      if (qty > 0) {
                        cartsDispatch({
                          type: "CHANGE",
                          payload: { i, qty: qty },
                        });
                        setCartData((value) => {
                          const temp = value;
                          temp[i].qty =
                            Number(e.target.value) >= 1
                              ? Number(e.target.value)
                              : 1;
                          return [...temp];
                        });
                      } else {
                        cartsDispatch({ type: "REMOVE", payload: { i } });
                        setCartData((value) => {
                          const temp = value;
                          temp.splice(i, 1);
                          return [...temp];
                        });
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const qty = Number(carts[i].qty) + 1;
                      cartsDispatch({ type: "CHANGE", payload: { i, qty } });
                      setCartData((value) => {
                        const temp = value;
                        temp[i].qty = qty;
                        return [...temp];
                      });
                    }}
                    className="text-xs rounded-sm bg-gray-500 text-white w-8 h-8 flex justify-center items-center"
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-5">Belum ada item</div>
          )}
          {cartData.length ? (
            <div className="flex justify-between p-5 bg-gray-50">
              <span className="font-bold">Total</span>
              <NumberFormat
                displayType="text"
                prefix="Rp"
                thousandSeparator={true}
                value={total}
                className="text-lg"
              />
            </div>
          ) : null}
        </div>
        {carts.length ? (
          <div className="mt-5 flex">
            <Link
              to="/payment-data"
              className="bg-primary-base rounded-sm text-white py-3 px-6 flex-1 lg:flex-none text-center ml-auto"
            >
              Lanjutkan &raquo;
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
