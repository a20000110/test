import { Input } from "@/components/CatalystUi/input";
import { Field, Label } from "@/components/CatalystUi/fieldset";
import { Button } from "@/components/CatalystUi/button";
import React, { useState } from "react";
import { Text } from "@/components/CatalystUi/text";
import { sendInquiryForm } from "@/components/Form/Inquiry/submit-form";
import { RingLoader } from "react-spinners";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";

export default function SendEmail({
                                    inputClassName = "",
                                    btnClassName = "",
                                    inputLength = "280px",
                                    loadingColor = "#fff",
                                    labelColor = "#fff"
                                  }: {
  inputClassName?: string
  btnClassName?: string
  inputLength?: string
  loadingColor?: string
  labelColor?: string
}) {
  const t = useTranslations();
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const handlerSend = async () => {
    if (!email || errorMsg || loading) return;
    try {
      setLoading(true);
      const result = await sendInquiryForm({
        inquiry_info: {
          email
        },
        goods: [{ id: 0, count: 0 }],
        source: 1
      });
      if (!!result) {
        setEmail("");
        toast(t("common.Success"), { type: "success" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInput = (val: string) => {
    setEmail(val);
    // 邮件正则
    if (val && !val.match(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/)) {
      setErrorMsg(t("common.a25f25f822cb354350c85ec44c7dc291871e"));
    } else {
      setErrorMsg("");
    }
  };
  return <div className="text-white">
    <Field>
      <Label className={labelColor}>{t("common.Email")}</Label>
      <div className="b-flex !items-start" style={{
        width: inputLength
      }}>
        <div className="flex-1 bg-white">
          <Input type="email" placeholder={t("message.4f30317c3dd744431ff8fee757c108d6c5ee")} value={email}
                 className={inputClassName}
                 onInput={(e: React.ChangeEvent<HTMLInputElement>) => handleInput(e.target.value)} />
          <Text className="!text-red-700">{errorMsg}</Text>
        </div>
        <Button className={`ml-2 !bg-main cursor-pointer ${btnClassName}`} onClick={handlerSend} disabled={loading}>
          {loading && <RingLoader color={loadingColor} size={20} />}
          <span>{t("common.SEND")}</span>
        </Button>
      </div>
    </Field>
  </div>;
}
