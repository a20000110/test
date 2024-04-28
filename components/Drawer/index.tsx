import React, {useEffect, useRef, useState} from "react";
import {setOverflow} from "@/lib/utils/util";

type Props = {
    direction?: "left" | "right";
    width?: string;
    visible: boolean;
    title?: string;
    showClose?: boolean;
    showHeader?: boolean;
    children?: React.ReactNode;
    onClose: () => void;
    className?: string;
}

function Drawer({
                    direction = "left",
                    width = "40vw",
                    visible,
                    title = process.env.NEXT_PUBLIC_COMPANY_NAME!.toUpperCase(),
                    showClose = true,
                    showHeader = true,
                    children,
                    onClose,
                    className = ""
                }: Props) {

    const drawerRef = useRef<HTMLDivElement>(null);

    const contentRef = useRef<HTMLDivElement>(null);

    const [open, setOpen] = useState(false);

    const handlerClose = () => {
        setOpen(false);
        onClose();
    };
    // esc 关闭
    useEffect(() => {
        const handleKeydown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                handlerClose();
            }
        };
        document.addEventListener("keydown", handleKeydown);
        return () => {
            document.removeEventListener("keydown", handleKeydown);
        };
    }, []);

    useEffect(() => {
        setOpen(visible);
        if (contentRef.current && visible) {
            if (direction === "left") {
                contentRef.current.classList.remove("animate__slideInRight");
                contentRef.current.classList.add("animate__slideInLeft");
            } else {
                contentRef.current.classList.remove("animate__slideInLeft");
                contentRef.current.classList.add("animate__slideInRight");
            }
        }
    }, [visible, width, contentRef.current, direction]);

    useEffect(() => {
        setOverflow(open ? "hidden" : "auto");
    }, [open]);


    return <div className={`fixed top-0 bottom-0 left-0 right-0 z-[999] ${open ? "block" : "hidden"}`}
                ref={drawerRef}>
        <div className="drawer-mask absolute bg-[rgba(0,0,0,0.45)] inset-0" onClick={() => handlerClose()}></div>
        <div
            style={{
                width: width
            }}
            ref={contentRef}
            className={`drawer-content ${direction === "left" ? "left-0" : "right-0"} absolute z-[4] bg-white
            h-[100vh] animate__animated animate__delay-10 overflow-y-auto ${className}`}>
            {
                showHeader && <div className="b-flex px-4">
                    <h2 className="text-2xl font-bold">{title || ""}</h2>
                    {
                        showClose ?
                            <i className="ri-close-line ri-2x cursor-pointer" onClick={() => handlerClose()}></i> : null
                    }
                </div>
            }
            {children}
        </div>
    </div>;
}

export default React.memo(Drawer);
