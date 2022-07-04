import { Link, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import { GoSearch, GoX } from "react-icons/go";
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
            className={`ml-0 lg:ml-auto h-16 lg:w-1/3 absolute lg:static top-0 flex flex-col justify-center ${
              showSearch
                ? "w-full left-0 right-auto mr-0 px-5"
                : "w-10 left-auto right-0 mr-5 px-0"
            } transition-all lg:mr-0 lg:px-0`}
          >
            <div
              className={`relative h-10 border ${
                showSearch ? "w-full" : "w-10"
              } lg:w-full`}
            >
              <button
                type="button"
                className="flex lg:hidden absolute top-0 right-0 h-10 w-10 justify-center items-center text-gray-500 rounded-sm"
                onClick={() => setShowSearch((value) => !value)}
              >
                {showSearch ? <GoX /> : <GoSearch />}
              </button>
              <span className="hidden lg:flex absolute top-0 right-0 h-10 w-10 justify-center items-center text-gray-500 rounded-sm">
                <GoSearch />
              </span>
              <input
                type="text"
                className={`${
                  showSearch ? "block" : "hidden"
                } lg:block rounded-sm h-full w-full px-3 pr-10`}
                placeholder="Cari disini..."
                onChange={(e) => debounce(e.target.value)}
              />
            </div>
          </div>
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
              {((basicInformation?.social_media || []) as Array<any>).map(
                (social, index) => (
                  <SocialLink
                    key={`${index}`}
                    icon={social.icon}
                    name={social.name}
                    url={social.url}
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
