export default function Topping() {
    const topPage = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };
    return <div id="topping" className="hidden fixed cursor-pointer max-md:hidden" onClick={topPage}>
        <div
            className="w-[50px] h-[50px] flex justify-center items-center bg-white shadow-gray-500 shadow-md rounded-full fixed right-10 bottom-10">
            <i className="ri-skip-up-fill ri-2x text-main"></i>
        </div>
    </div>;
}
