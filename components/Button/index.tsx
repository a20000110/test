import {cva} from "class-variance-authority";
import React, {FC} from "react";

const buttonStyle = cva(["font-medium", "cursor-pointer"], {
    variants: {
        size: {
            xs: ["text-sm", "px-[14px] md:px-5", "py-1.5 md:py-2"],
            sm: ["text-sm", "leading-5", "px-6", "py-2.5"],
            md: ["text-base", "leading-6", "px-6", "py-2.5"],
            lg: ["text-base", "leading-6", "px-7", "py-3"],
            xl: ["text-base", "leading-6", "px-7", "py-4"]
        },
        type: {
            round: ["rounded-md"],
            pill: ["rounded-full"],
            lg: ["rounded-lg"]
        },
        color: {
            main:["bg-main","text-white","hover:bg-gray-500","duration-300"],
            primary: ["bg-themePrimary600", "text-white", "hover:bg-themeSecondary800 transition hover:duration-700"],
            light: [
                "bg-themeSecondary100",
                "text-themeSecondary600",
                "hover:bg-themePrimary600 hover:text-white transition hover:duration-700"
            ],
            dark: [
                "bg-themeSecondary800",
                "text-white",
                "hover:bg-themePrimary600 hover:text-white transition hover:duration-700"
            ],
            white: [
                "bg-white",
                "text-themeSecondary600",
                "hover:bg-themePrimary600 hover:text-white transition hover:duration-700"
            ]
        }
    }
});

export interface ButtonProps {
    size?: "xs" | "sm" | "md" | "lg" | "xl",
    type?: "round" | "pill" | "lg",
    color?: "main" | "primary" | "light" | "dark" | "white",
    className?: string,
    children?: React.ReactNode,
    disabled?: boolean,
    onClick?: () => any
}

const disabledStyle = (disabled: boolean) => {
    return disabled ? "cursor-not-allowed hover:bg-[#27272a]" : "";
};

export const Button: FC<ButtonProps> = ({
                                            size = "xl",
                                            type = "round",
                                            color = "main",
                                            className = "",
                                            children = "Button",
                                            disabled = false,
                                            onClick = () => {
                                            }
                                        }) => {
    return <button disabled={disabled} onClick={onClick}
                   className={`${buttonStyle({
                       type,
                       size,
                       color
                   })} ${className} ease-in-out ${disabledStyle(disabled)}`}>{children}</button>;
};
