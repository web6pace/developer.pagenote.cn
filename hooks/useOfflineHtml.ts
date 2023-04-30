import extApi from "@pagenote/shared/lib/pagenote-api";
import useSWR from "swr";


export default function useOfflineHtml() {
    const {data} = useSWR<Record<string,LocalResource[]>('/resourceList',fetchList,{
        fallbackData: {}
    });

    function fetchList() {
        extApi.localResource.group({
            groupBy: 'relatedPageUrl',
            projection: {
                data: -1
            },
        }).then(function (res) {
            return res.data;
        })
    }

    return [data]
}
