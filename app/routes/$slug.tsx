import { json, LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData, useOutletContext } from "@remix-run/react";
import { useEffect, useState } from "react";
import NumberFormat from "react-number-format";
import basicInformation from "~/loader/basic-information";
import product from "~/loader/product";
import ReactMarkdown from "react-markdown";
import { FaShoppingBag, FaTimes } from "react-icons/fa";

export const meta: MetaFunction = ({ data }) => {
  return {
    title: `Jual ${data?.product?.product_name}`,
  };
};

export const loader: LoaderFunction = async ({ params }) => {
  let basicInfo: any = null;
  let getProduct: any = null;

  try {
    basicInfo = await basicInformation();
    getProduct = await product(params.slug!);
  } catch (e) {
    return json({});
  }

  return json({
    basicInfo,
    product: getProduct,
  });
};

export default function Detail() {
  const data = useLoaderData();
  const [active, setActive] = useState(0);
  const [show, setShow] = useState(false);
  const { setData }: any = useOutletContext();
  useEffect(() => {
    setData({
      basicInformation: data.basicInfo,
    });
  }, []);

  return (
    <div className="flex justify-center py-12 mb-12">
      <div className="container flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/3">
          <div className="p-5 bg-white rounded-sm">
            <div
              className={`${
                show ? "fixed w-full h-full" : "static w-auto h-auto"
              } top-0 left-0 bg-white z-30 flex justify-center items-center`}
            >
              <div className={show ? "w-full lg:w-1/3" : "w-full"}>
                <div className="w-1-1 bg-gray-200 rounded-sm">
                  <img
                    src={
                      "https://image-webp.herokuapp.com/?width=700&height=700&url=" +
                      encodeURIComponent(
                        ((data.product?.images || [""]) as Array<any>)[active]
                      )
                    }
                    alt={data.product?.product_name}
                    title={data.product.product_name}
                  />
                  <button
                    type="button"
                    className="w-full h-full absolute top-0 left-0"
                    onClick={() => setShow((value) => !value)}
                  ></button>
                </div>
              </div>
              {show ? (
                <button
                  type="button"
                  className="absolute top-0 right-0 p-5"
                  onClick={() => setShow(false)}
                >
                  <FaTimes size={24}/>
                </button>
              ) : null}
            </div>
            <div className="grid grid-flow-row grid-cols-3 gap-3 mt-5">
              {((data.product?.images || []) as Array<any>).map(
                (item, index) => (
                  <div
                    className={`w-1-1 bg-gray-200 border-2 ${
                      active === index
                        ? "border-primary-base"
                        : "border-transparent"
                    }`}
                    key={`${index}`}
                  >
                    <img
                      src={
                        "https://image-webp.herokuapp.com/?width=700&height=700&url=" +
                        encodeURIComponent(item)
                      }
                      alt={data.product?.product_name}
                      title={data.product.product_name}
                    />
                    <button
                      type="button"
                      className="absolute top-0 left-0 w-full h-full"
                      onClick={() => setActive(index)}
                    ></button>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
        <div className="flex-1 ml-0 lg:ml-8 mt-5 lg:mt-0">
          <h1 className="text-2xl font-bold text-gray-800">
            {data.product.product_name}
          </h1>
          <div className="flex mb-5">
            <h2 className="text-secondary text-xl font-bold">
              <NumberFormat
                thousandSeparator={true}
                prefix="Rp"
                displayType="text"
                value={data.product.price}
              />
            </h2>
            {data.product.price_before ? (
              <span className="text-lg line-through ml-2">
                <NumberFormat
                  thousandSeparator={true}
                  prefix="Rp"
                  displayType="text"
                  value={data.product.price_before}
                />
              </span>
            ) : null}
          </div>
          <a
            target="_blank"
            href={`https://wa.me/${
              data.basicInfo?.whatsapp_no
            }?text=${data.basicInfo?.whatsapp_order_text.replace(
              "%product%",
              data.product?.product_name
            )}`}
            className="inline-flex items-center py-3 px-5 bg-primary-base text-white mb-12 rounded-sm"
            title={`Pesan ${data.product?.product_name} via Whatsapp`}
          >
            <FaShoppingBag className="inline-table mr-2" />
            Beli Sekarang
          </a>
          {((data.product.spec || []) as Array<any>).map((item, index) => (
            <div
              className={
                "flex border-b py-3 border-gray-300 " +
                (index === 0 ? "border-t" : "")
              }
              key={`${index}`}
            >
              <div className="w-1/2">{item.key}</div>
              <div className="flex-1 text-right font-bold">{item.value}</div>
            </div>
          ))}
          <h3 className="text-gray-800 font-bold mt-8 mb-3">Description</h3>
          <p className="unstyled text-justify">
            <ReactMarkdown children={data.product.description} />
          </p>
        </div>
      </div>
    </div>
  );
}
