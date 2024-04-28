import clsx from "clsx";

type Props = {
  banner?: string;
  name: string;
  className?: string;
}
export default function PostAndProductBanner({
                                               banner,
                                               name,
                                               className = ""
                                             }: Props) {
  const Banner = banner ? banner : "url(/image/cp-banner.jpg)";
  return <div
    className={clsx("font-sans text-center h-96 max-md:h-48 relative bg-themeSecondary100 text-black", className)}
  >
    <div className="absolute inset-0 bg-gradient-to-t from-white"
         style={{ backgroundImage: Banner, backgroundPosition: "center", backgroundSize: "cover", padding: "8%" }}>
      <h1 className="Constantia text-3xl lg:text-5xl absolute inset-0 c-flex capitalize">{name}</h1>
    </div>

  </div>;
}
