import {useEffect} from "react";

type Props = {
    nodeIds: string[];
    top?: number;
}
export default function PageScrollEvent({nodeIds, top = 200}: Props) {
    useEffect(() => {
        window.addEventListener("scroll", () => {
            if (window.scrollY > top) {
                nodeIds.forEach((id) => {
                    document.querySelector(`#${id}`)?.classList.remove("hidden");
                });
            } else {
                nodeIds.forEach((id) => {
                    document.querySelector(`#${id}`)?.classList.add("hidden");
                });
            }
        });
    }, []);
    return null;
}
