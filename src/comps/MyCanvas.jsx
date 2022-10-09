/**
 * 用鼠标控制webgl点位(位置，大小)
 */
import {useEffect, useRef, useState} from "react";
import {initShaders, getWebGlPositionByMousePosition, renderPoints} from "../utils";

function MyCanvas() {
    let ref = useRef();
    const webGlRef = useRef();
    const positionRef = useRef();
    const pointSizeRef = useRef();
    const [pointPositions, setPointPositions] = useState([[0, 0, 40]]);

    const rgba = (red, green, blue, alpha = 1) => {
        return {
            red: red / 255,
            green: green / 255,
            blue: blue / 255,
            alpha
        };
    }

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
        if (gl) {
            // 指定将要用来清理绘图区的颜色
            gl.clearColor(0., 0.0, 0.0, 1.0);
            // // 清理绘图区
            gl.clear(gl.COLOR_BUFFER_BIT);
            pointPositions.forEach(([x, y, size]) => {
                //js控制点位尺寸
                gl.vertexAttrib1f(pointSize, size);
                gl.vertexAttrib2f(glPosition, x, y);
                // 绘制顶点
                gl.drawArrays(gl.POINTS, 0, 1);
            })
        }
    }, [pointPositions]);

    useEffect(() => {
        let gl = extracted();
        //顶点着色器
        let vertexShader = `
        //初始化顶点位置
        attribute vec4 a_Position;
        attribute float a_PointSize;
        void main() {
            gl_Position = a_Position;
            gl_PointSize = a_PointSize;
        }`;
        //片元着色器
        let fragmentShader = `void main() {
            gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
        }`;
        gl = initShaders(gl, vertexShader, fragmentShader);
        webGlRef.current = gl;
        // 通过js获取点坐标
        let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
        let a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
        positionRef.current = a_Position;
        pointSizeRef.current = a_PointSize;
    }, []);

    const changePositions = position => {
        const size = Math.random() * 100 + 40;
        setPointPositions([...pointPositions, [...position, size]]);
    }

    return <canvas ref={ref} onClick={e => getWebGlPositionByMousePosition(e, changePositions)}/>;
}

export default MyCanvas;
