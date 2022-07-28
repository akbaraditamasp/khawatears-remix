type DataFormProps = {
  title: string;
  children?: string | JSX.Element;
};

export default function DataForm({ title, children }: DataFormProps) {
  return (
    <div className="mb-4 pb-4 border-b border-dashed">
      <div>{title}</div>
      <div className="font-bold">{children}</div>
    </div>
  );
}
