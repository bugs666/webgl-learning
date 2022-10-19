import {lazy} from "react";

const lazyLoad = (module) => {
    const Comp = lazy(() => import(`@page/${module}`));
    return <Comp/>;
}

const routes = [
    {
        name: '基础绘图',
        children: [
            {
                name: '绘制单个点',
                path: 'common/singlePoint',
                element: lazyLoad('SinglePoint')
            },
            {
                name: '绘制星空',
                path: 'common/renderStar',
                element: lazyLoad('RandomStar')
            },
            {
                name: '绘制多点',
                path: 'common/multiPoint',
                element: lazyLoad('MultiPoint')
            },
            {
                name: '绘制矩形面',
                path: 'common/rectangularFace',
                element: lazyLoad('RectangularFace')
            }
        ]
    },
    {
        name: '复杂绘图',
        children: [
            {
                name: '绘制多条线',
                path: 'common/multipleLine',
                element: lazyLoad('MultipleLine')
            }
        ]
    }
]

export default routes;