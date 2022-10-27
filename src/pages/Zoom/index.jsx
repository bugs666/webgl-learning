/**
 * 平移变换
 */
import {useEffect, useRef} from "react";
import {initShaders, initCanvas} from "../../utils";
import VERTEX_SHADER from "../../shaders/Zoom/Vertex.glsl";
import FRAGMENT_SHADER from '../../shaders/MultipleShaders/CircleFragment.glsl';
import {useInitWebGlContext} from "../../hooks";

function MultiPoint() {
    let canvasRef = useRef();
    let scaleRef = useRef(0);
    let {addVertex, setWebGl, draw, webgl} = useInitWebGlContext([
        //三个顶点位置（x，y）
        0, 0.2,
        -0.1, -0.1,
        0.1, -0.1
    ], 'a_Position');

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
        let gl = extracted();
        gl = initShaders(gl, VERTEX_SHADER, FRAGMENT_SHADER);
        // 指定将要用来清理绘图区的颜色
        gl.clearColor(0., 0.0, 0.0, 1);
        setWebGl(gl);
    }, []);


    useEffect(() => {
        (function ani() {
            if (!webgl) return;
            scaleRef.current += 0.02;
            let scaleVal = Math.sin(scaleRef.current) + 1.5;
            let scale = webgl.getUniformLocation(webgl.program, 'scale');
            webgl.uniform1f(scale, scaleVal);
            draw(['LINE_LOOP']);
            requestAnimationFrame(ani);
        })();
    });

    return <canvas ref={canvasRef}/>
}

export default MultiPoint;
