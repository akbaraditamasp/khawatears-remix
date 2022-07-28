import { json, LoaderFunction, MetaFunction } from "@remix-run/node";
import {
  Link,
  useLoaderData,
  useNavigate,
  useOutletContext,
} from "@remix-run/react";
import { useContext, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { CartContext } from "~/cart";
import DataForm from "~/components/DataForm";
import FancyAlert, { FancyAlertAction } from "~/components/FancyAlert";
import Modal, { ModalType } from "~/components/Modal";
import Steps from "~/components/Steps";
import TextareaInput from "~/components/TextareaInput";
import TextInput from "~/components/TextInput";
import basicInformation from "~/loader/basic-information";
import { checkAddress } from "~/loader/check-address.client";
import courier from "~/loader/courier";
import sliders from "~/loader/sliders";
import { PaymentContext, PaymentData } from "~/payment-data";

export const meta: MetaFunction = ({ data }) => {
  return {
    title: `Isi Data`,
    "og:title": `Isi Data`,
    "og:url": data.url,
    "og:type": "website",
  };
};

export const loader: LoaderFunction = async ({ request }) => {
  let basicInfo: any = null;
  let getSliders: any = null;
  let getCourier: any = null;
  try {
    basicInfo = await basicInformation();
    getSliders = await sliders();
    getCourier = await courier();
  } catch (e) {
    return json({});
  }

  return json({
    basicInfo,
    sliders: getSliders,
    courier: getCourier,
    apiUrl: process.env.API_URL,
    url: request.url,
  });
};

export default function cart() {
  const data = useLoaderData();
  const { setData }: any = useOutletContext();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { register, control, handleSubmit, watch, setValue, reset } = useForm();

  const { carts } = useContext(CartContext)!;
  const { payment, paymentDispatch } = useContext(PaymentContext)!;

  const _modal = useRef<null | ModalType>(null);
  const _error = useRef<null | FancyAlertAction>(null);

  const save = async (payment: PaymentData) => {
    setLoading(true);
    try {
      if (await checkAddress(data.apiUrl, payment.information.address)) {
        setLoading(false);
        paymentDispatch({ type: "UPDATE", payload: payment });
        _modal.current?.toggle();
      } else {
        setLoading(false);
        _error.current?.toggle();
      }
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
    setData({
      basicInformation: data.basicInfo,
    });
  }, []);

  useEffect(() => {
    if (!carts.length) {
      navigate("/cart", { replace: true });
    }
  }, [carts]);

  useEffect(() => {
    if (!payment) {
      _modal.current?.toggle()!;
    } else {
      reset(payment);
    }
  }, [payment, _modal]);

  return (
    <div className="flex justify-center py-12 mb-12">
      <div className="container">
        <Steps active="data" />
        <div className="bg-white rounded-sm p-5">
          <DataForm title="Nama">{payment?.customer_name}</DataForm>
          <DataForm title="No. Whatsapp">{payment?.customer_whatsapp}</DataForm>
          <DataForm title="Alamat">
            {payment ? (
              <div>
                {payment?.information.address.detail}, Kec.{" "}
                {payment?.information.address.subdistrict},{" "}
                {payment?.information.address.city.type}{" "}
                {payment?.information.address.city.name},{" "}
                {payment?.information.address.province} -{" "}
                {payment?.information.address.postal_code}
              </div>
            ) : (
              ""
            )}
          </DataForm>
          <DataForm title="Pengiriman">
            {payment && payment?.information.shipping !== "COD"
              ? `${payment?.information.shipping.toUpperCase()} - ${payment?.information.shipping_service.toUpperCase()}`
              : "COD"}
          </DataForm>
        </div>
        <div className="mt-5 flex">
          <button
            onClick={() => _modal.current?.toggle()}
            className="bg-gray-300 rounded-sm py-3 px-6 flex-1 lg:flex-none text-center mr-auto"
          >
            Edit Data
          </button>
          {payment ? (
            <Link
              to="/checkout"
              className="bg-primary-base rounded-sm text-white py-3 px-6 flex-1 lg:flex-none text-center ml-3"
            >
              Lanjutkan &raquo;
            </Link>
          ) : null}
        </div>
        <Modal ref={_modal} title="Isi Data">
          <div>
            <TextInput
              label="Nama Lengkap"
              type="text"
              containerClassName="mb-4"
              {...register("customer_name", { required: true })}
            />
            <TextInput
              label="No. Whatsapp"
              type="text"
              containerClassName="mb-4"
              {...register("customer_whatsapp", { required: true })}
            />
            <TextareaInput
              label="Alamat"
              containerClassName="mb-4"
              {...register("information.address.detail", { required: true })}
            />
            <TextInput
              label="Kecamatan"
              type="text"
              containerClassName="flex-1 mr-3 mb-4"
              {...register("information.address.subdistrict", {
                required: true,
              })}
            />
            <TextInput
              label="Kota/Kabupaten"
              type="text"
              containerClassName="flex-1 mr-3 mb-4"
              left={
                <select
                  className="h-10 bg-white border rounded-sm px-2 mr-2"
                  {...register("information.address.city.type", {
                    required: true,
                  })}
                >
                  <option value="Kabupaten">Kabupaten</option>
                  <option value="Kota">Kota</option>
                </select>
              }
              {...register("information.address.city.name", { required: true })}
            />
            <TextInput
              label="Provinsi"
              type="text"
              containerClassName="flex-1 mr-3 mb-4"
              {...register("information.address.province", {
                required: true,
              })}
            />
            <TextInput
              label="Kode POS"
              type="text"
              containerClassName="flex-1 mr-3 mb-4"
              {...register("information.address.postal_code", {
                required: true,
              })}
            />
            <Controller
              control={control}
              name="information.shipping"
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <div className="mb-4">
                  <label>Kurir</label>
                  <div className="flex flex-wrap mt-1">
                    {[...Object.keys(data.courier), "COD"].map((item, i) => (
                      <button
                        key={`${i}`}
                        type="button"
                        onClick={() => {
                          setValue("information.shipping_service", "");
                          onChange(item);
                        }}
                        className={`py-2 px-5 border rounded-sm mr-3 ${
                          value === item
                            ? "border-blue-400 bg-blue-300"
                            : "bg-white border-gray-300"
                        }`}
                      >
                        {item.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            />
            {watch("information.shipping") !== "COD" ? (
              <Controller
                control={control}
                name="information.shipping_service"
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <div
                    className={`mb-4 ${
                      watch("information.shipping") ? "block" : "hidden"
                    }`}
                  >
                    <label>Layanan</label>
                    <div className="flex flex-wrap mt-1">
                      {(
                        (data.courier[
                          watch(
                            "information.shipping"
                          ) as keyof typeof data.courier
                        ] || []) as Array<string>
                      ).map((item, i) => (
                        <button
                          key={`${i}`}
                          type="button"
                          onClick={() => onChange(item)}
                          className={`py-2 px-5 border rounded-sm mr-3 ${
                            value === item
                              ? "border-blue-400 bg-blue-300"
                              : "bg-white border-gray-300"
                          }`}
                        >
                          {item.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              />
            ) : null}
            <div className="mt-5 pt-5 border-t -mx-5 px-5 flex items-center">
              <button
                type="button"
                className="h-10 flex-1 text-white bg-primary-base rounded-sm flex justify-center items-center ml-auto"
                onClick={handleSubmit((data) => {
                  save(data as PaymentData);
                })}
              >
                Atur
              </button>
            </div>
          </div>
        </Modal>
      </div>
      <FancyAlert
        title="Ups..."
        message="Alamat yang kamu masukkan sepertinya tidak valid"
        footer={
          <div className="flex p-5 mt-5">
            <button
              type="button"
              className="flex-1 py-3 px-5 rounded-sm bg-gray-300"
              onClick={(e) => _error.current?.toggle()}
            >
              Tutup
            </button>
          </div>
        }
        type="error"
        ref={_error}
      />
      {loading ? (
        <div className="w-full h-screen fixed top-0 left-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="lds-dual-ring"></div>
        </div>
      ) : null}
    </div>
  );
}
