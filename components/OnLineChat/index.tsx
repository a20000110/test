import React, { useEffect, useRef, useState } from "react";
import { Text } from "@/components/CatalystUi/text";
import { Input } from "@/components/CatalystUi/input";
import { setOverflow } from "@/lib/utils/util";
import { Button } from "@/components/CatalystUi/button";
import { Avatar } from "@/components/Avatar";
import { useKfStore } from "@/lib/store/kf.store";
import { RingLoader } from "react-spinners";
import { useTranslations } from "next-intl";

const Robot = ({ content }: {
  content: string
}) => {
  return <div className="s-flex py-2 px-4 !items-start">
    <div className="flex-shrink-0">
      <Avatar src="/image/kf.svg" />
    </div>
    <Text className="py-1 px-2 rounded-[5px] ignore !text-black ml-2 bg-white shadow">{content}</Text>
  </div>;
};

const Me = ({ content }: {
  content: string
}) => {
  return <div className="e-flex py-2 px-4 !items-start">
    <Text className="py-1 px-2 rounded-[5px] ignore !text-white mr-2 bg-main shadow">{content}</Text>
  </div>;
};

const SaveEmail = ({
                     setShowSaveEmail
                   }: {
  setShowSaveEmail: (show: boolean) => void
}) => {
  const t = useTranslations();
  const { setEmail } = useKfStore();
  const [value, setValue] = useState("");
  const [errMsg, setErrMsg] = useState("");

  // 校验邮箱格式
  const formatEmail = (email: string) => {
    const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
    return reg.test(email);
  };

  useEffect(() => {
    setErrMsg(!formatEmail(value) ? t("message.ea71b74ebfe1ea40b18a8114397560e38093") : "");
  }, [value]);
  return <div className="c-flex flex-col my-20">
    <h3 className="text-main font-bold text-2xl">{t("chat.83164d44eefb68423289b54fed95b840bb72")}</h3>
    <Text className="mx-12 my-4 text-center !text-[16px]">
      {t("message.a5e790249ab50641b28810c056b74a7694c4")}
    </Text>
    <div className="my-2 w-[90%]">
      <input
        type="email"
        name="email"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        id="email"
        className="block w-full rounded-md focus-visible:outline-0 pl-2 border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 sm:text-sm sm:leading-6"
        placeholder={t("chat.495c49139e348d4dac48be303e28254aa606")}
        aria-describedby="email-description"
      />
      <p className="text-red-700 text-sm">{errMsg}</p>
    </div>
    <Button className="!w-[90%] my-2 !bg-main cursor-pointer" onClick={() => {
      if (value && formatEmail(value)) {
        setEmail(value);
        setShowSaveEmail(false);
      }
    }}>{t("common.Save")}</Button>
  </div>;
};


const Chat = (({
                 open,
                 setOpen
               }: {
  open: boolean,
  setOpen: (open: boolean) => void
}) => {
  const t = useTranslations();
  const { email, sendMessage } = useKfStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const [showSaveEmail, setShowSaveEmail] = useState<boolean>(false);
  const [chatMsg, setChatMsg] = useState<{
    type: "robot" | "me",
    msg: string;
    date: Date
  }[]>([{
    type: "robot",
    msg: t("message.3824132b0e03ad490f589f8c774cd0f2fe50"),
    date: new Date()
  }]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
    setShowSaveEmail(!email);
    setOverflow(open ? "hidden" : "auto");
  }, [open]);

  const handleSetChatMsg = (type: "robot" | "me", msg: string) => {
    setChatMsg(old => {
      const value = JSON.parse(JSON.stringify(old));
      value.push({
        type: type,
        msg: msg,
        date: new Date()
      });
      return value;
    });
  };

  const handleSend = async () => {
    const msg = inputRef.current?.value;
    if (msg) {
      inputRef.current.value = "";
      handleSetChatMsg("me", msg);
      const result = await sendMessage(msg, setLoading);
      if (result) {
        handleSetChatMsg("robot", result);
      } else {
        handleSetChatMsg("robot", t("common.Error"));
      }
    }
  };

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight });
  }, [chatMsg]);

  return <>
    <div className={`${open ? "flex" : "hidden"}`}>
      <div className="md:w-[400px] shadow md:h-[500px] w-[100vw] bg-white border rounded-[10px] overflow-hidden">
        <div className="h-[50px] bg-main b-flex px-4 text-white font-bold">
          <span>{t("common.Assistant")}</span>
          <i className="ri-close-fill cursor-pointer ri-lg" onClick={() => setOpen(false)}></i>
        </div>
        <style>
          {
            `
.online-chat::-webkit-scrollbar {
    width: 5px;
}

.online-chat::-webkit-scrollbar-track {
    background: transparent !important;
}

.online-chat::-webkit-scrollbar-thumb {
    background: #bbbbbb;
    border-radius: 10px;
}
          `
          }
        </style>
        <div className="h-[390px] overflow-y-auto overflow-x-hidden online-chat" ref={chatRef}>
          {
            showSaveEmail ? <SaveEmail setShowSaveEmail={setShowSaveEmail} /> : <>
              {
                chatMsg.map((item, index) => {
                  if (item.type === "robot") {
                    return <Robot content={item.msg} key={index} />;
                  } else {
                    return <Me content={item.msg} key={index} />;
                  }
                })
              }
            </>
          }
        </div>
        {
          !showSaveEmail && <div className="border-t b-flex">
            <Input className="!h-[60px] !text-[18px] !text-black"
                   placeholder={t("message.7f430b484c41ca46468b6fea61903af4de66")} ref={inputRef}
                   onKeyDown={(e) => {
                     if (e.key === "Enter") {
                       handleSend();
                     }
                   }} />
            {
              loading ? <RingLoader className="!text-main mr-2" size={20} /> :
                <i className="cursor-pointer ri-send-plane-2-fill ri-xl mr-2 text-main" onClick={handleSend}></i>
            }

          </div>
        }
      </div>
    </div>
  </>;
});


export default React.memo(function OnLineChat() {
  const [open, setOpen] = useState(false);
  const { getChatToken } = useKfStore();
  useEffect(() => {
    getChatToken();
  }, []);
  return <>
    <div className="fixed z-[2] bottom-5 max-md:bottom-16 left-4">
      <div onClick={() => setOpen(!open)}
           className={`h-[50px] cursor-pointer ${open ? "hidden" : "c-flex"} w-[50px] border text-white bg-main rounded-full shadow-md`}>
        <i className="ri-message-2-line ri-xl"></i>
      </div>
    </div>
    <div className="fixed z-[1] md:bottom-5 md:left-5 bottom-14">
      <Chat open={open} setOpen={setOpen} />
    </div>
  </>;
});
