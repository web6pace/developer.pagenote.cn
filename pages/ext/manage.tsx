import ManageTabs from "components/manage/ManageTabs";
import {HashRouter as Router, Route, Routes} from "react-router-dom";
import CheckVersion from "../../components/check/CheckVersion";
import PageManage from "../../components/manage/page/PageManage";
import BasicLayout from "../../layouts/BasicLayout";

export default function Manage(){

    return(
        // 所有子节点用div包裹
        <BasicLayout title='我的PAGENOTE网页笔记' nav={false} footer={false}>
            <CheckVersion requireVersion='0.26.0'>
                <div>
                    <Router>
                        <Routes>
                            <Route path='/page' element={<PageManage />}/>
                            <Route path='*' element={<PageManage />}/>
                        </Routes>
                    </Router>
                </div>
            </CheckVersion>
        </BasicLayout>
    )

}
