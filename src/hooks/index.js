import {useCallback, useEffect, useMemo, useRef, useState} from "react";

/**
 * 初始化webgl
 * @param data  顶点数据
 * @param position 着色器顶点位置变量
 * @param color    着色器颜色属性
 * @param size     顶点数据构成尺寸（1,2,3,4）
 * @param flag     是否绘制点，兼容圆形点
 * @param pointIndex    顶点索引
 * @param dataIsMulti   源数据是否多属性合一
 * @returns {{
 * webgl: Object,
 * setData: function(Array):void 设置顶点数据方法,
 * draw: function(Array<String>):void 绘制方法,
 * addVertex: function(Array<Number>):void 追加顶点数据,
 * setWebGl: function(Object):void 初始化webgl方法
 * }}
 */
export function useInitWebGlContext(
    {
        data = [],
        position = 'a_Position',
        color = 'a_Color',
        size = 2,
        flag = 'isPoints',
        pointIndex = [],
        dataIsMulti = false
    }
) {
    let originalVertexDataRef = useRef(data);
    let [webgl, setWebGl] = useState(null);
    let vertexData = useMemo(() => {
        return new Float32Array(originalVertexDataRef?.current ?? []);
    }, [originalVertexDataRef.current]);

    let pointIndexData = useMemo(() => {
        return new Uint8Array(pointIndex);
    }, [pointIndex]);

    const initVertices = webglContext => {
        if (!dataIsMulti) {
            let buffer = webglContext.createBuffer();
            webglContext.bindBuffer(webglContext.ARRAY_BUFFER, buffer);
            webglContext.bufferData(webglContext.ARRAY_BUFFER, vertexData, webglContext.STATIC_DRAW);
            let a_Position = webglContext.getAttribLocation(webglContext.program, position);

            /**
             * 从指定的缓冲区中读取数据，
             * 用法：https://developer.mozilla.org/zh-CN/docs/Web/API/WebGLRenderingContext/vertexAttribPointer
             */
            webglContext.vertexAttribPointer(a_Position, size, webglContext.FLOAT, false, 0, 0);
            //开启顶点数据的批处理，着色器默认只会一个一个接收顶点数据，逐个绘制
            webglContext.enableVertexAttribArray(a_Position);
            return;
        }
        //系列尺寸(点，颜色)，点数据字节索引——0
        let pointSize = 3, colorSize = 4, pointByteIndex = 0;
        //元素字节数
        let eleBytes = vertexData.BYTES_PER_ELEMENT;
        //类目尺寸(一条完整的数据包含的信息个数)
        let catalogSize = pointSize + colorSize;
        //类目字节数
        let catalogBytes = catalogSize * eleBytes;
        //颜色数据字节索引位置
        let colorByteIndex = pointSize * eleBytes;
        // 顶点总数
        let dataSize = data.length / catalogSize;

        let sourceBuffer = webglContext.createBuffer();
        webglContext.bindBuffer(webglContext.ARRAY_BUFFER, sourceBuffer);
        webglContext.bufferData(webglContext.ARRAY_BUFFER, vertexData, webglContext.STATIC_DRAW);

        let aPosition = webglContext.getAttribLocation(webglContext.program, position);
        let aColor = webglContext.getAttribLocation(webglContext.program, color);
        /**
         * 顶点着色器中的a_Position变量从数据源中查找自己的数据
         */
        webglContext.vertexAttribPointer(aPosition, pointSize, webglContext.FLOAT, false, catalogBytes, pointByteIndex);
        webglContext.vertexAttribPointer(aColor, colorSize, webglContext.FLOAT, false, catalogBytes, colorByteIndex);
        webglContext.enableVertexAttribArray(aPosition);
        webglContext.enableVertexAttribArray(aColor);
    }

    useEffect(() => {
        if (!webgl || !vertexData) return;
        initVertices(webgl);
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
        const count = dataIsMulti ? vertexData.length / 7 : vertexData.length / size;
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
