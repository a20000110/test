import lang from "@/languagePack.json";
import { ChangeEvent, memo, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Dialog, DialogBody, DialogTitle } from "@/components/CatalystUi/dialog";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import { debounce } from "@/lib/utils/util";
import { useTranslations } from "next-intl";
import axios from "axios";

export default memo(function Translate() {
    const { locale, replace, asPath } = useRouter();
    const [open, setOpen] = useState(false);
    const [langList, setLangList] = useState<Record<string, string>[]>([]);
    const [langs, setLangs] = useState<Record<string, string>[]>(lang);
    const [currentLang, setCurrentLang] = useState<Record<string, string>>(lang.find(l => l.code === locale)!);

    const handleInput = debounce((val: string) => {
      if (!val) {
        setLangs(langList);
      } else {
        const value = val.toLowerCase();
        // 根据id 或者name进行模糊匹配过滤
        const list = langList.filter((item) => {
          return item.name.toLowerCase().indexOf(value) !== -1 || item.code.toLowerCase().indexOf(value) !== -1;
        });
        setLangs(list);
      }
    }, 200);

    const jump = async (item: Record<string, string>) => {
      await replace(
        asPath,
        undefined,
        {
          locale: item.code
        }
      );
      setOpen(false);
    };
    const t = useTranslations();

    useEffect(() => {
      setCurrentLang(lang.find(l => l.code === locale)!);
      const domain = new URL(process.env.NEXT_PUBLIC_WORDPRESS_URL as string).hostname;
      axios.post(`${process.env.NEXT_PUBLIC_AI_URL}/api/v1/ml_web/get_translate_code?domain=${domain}`, {}, {
        headers: {
          "Accept-Language": locale
        }
      }).then(res => {
        if (res.data.code === 200) {
          setLangList(res.data.result.data);
          setLangs(res.data.result.data);
          setCurrentLang(res.data.result.data.find((item: Record<string, string>) => item.code === locale)!);
        }
      });
    }, [locale]);

    return <>
      <div className="cursor-pointer text-xs p-1 duration-300 hover:bg-gray-300 rounded-[3px]"
           onClick={() => setOpen(!open)}><i className="ri-global-fill mr-1"></i>{currentLang?.name}<i
        className="ri-arrow-down-s-line"></i></div>
      <Dialog className="!bg-white md:!max-w-[60vw]" open={open} onClose={() => setOpen(false)}>
        <DialogTitle className="!text-black b-flex">
          <span>{t("nav.ccf1b7cd831ff741856bb7551632b4a3fb19")}</span>
          <i className="ri-close-line ri-xl cursor-pointer" onClick={() => setOpen(false)}></i>
        </DialogTitle>
        <DialogBody>
          <input className="text-black border w-full h-[40px] mb-4 pl-3 rounded"
                 placeholder={t("nav.3f3d6a7ab2d9154135e9fc1a87280e152565")}
                 onChange={(e: ChangeEvent<HTMLInputElement>) => handleInput(e.target.value)} />
          <ul id="language-list"
              className="max-h-[500px] ignore overflow-y-auto grid md:grid-cols-2 lg:grid-cols-4 max-md:grid-cols-1 gap-y-4 gap-x-2">
            {
              langs.map((item, index) => {
                return <li key={index}
                           onClick={() => jump(item)}
                           className={`cursor-pointer hover:text-main hover:font-bold duration-300 ${currentLang?.code === item.code ? "text-main font-bold" : ""}`}>{item?.name}</li>;
              })
            }
          </ul>
        </DialogBody>
      </Dialog>
    </>;
  }
);
