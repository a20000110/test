import {BodyText, BTProps} from "@/components/BodyText";

type Props = {
    time: string;
    className?: string;
} & Pick<BTProps, "size">
export default function DateTime({time, size, className}: Props) {
    // 判断time是否是时间格式
    if (time) {
        // 转化为时间格式
        const date = new Date(time);
        // 转化为年月日时分秒
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hour = date.getHours();
        const minute = date.getMinutes();
        const second = date.getSeconds();
        // 补0
        const monthStr = month < 10 ? `0${month}` : month;
        return <BodyText size={size || "sm"} className={className} fontFamily={"SGL"}>
            {`${year}-${monthStr}-${day}`}
        </BodyText>;
    }
    return null;
}
