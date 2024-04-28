import React from "react";

function CountBadge({count = 0}) {
    return <>
        {
            count > 0 && <span className="absolute -top-full -right-[60%] p-0.5 bg-[#f44336] rounded-full text-white
                                    text-[12px] inline-flex items-center px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset ring-gray-500/10">
                                        {count > 99 ? 99 : count}
                                    </span>
        }
    </>;
}

export default React.memo(CountBadge);
