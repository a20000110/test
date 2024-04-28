import React, { Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { setOverflow } from "@/lib/utils/util";
import clsx from "clsx";

type Props = {
  open: boolean;
  setOpen: (val: boolean) => void;
  top?: string;
  children: React.ReactNode;
  showClose?: boolean;
}
export default function Modals({ open = false, setOpen, children, top, showClose = true }: Props) {
  useEffect(() => {
    setOverflow(open ? "hidden" : "auto");
  }, [open]);
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-main bg-opacity-40 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto overflow-x-hidden">
          <div
            style={{
              top: top || "20vh"
            }}
            className={clsx("absolute left-1/2 p-4 text-center sm:items-center -translate-x-1/2 sm:p-0")}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                className="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all p-4">
                {showClose && <div onClick={() => {
                  setOpen(false);
                }} className="e-flex z-[1] cursor-pointer absolute top-0 right-1">
                  <i className="ri-close-fill ri-2x"></i>
                </div>}
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
