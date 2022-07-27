import { Link } from "@remix-run/react";
import NumberFormat from "react-number-format";

type Props = {
  item: any;
};

export default function ProductItem({ item }: Props) {
  return (
    <div className="bg-white p-3 lg:p-5 rounded flex flex-col border-2 border-transparent hover:border-primary-base relative">
      <div className="w-1-1 bg-gray-400 rounded mb-5">
        <img
          src={item.image}
          title={item.product_name}
          alt={item.product_name}
          placeholder="blur"
        />
      </div>
      <div>
        <h3 className="font-bold text-gray-800 line-clamp-1 montserrat text-sm lg:text-base">
          {item.product_name}
        </h3>
        <div className="flex">
          <h4 className="text-secondary font-bold">
            <NumberFormat
              thousandSeparator={true}
              prefix="Rp"
              displayType="text"
              value={item.price}
            />
          </h4>
          {item.price_before ? (
            <span className="text-sm line-through ml-2">
              <NumberFormat
                thousandSeparator={true}
                prefix="Rp"
                displayType="text"
                value={item.price_before}
              />
            </span>
          ) : null}
        </div>
      </div>
      <Link
        prefetch="render"
        to={`/${item.slug}`}
        className="absolute top-0 left-0 rounded-sm w-full h-full"
        title={item.product_name}
      ></Link>
    </div>
  );
}
