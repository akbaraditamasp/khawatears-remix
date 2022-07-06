import { json, LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData, useOutletContext } from "@remix-run/react";
import { Fragment, useEffect, useState } from "react";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import ProductItem from "~/components/ProductItem";
import SliderItem from "~/components/SliderItem";
import basicInformation from "~/loader/basic-information";
import searchProducts from "~/loader/search-product";
import sliders from "~/loader/sliders";

export const meta: MetaFunction = ({ data }) => {
  return {
    title: `${data?.basicInfo?.store_name} | ${data?.basicInfo?.tagline}`,
    "og:title": `${data?.basicInfo?.store_name} | ${data?.basicInfo?.tagline}`,
    "og:url": data.url,
    "og:image": data?.sliders?.length
      ? "https://image-webp.herokuapp.com/?width=1024&height=320&url=" +
        encodeURIComponent(data?.sliders[0]?.image)
      : undefined,
  };
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") || "";

  let basicInfo: any = null;
  let getSliders: any = null;
  let getProducts: any = null;
  try {
    basicInfo = await basicInformation();
    getSliders = await sliders();
    getProducts = await searchProducts(query);
  } catch (e) {
    return json({});
  }

  return json({
    basicInfo,
    sliders: getSliders,
    products: getProducts,
    query,
    url: request.url,
  });
};

export default function Index() {
  const [position, setPosition] = useState(0);
  const data = useLoaderData();
  const { setData }: any = useOutletContext();

  const nextSlide = () => {
    if (position + 1 < data?.sliders?.length) {
      setPosition((position) => position + 1);
    }
  };

  const prevSlide = () => {
    if (position - 1 >= 0) {
      setPosition((position) => position - 1);
    }
  };

  useEffect(() => {
    setData({
      basicInformation: data.basicInfo,
      h1: true,
    });
  }, []);

  return (
    <Fragment>
      {!data.query ? (
        <div className="w-full flex justify-center">
          <div className="container pt-8">
            <div className="relative">
              <div className="overflow-hidden border-2 border-primary-base rounded-sm">
                <div
                  className="flex transition-all"
                  style={{
                    transform: `translateX(${
                      position ? `-${position}00%` : "0"
                    })`,
                  }}
                >
                  {((data?.sliders || []) as Array<any>).map((item, index) => (
                    <SliderItem item={item} key={`${index}`} />
                  ))}
                </div>
                <div className="absolute top-0 right-0 h-full flex items-center translate-x-1/2">
                  <button
                    type="button"
                    className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-white border-2 border-primary-base flex items-center justify-center"
                    onClick={() => nextSlide()}
                  >
                    <GoChevronRight />
                  </button>
                </div>
                <div className="absolute top-0 left-0 h-full flex items-center -translate-x-1/2">
                  <button
                    type="button"
                    className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-white border-2 border-primary-base flex items-center justify-center"
                    onClick={() => prevSlide()}
                  >
                    <GoChevronLeft />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      <div className="flex flex-col items-center py-12">
        <main className="container">
          <div className="font-bold text-center text-2xl flex justify-center items-center montserrat text-gray-800 bg-primary-base rounded-sm h-0.5 mb-12">
            <h2 className="px-8 bg-bg">
              {data.query ? "Hasil Pencarian" : "Produk Kami"}
            </h2>
          </div>
          {!data?.products?.length ? (
            <div className="font-bold text-center text-lg">
              Produk Tidak Ditemukan
            </div>
          ) : (
            <div className="grid grid-flow-row grid-cols-2 lg:grid-cols-3 gap-5 w-full">
              {((data?.products || []) as Array<any>).map((item, index) => (
                <ProductItem item={item} key={`${index}`} />
              ))}
            </div>
          )}
        </main>
      </div>
    </Fragment>
  );
}
