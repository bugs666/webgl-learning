/**
 * 渐变色画布
 */
import {useEffect, useRef} from "react";
import {initShaders, initCanvas} from "../../../../utils";
import vertex from '@shader/CanvasShader/Vertex.glsl';
import fragment from '@shader/CanvasShader/Fragment.glsl';
import {useInitWebGlContext} from "../../../../hooks";
import {Vector2} from 'three';

function GradientCanvas() {
    let canvasRef = useRef();
    const {webgl, setWebGl, draw} = useInitWebGlContext({
        data: [
            -1, -1,
            1, 1,
            1, -1,
            -1, 1,
            1, 1,
            -1, -1
        ]
    });

    useEffect(() => {
        window.onresize = extracted;
        let gl = extracted();
        gl = initShaders(gl, vertex, fragment);
        // 指定将要用来清理绘图区的颜色
        gl.clearColor(0, 0, 0, 0);
        setWebGl(gl);
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
        if (!webgl) return;
        const canvasSize = webgl.getUniformLocation(webgl.program, 'u_CanvasSize');
        const sizeMat = new Vector2(canvasRef.current?.width, canvasRef.current?.height);
        webgl.uniform2fv(canvasSize, [sizeMat.x, sizeMat.y]);
        draw(['TRIANGLE_STRIP']);
    });

    return <canvas ref={canvasRef}/>
}

export default GradientCanvas;
