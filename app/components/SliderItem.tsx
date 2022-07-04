type Props = {
  item: any;
};

export default function SliderItem({ item }: Props) {
  return (
    <a
      href={item.url}
      title={item.title}
      className="w-16-9 bg-gray-100 overflow-hidden w-full flex-shrink-0"
    >
      <img
        src={"https://image-webp.herokuapp.com/?width=1024&height=320&url=" + encodeURIComponent(item.image)}
        title={item.title}
        alt={item.title}
        placeholder="blur"
      />
    </a>
  );
}
