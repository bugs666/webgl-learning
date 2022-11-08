import {lazy} from "react";

const lazyLoad = (module) => {
    const Comp = lazy(() => import(`@page/${module}`));
    return <Comp/>;
}

const routes = [
    {
        name: '基础绘图',
        path: 'common',
        element: lazyLoad('CommonPainter')
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
            },
            {
                name: '缩放',
                path: 'common/zoom',
                element: lazyLoad('Zoom')
            },
            {
                name: '矩阵旋转',
                path: 'common/matrixRotation',
                element: lazyLoad('MatrixRotation')
            },
            {
                name: '矩阵平移',
                path: 'common/matrixTranslation',
                element: lazyLoad('MatrixTranslation')
            },
            {
                name: '矩阵缩放',
                path: 'common/matrixScale',
                element: lazyLoad('MatrixScale')
            }
        ]
    },
    {
        name: '复合变换',
        children: [
            {
                name: '视图矩阵',
                path: 'common/viewMatrix',
                element: lazyLoad('ViewMatrix')
            },
            {
                name: '模型矩阵',
                path: 'common/moduleMatrix',
                element: lazyLoad('ModuleMatrix')
            }
        ]
    },
    {
        name: 'demo',
        children: [
            {
                name: '绘制星空',
                path: 'common/renderStar',
                element: lazyLoad('RandomStar')
            },
            {
                name: '波浪',
                path: 'common/wave',
                element: lazyLoad('SinWave')
            }
        ]

    }
]

export default routes;
