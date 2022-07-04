import { IconType } from "react-icons";
import * as allIcon from "react-icons/fa";

type Props = {
  icon: string;
  url: string;
  name: string;
};

export default function SocialLink({ icon, url, name }: Props) {
  let Icon: IconType | undefined;
  if (icon) {
    Icon = allIcon[icon as keyof typeof allIcon];
  }

  return (
    <a
      href={url}
      title={name}
      className="h-6 w-6 text-primary-base bg-gray-400 hover:bg-white flex justify-center items-center rounded-sm mr-2"
    >
      {Icon ? <Icon /> : null}
    </a>
  );
}
