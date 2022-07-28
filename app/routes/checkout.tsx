import { json, LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData, useNavigate, useOutletContext } from "@remix-run/react";
import { useContext, useEffect, useState } from "react";
import NumberFormat from "react-number-format";
import { CartContext } from "~/cart";
import Steps from "~/components/Steps";
import basicInformation from "~/loader/basic-information";
import { order } from "~/loader/order.client";
import sliders from "~/loader/sliders";
import { PaymentContext } from "~/payment-data";

export const meta: MetaFunction = ({ data }) => {
  return {
    title: `Checkout`,
    "og:title": `Checkout`,
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
  const { payment } = useContext(PaymentContext)!;
  const [loading, setLoading] = useState(true);
  const [checkoutData, setCheckoutData] = useState({} as any);
  const navigate = useNavigate();

  const [postLoading, setPostLoading] = useState(false);

  const getData = async (preview: boolean = true) => {
    let checkout: any = [];
    try {
      checkout = (await order(data.apiUrl, payment!, carts, preview)) as any;
    } catch (e) {}

    setLoading(false);

    if (!preview) {
      setPostLoading(false);
      cartsDispatch({ type: "CLEAR" });
      navigate("/order/" + checkout.identifier, { replace: false });
    }
    setCheckoutData(checkout);
  };

  useEffect(() => {
    setData({
      basicInformation: data.basicInfo,
    });

    getData();
  }, []);

  useEffect(() => {
    if (!payment || !carts.length) {
      navigate("/payment-data", { replace: true });
    }
  }, []);

  if (loading)
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="lds-dual-ring"></div>
      </div>
    );

  return (
    <div className="flex justify-center py-12 mb-12">
      <div className="container">
        <Steps active="checkout" />
        <div className="flex flex-col bg-white rounded-sm">
          {((checkoutData?.order_details as Array<any>) || []).map(
            (item, i) => (
              <div className="border-b p-5" key={`${i}`}>
                <div className="flex">
                  <div className="flex-1">
                    <div className="font-bold montserrat text-sm lg:text-base">
                      {item.product_name}
                    </div>
                    <div className="text-xs lg:text-sm">{item.message}</div>
                  </div>
                  <div>x{item.qty}</div>
                  <div className="ml-5  w-1/4 text-right">
                    <NumberFormat
                      displayType="text"
                      prefix="Rp"
                      thousandSeparator={true}
                      value={item.product_price * item.qty}
                      className="text-lg"
                    />
                  </div>
                </div>
              </div>
            )
          )}
          <div className="flex justify-between px-5 py-3 bg-gray-50">
            <span className="font-bold">Total</span>
            <NumberFormat
              displayType="text"
              prefix="Rp"
              thousandSeparator={true}
              value={
                checkoutData?.total -
                (checkoutData?.information?.shipping_cost || 0)
              }
              className="text-lg"
            />
          </div>
          {checkoutData?.information?.shipping_cost ? (
            <div className="flex justify-between px-5 py-3 bg-gray-50 border-t">
              <span className="font-bold">Ongkos Kirim</span>
              <NumberFormat
                displayType="text"
                prefix="Rp"
                thousandSeparator={true}
                value={checkoutData?.information?.shipping_cost}
                className="text-lg"
              />
            </div>
          ) : null}
          <div className="flex justify-between px-5 py-3 bg-gray-50 border-t">
            <span className="font-bold">Grand Total</span>
            <NumberFormat
              displayType="text"
              prefix="Rp"
              thousandSeparator={true}
              value={checkoutData?.total}
              className="text-lg"
            />
          </div>
        </div>
        {carts.length ? (
          <div className="mt-5 flex">
            <button
              type="button"
              onClick={() => {
                setPostLoading(true);
                getData(false);
              }}
              className="bg-primary-base rounded-sm text-white py-3 px-6 flex-1 lg:flex-none text-center ml-auto"
            >
              Konfirmasi &raquo;
            </button>
          </div>
        ) : null}
      </div>
      {postLoading ? (
        <div className="w-full h-screen fixed top-0 left-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="lds-dual-ring"></div>
        </div>
      ) : null}
    </div>
  );
}
