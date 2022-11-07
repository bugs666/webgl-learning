import {useCallback, useEffect, useMemo, useRef, useState} from "react";

/**
 * 初始化webgl
 * @param data  顶点数据
 * @param position 着色器顶点位置变量
 * @param size     顶点数据构成尺寸（1,2,3,4）
 * @param flag     是否绘制点，兼容圆形点
 * @param pointIndex    顶点索引
 * @returns {{
 * webgl: webgl对象,
 * setData: 设置顶点数据方法,
 * draw: 顶点数据,
 * addVertex: 更新顶点,
 * setWebGl: 初始化webgl方法
 * }}
 */
export function useInitWebGlContext({data = [], position='a_Position', size = 2, flag = 'isPoints', pointIndex = []}) {
    let originalVertexDataRef = useRef(data);
    let [webgl, setWebGl] = useState(null);
    let vertexData = useMemo(() => {
        return new Float32Array(originalVertexDataRef?.current ?? []);
    }, [originalVertexDataRef.current]);

    let pointIndexData = useMemo(() => {
        return new Uint8Array(pointIndex);
    }, [pointIndex]);

    useEffect(() => {
        if (!webgl || !vertexData) return;
        let buffer = webgl.createBuffer();
        webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
        webgl.bufferData(webgl.ARRAY_BUFFER, vertexData, webgl.STATIC_DRAW);
        let a_Position = webgl.getAttribLocation(webgl.program, position);

        /**
         * 从指定的缓冲区中读取数据，
         * 用法：https://developer.mozilla.org/zh-CN/docs/Web/API/WebGLRenderingContext/vertexAttribPointer
         */
        webgl.vertexAttribPointer(a_Position, size, webgl.FLOAT, false, 0, 0);
        //开启顶点数据的批处理，着色器默认只会一个一个接收顶点数据，逐个绘制
        webgl.enableVertexAttribArray(a_Position);
        if (vertexData.length && !!pointIndexData.length) {
            const indexBuffer = webgl.createBuffer();
            webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, indexBuffer);
            webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, pointIndexData, webgl.STATIC_DRAW);
        }
    }, [webgl, pointIndexData]);

    let setOriginalVertexData = vertices => {
        originalVertexDataRef.current = vertices;
    };

    let draw = useCallback((types) => {
        if (!webgl) return;
        webgl.clear(webgl.COLOR_BUFFER_BIT);
        const count = vertexData.length / size;
        types.forEach(type => {
            try {
                let isPoint = webgl.getUniformLocation(webgl.program, flag);
                webgl.uniform1f(isPoint, type === 'POINTS');
            } finally {
                if (vertexData.length && pointIndexData.length) {
                    webgl.drawElements(webgl[type], pointIndex.length, webgl.UNSIGNED_BYTE, 0);
                } else {
                    webgl.drawArrays(webgl[type], 0, count);
                }
            }
        });
    }, [webgl, vertexData, pointIndexData]);

    let addVertex = useCallback(data => {
        let newData = (originalVertexDataRef?.current ?? []).concat(data);
        setOriginalVertexData(newData);
    }, [originalVertexDataRef.current]);

    let updateBuffer = useCallback(vertices => {
        setOriginalVertexData(vertices);
        webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(vertices), webgl.STATIC_DRAW);
    }, [webgl]);

    return {
        webgl,
        addVertex,
        setWebGl,
        updateBuffer,
        draw,
        setData: setOriginalVertexData,
        verticesData: originalVertexDataRef.current
    };
}
