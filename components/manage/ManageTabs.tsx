import {NavLink} from "react-router-dom";
import OutLink from "assets/svg/outlink.svg";
import HomeSvg from "assets/svg/home.svg";
import CloseSvg from 'assets/svg/close.svg'
import React, {useEffect, useRef} from "react";
import useWhoAmi from "hooks/useWhoAmi";
import useCurrentTab from "../../hooks/useCurrentTab";
import {getSearchKeyFormUrl} from "../../utils/search-engine";
import useConfig from "../../hooks/useConfig";

interface Tab {
    label: string,
    outlink: string,
    link: string,
}

const tabs: Tab[] = [{
    label: '网页',
    outlink: '',
    link: '/'
}, {
    label: '标记',
    outlink: '',
    link: '/clipboard'
},
    {
        label: '快照',
        outlink: "",
        link: '/setting'
    }
]
export default function NavTabs() {
    const [whoAmi] = useWhoAmi();


    return (
        <div className="tabs relative w-full">
            {
                tabs.map((item, index) => (
                    <NavLink key={index}
                             to={item.link}
                             className={({isActive}) =>
                                 `tab tab-lifted tab-${isActive ? 'active' : ''}`
                             }
                    >
                        {item.label}
                        {item.outlink && <OutLink width={14} height={14}/>}
                    </NavLink>
                ))
            }
        </div>
    )
}
