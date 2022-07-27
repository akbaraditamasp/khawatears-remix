type Props = {
  item: any;
};

export default function SliderItem({ item }: Props) {
  return (
    <a
      href={item.url}
      title={item.name}
      className="w-16-9 bg-gray-100 overflow-hidden w-full flex-shrink-0"
    >
      <img
        src={item.image.url}
        title={item.title}
        alt={item.name}
        placeholder="blur"
      />
    </a>
  );
}
