import {lazy} from "react";

const lazyLoad = (module) => {
    const Comp = lazy(() => import(`@page/${module}`));
    return <Comp/>;
}

const routes = [
    {
        name: '普通绘图',
        children: [
            {
                name: '绘制单个点',
                path: 'common/singlePoint',
                element: lazyLoad('MyCanvas')
            }
        ]
    }
]

export default routes;