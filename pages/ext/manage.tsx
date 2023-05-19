import ManageTabs from "components/manage/ManageTabs";
import {HashRouter as Router, Route, Routes} from "react-router-dom";
import PageManage from "../../components/manage/page/PageManage";
import BasicLayout from "../../layouts/BasicLayout";
import ExtLayout from "layouts/ExtLayout";

export default function Manage(){
    return(
        <PageManage />
    )

    return(
        // 所有子节点用div包裹
        <ExtLayout title='我的PAGENOTE网页笔记'>
            <PageManage />
            {/* 服务端渲染下，不支持客户端路由模式 */}
            {/* <Router>
                <Routes>
                    <Route path='/page' element={<PageManage />}/>
                    <Route path='*' element={<PageManage />}/>
                </Routes>
            </Router> */}
        </ExtLayout>
    )

}
