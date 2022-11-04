/**
 * 多点异色，attribute合一
 * 前三位位置坐标，后四位色值
 * [x,y,z,r,g,b,a]
 */
import {useEffect, useRef, useState} from "react";
import {initShaders, initCanvas} from "../../../../utils";
import VERTEX_SHADER from "@shader/MultipleColor/Vertex.glsl";
import FRAGMENT_SHADER from '@shader/MultipleColor/Fragment.glsl';

function MultiColorPoint() {
    let canvasRef = useRef();
    let [pointData] = useState(new Float32Array([
        0, 0.5, 0, 1, 0, 0, 1,
        -0.2, -0.4, 0, 0, 1, 0, 1,
        0.2, -0.4, 0, 0, 0, 1, 1
    ]));

    let [webGl, setWebGl] = useState(null);

    useEffect(() => {
        window.onresize = extracted;
        return () => window.onresize = null;
    }, []);

    function extracted() {

        //获取canvas元素并设置宽高
        const canvasNode = canvasRef.current;
        let canvas = initCanvas(canvasNode, 'painter-container');

        //获取webgl画笔
        return canvas.getContext('webgl');
    }

    useEffect(() => {
        let gl = extracted();
        gl = initShaders(gl, VERTEX_SHADER, FRAGMENT_SHADER);
        // 指定将要用来清理绘图区的颜色
        gl.clearColor(0., 0.0, 0.0, 1);
        setWebGl(gl);
    }, []);

    useEffect(() => {
        if (!webGl) return;
        //系列尺寸(点，颜色)，点数据字节索引——0
        let pointSize = 3, colorSize = 4, pointByteIndex = 0;
        //元素字节数
        let eleBytes = pointData.BYTES_PER_ELEMENT;
        //类目尺寸(一条完整的数据包含的信息个数)
        let catalogSize = pointSize + colorSize;
        //类目字节数
        let catalogBytes = catalogSize * eleBytes;
        //颜色数据字节索引位置
        let colorByteIndex = pointSize * eleBytes;
        // 顶点总数
        let dataSize = pointData.length / catalogSize;

        let sourceBuffer = webGl.createBuffer();
        webGl.bindBuffer(webGl.ARRAY_BUFFER, sourceBuffer);
        webGl.bufferData(webGl.ARRAY_BUFFER, pointData, webGl.STATIC_DRAW);

        let aPosition = webGl.getAttribLocation(webGl.program, 'a_Position');
        let aColor = webGl.getAttribLocation(webGl.program, 'a_Color');
        /**
         * 顶点着色器中的a_Position变量从数据源中查找自己的数据
         */
        webGl.vertexAttribPointer(aPosition, pointSize, webGl.FLOAT, false, catalogBytes, pointByteIndex);
        webGl.vertexAttribPointer(aColor, colorSize, webGl.FLOAT, false, catalogBytes, colorByteIndex);
        webGl.enableVertexAttribArray(aPosition);
        webGl.enableVertexAttribArray(aColor);

        webGl.clear(webGl.COLOR_BUFFER_BIT);
        webGl.drawArrays(webGl.TRIANGLES, 0, dataSize);

    }, [webGl]);

    return <canvas ref={canvasRef}/>
}

export default MultiColorPoint;
