import { Link } from "@remix-run/react";

type StepWayProps = {
  active?: boolean;
  to: string;
  children?: JSX.Element | string;
};

type StepsProps = {
  active: string;
};

const StepWay = ({ active, children, to }: StepWayProps) => {
  return (
    <Link
      to={to}
      type="button"
      className={`flex-1 lg:flex-none text-center py-3 px-8 h-16 flex justify-center items-center rounded-sm ${
        active
          ? "font-bold text-white bg-primary-base"
          : "bg-white font-normal text-gray-600"
      }`}
    >
      {children}
    </Link>
  );
};

export default function Steps({ active }: StepsProps) {
  return (
    <div className="flex">
      <div className="flex flex-1 lg:flex-none mb-5 bg-white border rounded-sm">
        <StepWay to="/cart" active={active === "cart"}>
          Keranjang
        </StepWay>
        <StepWay to="/payment-data" active={active === "data"}>
          Isi Data
        </StepWay>
        <StepWay to="/checkout" active={active === "checkout"}>
          Bayar
        </StepWay>
      </div>
    </div>
  );
}
