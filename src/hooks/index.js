import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {loadImage} from "../utils";

/**
 * 初始化webgl
 * @param data  顶点数据
 * @param position 着色器顶点位置变量
 * @param color    着色器颜色属性
 * @param size     顶点数据构成尺寸（1,2,3,4）
 * @param flag     是否绘制点，兼容圆形点
 * @param pointIndex    顶点索引
 * @param dataIsMulti   源数据是否多属性合一
 * @param attrConf      源数据信息
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
        dataIsMulti = false,
        attrConf = [
            {attrName: 'a_Position', dataSize: 3},
            {attrName: 'a_Color', dataSize: 4}
        ]
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

    const initAttrInfo = () => {

        const res = [];
        for (let i = 0; i < attrConf.length; i++) {
            let {attrName, dataSize} = attrConf[i];
            res.push(dataSize, attrName);
        }

        return res;
    }

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
        const attrInfo = initAttrInfo();
        let pointSize = attrInfo[0], colorSize = attrInfo[2], pointByteIndex = 0;
        //元素字节数
        let eleBytes = vertexData.BYTES_PER_ELEMENT;
        //类目尺寸(一条完整的数据包含的信息个数)
        let catalogSize = pointSize + colorSize;
        //类目字节数
        let catalogBytes = catalogSize * eleBytes;
        //颜色数据字节索引位置
        let colorByteIndex = pointSize * eleBytes;

        let sourceBuffer = webglContext.createBuffer();
        webglContext.bindBuffer(webglContext.ARRAY_BUFFER, sourceBuffer);
        webglContext.bufferData(webglContext.ARRAY_BUFFER, vertexData, webglContext.STATIC_DRAW);

        let aPosition = webglContext.getAttribLocation(webglContext.program, attrInfo[1]);
        let aColor = webglContext.getAttribLocation(webglContext.program, attrInfo[3]);
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
        const sourceSize = attrConf.reduce((a, b) => {
            return a + b.dataSize
        }, 0);
        const count = dataIsMulti ? vertexData.length / sourceSize : vertexData.length / size;
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

/**
 * 初始化纹理对象
 * @param webgl
 * @param fallback
 */
export function useInitTextureMap(webgl, fallback, imagesConf) {
    useEffect(() => {
        webgl.pixelStorei(webgl.UNPACK_FLIP_Y_WEBGL, 1);
        webgl.activeTexture(webgl.TEXTURE0);
        let texture = webgl.createTexture();
        webgl.bindTexture(webgl.TEXTURE_2D, texture);
        let conf = {};
        let imagePromiseList = imagesConf.map(({url, attr}, i) => {
            conf[i] = attr;
            return loadImage(url);
        });
        Promise.all(imagePromiseList).then(images => {
            images.forEach((image, i) => {

            });
            fallback && fallback()
        });
    }, [webgl]);
}
