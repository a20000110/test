import Modals from "@/components/Modals";
import React from "react";
import { SignSwitch, SignSwitchProps } from "@/components/User/nav-user";

export default function LoginModal({ activeId = 1, setActiveId, setOpenModal, openModal = false }: SignSwitchProps & {
  openModal: boolean
}) {
  return <Modals open={openModal} setOpen={setOpenModal}>
    <SignSwitch activeId={activeId} setActiveId={setActiveId} setOpenModal={setOpenModal} />
  </Modals>;
}
