import React from "react";
import BasicSettingLine from "../setting/BasicSettingLine";
import SettingDetail from "../setting/SettingDetail";
import TipInfo from "components/TipInfo";
import ExtensionData from "./extension/ExtensionData";


export default function DataBackup() {
    return (
        <SettingDetail label={'数据管理'}>
            <div className={' min-w-80'}>

                <ExtensionData />

                <BasicSettingLine label={
                    <span>
                        云端
                        <TipInfo
                            position={'right'}
                            tip={'将数据存储在云端，多设备可以同步数据。'}/>
                    </span>
                } right={
                    <div className={'text-xs'}>
                        敬请期待...
                    </div>
                }/>
            </div>
        </SettingDetail>
    )
}
