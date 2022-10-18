/**
 * 绘制简单几何面，（绘制多个三角面进行拼接）
 */
import {useEffect, useRef, useState} from "react";
import {initShaders, initCanvas, getWebGlPositionByMousePosition} from "../../utils";
import VERTEX_SHADER from "../../shaders/MultipleShaders/Vertex.glsl";
import FRAGMENT_SHADER from '../../shaders/MultipleShaders/Fragment.glsl';

function RectangularFace() {
    let canvasRef = useRef();
    const [pointConf, setPointConf] = useState(new Float32Array([
        //三个顶点位置（x，y）
        -0.2, 0.2,
        -0.2, -0.2,
        0.2, 0.2,

        -0.2, -0.2,
        0.2, -0.2,
        0.2, 0.2
    ]));

    useEffect(() => {
        window.onresize = extracted;
        return () => window.onresize = null;
    }, []);

    function extracted() {

        //获取canvas元素并设置宽高
        const canvasNode = canvasRef.current;
        let canvas = initCanvas(canvasNode);

        //获取webgl画笔
        return canvas.getContext('webgl');
    }

    useEffect(() => {
        if (!pointConf) return;
        let gl = extracted();
        gl = initShaders(gl, VERTEX_SHADER, FRAGMENT_SHADER);
        //创建缓冲对象，用于存储顶点数据
        let vertexBuffer = gl.createBuffer();
        //将缓冲对象和 缓冲区进行绑定
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        //将数据写入缓冲区中
        gl.bufferData(gl.ARRAY_BUFFER, pointConf, gl.STATIC_DRAW);
        // 通过js获取点坐标
        let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
        /**
         * 从指定的缓冲区中读取数据，
         * 用法：https://developer.mozilla.org/zh-CN/docs/Web/API/WebGLRenderingContext/vertexAttribPointer
         */
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
        //开启顶点数据的批处理，着色器默认只会一个一个接收顶点数据，逐个绘制
        gl.enableVertexAttribArray(a_Position);
        // 指定将要用来清理绘图区的颜色
        gl.clearColor(0., 0.0, 0.0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        //绘图，绘制模式，从哪里开始，绘制数量
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 6);
    }, [pointConf]);

    return <canvas ref={canvasRef}/>
}

export default RectangularFace;
