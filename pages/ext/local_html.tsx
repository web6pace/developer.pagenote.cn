import {useEffect, useState} from "react";
import extApi from "@pagenote/shared/lib/generateApi";
import {ContentType} from "@pagenote/shared/lib/@types/data";
import {localResource} from "@pagenote/shared/lib/extApi";
import LocalResource = localResource.LocalResource;
import dayjs from "dayjs";
import {onVisibilityChange} from "@pagenote/shared/lib/utils/document";
import {getDomain} from "@pagenote/shared/lib/utils/filter";

export default function Local_html() {
    const [group, setGroup] = useState<Record<string, Partial<LocalResource>[]>>({})

    useEffect(function () {
        fetchList();
        return onVisibilityChange(function () {
            fetchList()
        })
    }, [])

    function fetchList() {
        extApi.localResource.group({
            groupBy: 'relatedPageUrl',
            projection: {
                data: -1
            },
        }).then(function (res) {
            setGroup(res.data)
        })
    }


    const list: { url: string, name?: string, versions: Partial<LocalResource>[] }[] = []
    for (let i in group) {
        list.push({
            url: i,
            name: group[i][0].name,
            versions: group[i],
        })
    }

    return (
        <div className={'grid grid-cols-5 gap-4 p-2'}>
            {
                list.map((item) => (
                    <div className="stack" key={item.url}>
                        {
                            item.versions.map((version) => (
                                <a target={'_blank'}
                                   href={version.localUrl || `/ext/offline?id=${version.resourceId}`}
                                   key={version.createAt}
                                   className="w-full h-full text-center border border-base-content card bg-base-100">
                                    <div className={'card-body text-sm'}>
                                            <span>
                                                {dayjs(version.createAt).format('YYYY-MM-DD HH:mm:ss')}
                                            </span>
                                        <div>{item.name}</div>
                                        <div>{getDomain(version.originUrl||'',false)}</div>
                                    </div>
                                </a>
                            ))
                        }
                    </div>
                ))
            }
        </div>
    )
}
