import {useContextSelector} from "use-context-selector";
import {context} from "../../../store/ContextProvider";
import useWebpage from "../../../hooks/useWebpage";
import WebPageDetail from "../../webpage/WebPageDetail";
import Empty from "../../Empty";


export default function PageDetail() {
    const state = useContextSelector(context, v => v[0]);
    const {data:webpage,isLoading,mutate} = useWebpage(state.selectedPageKey || "");

    if(!state.selectedPageKey){
        return (
            <Empty>
                <div>
                    请选择一个页面查看
                </div>
            </Empty>
        )
    }

    return (
        <WebPageDetail initWebpage={webpage} pageKey={state.selectedPageKey}/>
    )
}
