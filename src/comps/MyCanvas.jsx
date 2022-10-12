/**
 * 用鼠标控制webgl点位(位置，大小，颜色)
 * 绘制圆形顶点
 */
import {useEffect, useRef, useState} from "react";
import {initShaders, getWebGlPositionByMousePosition} from "../utils";
import COMMON_VERTEX_SHADER from "../shaders/CommonVertex.glsl";
import COMMON_FRAGMENT_SHADER from '../shaders/CommonFragment.glsl';
import CIRCLE_FRAGMENT_SHADER from '../shaders/CircleFragment.glsl';

function MyCanvas() {
    let ref = useRef();
    const webGlRef = useRef();
    const positionRef = useRef();
    const pointSizeRef = useRef();
    const colorRef = useRef();
    const [pointConf, setPointConf] = useState([{
        x: 0, y: 0, size: 40, color: [0, 1.0, 1.0, 0]
    }]);

    useEffect(() => {
        window.onresize = extracted;
        return () => window.onresize = null;
    }, []);

    function extracted() {
        if (!ref.current) {
            return;
        }
        //获取canvas元素并设置宽高
        const canvasNode = ref.current;
        canvasNode.height = window.innerHeight;
        canvasNode.width = window.innerWidth;

        //获取webgl画笔
        return canvasNode.getContext('webgl');
    }

    useEffect(() => {
        const gl = webGlRef.current;
        const glPosition = positionRef.current;
        const pointSize = pointSizeRef.current;
        const pointColor = colorRef.current;
        if (gl) {
            // 指定将要用来清理绘图区的颜色
            gl.clearColor(0., 0.0, 0.0, 0);
            // // 清理绘图区
            gl.clear(gl.COLOR_BUFFER_BIT);
            pointConf.forEach(({x, y, size, color}) => {
                const [r, g, b, a] = color;
                //js控制点位尺寸
                gl.vertexAttrib1f(pointSize, size);
                gl.vertexAttrib2f(glPosition, x, y);
                // gl.uniform4f(pointColor, r, g, b, a);
                gl.uniform4fv(pointColor, color);
                // 绘制顶点
                gl.drawArrays(gl.POINTS, 0, 1);
            })
        }
    }, [pointConf]);

    useEffect(() => {
        let gl = extracted();
        gl = initShaders(gl, COMMON_VERTEX_SHADER, CIRCLE_FRAGMENT_SHADER);
        webGlRef.current = gl;
        // 通过js获取点坐标
        let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
        // 通过js获取获取点尺寸
        let a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
        // 通过js获取片元色值
        const a_FragColor = gl.getUniformLocation(gl.program, 'a_FragColor');
        positionRef.current = a_Position;
        pointSizeRef.current = a_PointSize;
        colorRef.current = a_FragColor;
    }, []);

    const changePositions = position => {
        setPointConf([...pointConf, {
            ...position,
            //随机生成点位的尺寸值
            size: Math.random() * 100 + 40,
            //随机生成rgba色值
            color: [Math.random(), Math.random(), Math.random(), 1.0]
        }]);
    }

    return <canvas ref={ref} onClick={e => getWebGlPositionByMousePosition(e, changePositions)}/>;
}

export default MyCanvas;
