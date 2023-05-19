import { ReactElement } from "react";

interface Props{
    children: ReactElement,
    top: ReactElement,
    bottom: ReactElement,
}

// 布局容器，包含顶部、中间、底部三部分内容
export function ScrollContainer(props:Props ){
    const {top,children,bottom} = props;
    return(
        <div>
            {top}
            {children}
            {bottom}
        </div>
    )
}