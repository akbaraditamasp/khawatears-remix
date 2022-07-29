import { json, LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData, useOutletContext } from "@remix-run/react";
import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaMinus, FaPlus, FaShoppingBag, FaTimes } from "react-icons/fa";
import NumberFormat from "react-number-format";
import { CartContext } from "~/cart";
import FancyAlert, { FancyAlertAction } from "~/components/FancyAlert";
import Modal, { ModalType } from "~/components/Modal";
import basicInformation from "~/loader/basic-information";
import product from "~/loader/product";

export const meta: MetaFunction = ({ data }) => {
  return {
    title: `Jual ${data?.product?.product_name}`,
    descrption: ((data?.product?.description || "") as string)
      .replace(/<[^>]*(>|$)|&nbsp;|&zwnj;|&raquo;|&laquo;|&gt;/g, "")
      .substring(0, 200),
    "og:title": `Jual ${data?.product?.product_name}`,
    "og:url": data.url,
    "og:image": data?.product?.images?.length
      ? data.product?.images[0].url
      : undefined,
    "og:type": "website",
    "og:description": data?.product?.description.substr(0, 200),
  };
};

export const loader: LoaderFunction = async ({ params, request }) => {
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
    url: request.url,
  });
};

type AddCart = {
  qty: string | number;
  message: string;
};

export default function Detail() {
  const data = useLoaderData();
  const [active, setActive] = useState(0);
  const [show, setShow] = useState(false);
  const { setData }: any = useOutletContext();
  const _modal = useRef<null | ModalType>(null);
  const _alert = useRef<null | FancyAlertAction>(null);
  const { cartsDispatch } = useContext(CartContext)!;

  const { control, register, handleSubmit, reset } = useForm({
    defaultValues: {
      qty: "1",
      message: "",
    },
  });

  const onAddCart = ({ qty, message }: AddCart) => {
    cartsDispatch({
      type: "ADD",
      payload: {
        id: data.product?.id,
        qty: Number(qty),
        message,
      },
    });

    _alert.current?.toggle();
    _modal.current?.toggle();
    reset({
      qty: "1",
      message: "",
    });
  };

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
                <div className="w-1-1 bg-gray-400 rounded-sm">
                  <img
                    src={
                      ((data.product?.images || [""]) as Array<any>)[active].url
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
                  <FaTimes size={24} />
                </button>
              ) : null}
            </div>
            <div className="grid grid-flow-row grid-cols-3 gap-3 mt-5">
              {((data.product?.images || []) as Array<any>).map(
                (item, index) => (
                  <div
                    className={`w-1-1 bg-gray-400 border-2 ${
                      active === index
                        ? "border-primary-base"
                        : "border-transparent"
                    }`}
                    key={`${index}`}
                  >
                    <img
                      src={item.url}
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
          <button
            onClick={() => _modal.current?.toggle()}
            className="inline-flex items-center py-3 px-5 bg-primary-base text-white mb-12 rounded-sm"
          >
            <FaShoppingBag className="inline-table mr-2" />
            Tambah ke Keranjang
          </button>
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
          <div
            className="unstyled text-justify"
            dangerouslySetInnerHTML={{ __html: data?.product?.description }}
          />
        </div>
      </div>
      <Modal ref={_modal} title="Tambahkan ke Keranjang">
        <Fragment>
          <label>Keterangan</label>
          <textarea
            className="border rounded-sm p-3 block w-full mt-1"
            placeholder="Ukuran M ya"
            {...register("message")}
          ></textarea>
          <div className="mt-5 pt-5 border-t -mx-5 px-5 flex items-center">
            <Controller
              control={control}
              rules={{ required: true, min: 1 }}
              name="qty"
              render={({ field: { value, onChange } }) => (
                <div className="flex items-center mr-5">
                  <button
                    type="button"
                    onClick={() =>
                      onChange(
                        `${Number(value) > 1 ? Number(value) - 1 : value}`
                      )
                    }
                    className="text-xs rounded-sm bg-gray-500 text-white w-10 h-10 flex justify-center items-center"
                  >
                    <FaMinus />
                  </button>
                  <input
                    type="number"
                    className="w-24 h-10 mx-3 rounded-sm bg-white border px-3 text-center"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onBlur={(e) =>
                      onChange(
                        Number(e.target.value) >= 1 ? e.target.value : "1"
                      )
                    }
                  />
                  <button
                    type="button"
                    onClick={() => onChange(`${Number(value) + 1}`)}
                    className="text-xs rounded-sm bg-gray-500 text-white w-10 h-10 flex justify-center items-center"
                  >
                    <FaPlus />
                  </button>
                </div>
              )}
            />
            <button
              type="button"
              className="h-10 flex-1 text-white bg-primary-base rounded-sm flex justify-center items-center ml-auto"
              onClick={handleSubmit(onAddCart)}
            >
              Tambah
            </button>
          </div>
        </Fragment>
      </Modal>
      <FancyAlert
        title="Berhasil"
        message="Item berhasil ditambahkan ke keranjang anda"
        footer={
          <div className="flex p-5 mt-5">
            <button
              type="button"
              className="flex-1 h-10 flex justify-center text-center items-center py-3 px-5 rounded-sm bg-gray-300"
              onClick={(e) => _alert.current?.toggle()}
            >
              Lanjut Belanja
            </button>
            <Link
              to={"/checkout"}
              type="button"
              className="ml-3 flex-1 flex justify-center items-center h-10 py-3 px-5 rounded-sm bg-primary-base text-white text-center"
            >
              Checkout
            </Link>
          </div>
        }
        type="success"
        ref={_alert}
      />
    </div>
  );
}
