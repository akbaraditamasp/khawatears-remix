import { Link, useNavigate } from "@remix-run/react";
import { useContext, useEffect, useState } from "react";
import { FaShoppingBag } from "react-icons/fa";
import { GoSearch, GoX } from "react-icons/go";
import { CartContext } from "~/cart";
import useDebounce from "~/useDebounce";
import SocialLink from "./SocialLink";

type Props = {
  basicInformation: any;
  children: JSX.Element;
  h1: boolean;
};

export default function Layout({ children, basicInformation, h1 }: Props) {
  const [showSearch, setShowSearch] = useState(false);
  const [render, setRender] = useState(false);
  const [query, setQuery] = useState("");
  const debounce = useDebounce({ callback: (text: string) => setQuery(text) });
  const navigate = useNavigate();
  const { carts } = useContext(CartContext)!;

  const H1 = h1 ? "h1" : "h2";

  useEffect(() => {
    if (render) {
      navigate("/?q=" + query, { replace: true });
    }
  }, [query]);

  useEffect(() => {
    setRender(true);
  }, []);

  return (
    <div className="max-w-screen  overflow-x-hidden bg-bg min-h-screen pt-16 flex flex-col">
      <div className="w-full flex justify-center bg-white shadow-sm h-16 fixed top-0 left-0 z-20">
        <div className="container flex items-center">
          <H1>
            <Link
              to="/"
              className="text-2xl carton text-primary-base"
              title={basicInformation?.store_name}
            >
              {basicInformation?.store_name}
            </Link>
          </H1>
          <div
            className={`z-20 bg-white ml-0 md:ml-auto h-16 md:w-1/3 absolute md:static top-0 flex flex-col justify-center ${
              showSearch
                ? "w-full left-0 mr-0 px-5"
                : "w-10 left-auto mr-5 px-0"
            } transition-all lg:mr-0 lg:px-0`}
            style={{
              right: showSearch ? "auto" : "3.25rem",
            }}
          >
            <div
              className={`relative h-10 border ${
                showSearch ? "w-full" : "w-10"
              } md:w-full`}
            >
              <button
                type="button"
                className="flex md:hidden absolute top-0 right-0 h-10 w-10 justify-center items-center text-gray-500 rounded-sm"
                onClick={() => setShowSearch((value) => !value)}
              >
                {showSearch ? <GoX /> : <GoSearch />}
              </button>
              <span className="hidden md:flex absolute top-0 right-0 h-10 w-10 justify-center items-center text-gray-500 rounded-sm">
                <GoSearch />
              </span>
              <input
                type="text"
                className={`${
                  showSearch ? "block" : "hidden"
                } md:block rounded-sm h-full w-full px-3 pr-10`}
                placeholder="Cari disini..."
                onChange={(e) => debounce(e.target.value)}
              />
            </div>
          </div>
          <Link
            to="/cart"
            className="w-10 h-10 relative flex justify-center items-center hover:bg-gray-100 ml-auto md:ml-3 lg:ml-5 border rounded-sm"
          >
            <FaShoppingBag />
            {carts.length ? (
              <div className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-400 w-6 h-6 rounded-full flex justify-center items-center text-white text-xs">
                {carts.length > 9 ? "9+" : carts.length}
              </div>
            ) : null}
          </Link>
        </div>
      </div>
      <div className="flex-1">{children}</div>
      <div className="bg-primary-base flex justify-center py-12">
        <div className="container flex flex-col lg:flex-row justify-between">
          <div className="w-full lg:w-1/2 mr-0 lg:mr-8">
            <h5 className="text-2xl carton text-white">
              {basicInformation?.store_name}
            </h5>
            <p className="text-gray-300">
              {basicInformation?.short_description}
            </p>
          </div>
          <div className="mt-8 lg:mt-0 ml-0 lg:ml-auto">
            <h5 className="font-bold text-white">Temukan Kami</h5>
            <div className="flex mt-2">
              {((basicInformation?.social || []) as Array<any>).map(
                (social, index) => (
                  <SocialLink
                    key={`${index}`}
                    icon={social.icon}
                    name={social.name}
                    url={social.link}
                  />
                )
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center bg-primary-base border-t border-gray-900 py-4 text-gray-300 text-sm">
        <div className="container text-center lg:text-left">
          &copy;2022 - All Right Reserved
        </div>
      </div>
    </div>
  );
}
