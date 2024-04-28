import FooterSocial from "@/components/Footer/footerSocial";


export default function SliderPart() {
  return <div
    id="slider-part"
    className={`fixed max-md:hidden right-2 bottom-1/2 hidden text-[#3f465c] rounded-[5px] z-[1]`}>
    <FooterSocial className="flex-col gap-y-2" />
  </div>;
};
