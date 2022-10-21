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
                name: '图形转面',
                path: 'common/multipleLine',
                element: lazyLoad('MultipleLine')
            }
        ]
    },
    {
        name: '简单效果',
        children: [
            {
                name: '平移',
                path: 'common/translation',
                element: lazyLoad('Translation')
            },
            {
                name: '旋转',
                path: 'common/rotate',
                element: lazyLoad('Rotate')
            }
        ]
    }
]

export default routes;
