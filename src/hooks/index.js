import {useCallback, useEffect, useMemo, useState} from "react";

export function useInitWebGlContext(data, position, flag = 'isPoints') {
    let [originalVertexData, setOriginalVertexData] = useState(data);
    let [webgl, setWebGl] = useState(null);
    let vertexData = useMemo(() => {
        return new Float32Array(originalVertexData);
    }, [originalVertexData]);

    useEffect(() => {
        if (!webgl) return;
        let buffer = webgl.createBuffer();
        webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
        webgl.bufferData(webgl.ARRAY_BUFFER, vertexData, webgl.STATIC_DRAW);
        let a_Position = webgl.getAttribLocation(webgl.program, position);
        /**
         * 从指定的缓冲区中读取数据，
         * 用法：https://developer.mozilla.org/zh-CN/docs/Web/API/WebGLRenderingContext/vertexAttribPointer
         */
        webgl.vertexAttribPointer(a_Position, 2, webgl.FLOAT, false, 0, 0);
        //开启顶点数据的批处理，着色器默认只会一个一个接收顶点数据，逐个绘制
        webgl.enableVertexAttribArray(a_Position);
    }, [webgl, vertexData]);

    let draw = useCallback((types) => {
        if (!webgl) return;
        webgl.clear(webgl.COLOR_BUFFER_BIT);
        const count = vertexData.length / 2;
        types.forEach(type => {
            try {
                let isPoint = webgl.getUniformLocation(webgl.program, flag);
                webgl.uniform1f(isPoint, type === 'POINTS');
            } finally {
                webgl.drawArrays(webgl[type], 0, count);
            }
        });
    }, [webgl, vertexData]);

    let addVertex = useCallback(data => {
        setOriginalVertexData([...originalVertexData, ...data]);
    }, [originalVertexData]);

    return {
        webgl,
        addVertex,
        setWebGl,
        draw,
        setData: setOriginalVertexData
    };
}
