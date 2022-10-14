const routes = [
    {
        name: '普通绘图',
        children: [
            {
                name: '绘制单个点',
                path: '/common/singlePoint',
                compUrl: 'page/MyCanvas'
            }
        ]
    }
]

export default routes;