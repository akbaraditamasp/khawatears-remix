import { json, LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData, useNavigate, useOutletContext } from "@remix-run/react";
import { useEffect } from "react";
import { FaMinus } from "react-icons/fa";
import NumberFormat from "react-number-format";
import DataForm from "~/components/DataForm";
import basicInformation from "~/loader/basic-information";
import detailOrder from "~/loader/detail-order";
import sliders from "~/loader/sliders";

export const meta: MetaFunction = ({ data }) => {
  return {
    title: `Detail Pesanan`,
    "og:title": `Detail Pesanan`,
    "og:url": data.url,
    "og:type": "website",
  };
};

export const loader: LoaderFunction = async ({ params, request }) => {
  let basicInfo: any = null;
  let getSliders: any = null;
  let getData: any = null;
  try {
    basicInfo = await basicInformation();
    getSliders = await sliders();
    getData = await detailOrder(params.identifier!);
  } catch (e) {
    return json({});
  }

  return json({
    basicInfo,
    sliders: getSliders,
    apiUrl: process.env.API_URL,
    url: request.url,
    order: getData,
  });
};

export default function cart() {
  const data = useLoaderData();
  const { setData }: any = useOutletContext();
  const navigate = useNavigate();

  useEffect(() => {
    setData({
      basicInformation: data.basicInfo,
    });
  }, []);

  useEffect(() => {
    if (!data.order) {
      navigate("/", { replace: true });
    }
  }, [data]);

  return (
    <div className="flex justify-center py-12 mb-12">
      <div className="container">
        <div className="mb-10 font-bold text-center text-2xl flex justify-center items-center montserrat text-gray-800 rounded-sm">
          <h2 className="bg-bg">Detail Pesanan</h2>
        </div>
        <div className="font-bold text-lg pb-3 border-b-2 border-gray-500 flex items-center">
          <FaMinus className="mr-3" />
          Rincian
        </div>
        <div className="flex flex-col bg-white rounded-sm mb-8">
          {((data.order?.details as Array<any>) || []).map((item, i) => (
            <div className="border-b p-5" key={`${i}`}>
              <div className="flex">
                <div className="flex-1">
                  <div className="font-bold montserrat text-sm lg:text-base">
                    {item.product_name}
                  </div>
                  <div className="text-xs lg:text-sm">{item.message}</div>
                </div>
                <div>x{item.qty}</div>
                <div className="ml-5 w-1/4 text-right">
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
          ))}
          <div className="flex justify-between px-5 py-3 bg-gray-50">
            <span className="font-bold">Total</span>
            <NumberFormat
              displayType="text"
              prefix="Rp"
              thousandSeparator={true}
              value={
                data.order?.total -
                (data.order?.information?.shipping_cost || 0)
              }
              className="text-lg"
            />
          </div>
          {data.order?.information?.shipping_cost ? (
            <div className="flex justify-between px-5 py-3 bg-gray-50 border-t">
              <span className="font-bold">Ongkos Kirim</span>
              <NumberFormat
                displayType="text"
                prefix="Rp"
                thousandSeparator={true}
                value={data.order?.information?.shipping_cost}
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
              value={data.order?.total}
              className="text-lg"
            />
          </div>
        </div>

        <div className="font-bold text-lg pb-3 border-b-2 border-gray-500 flex items-center">
          <FaMinus className="mr-3" />
          Informasi
        </div>
        <div className="bg-white rounded-sm p-5">
          <DataForm title="No. Transaksi">{data.order?.identifier}</DataForm>
          <DataForm title="Nama">{data.order?.customer_name}</DataForm>
          <DataForm title="No. Whatsapp">
            {data.order?.customer_whatsapp}
          </DataForm>
          <DataForm title="Alamat">
            <div>
              {data.order?.information.address.detail}, Kec.{" "}
              {data.order?.information.address.subdistrict},{" "}
              {data.order?.information.address.city.type}{" "}
              {data.order?.information.address.city.name},{" "}
              {data.order?.information.address.province} -{" "}
              {data.order?.information.address.postal_code}
            </div>
          </DataForm>
          <DataForm title="Pengiriman">
            {data.order?.information.shipping !== "COD"
              ? `${data.order?.information.shipping.toUpperCase()} - ${data.order?.information.shipping_service.toUpperCase()}`
              : "COD"}
          </DataForm>
          <DataForm title="Status">
            <div
              className={`font-bold ${
                data.order?.is_paid ? "text-blue-600" : "text-yellow-600"
              }`}
            >
              {data.order?.is_paid ? "DIKEMAS" : "MENUNGGU PEMBAYARAN"}
            </div>
          </DataForm>
        </div>
        {!data.order?.is_paid ? (
          <div className="mt-5 flex">
            <a
              title="Selesaikan Pembayaran"
              href={data.order?.payment_link}
              className="bg-primary-base rounded-sm text-white py-3 px-6 flex-1 lg:flex-none text-center ml-auto"
              target="_blank"
            >
              Selesaikan Pembayaran
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
}
