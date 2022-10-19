/**
 * 绘制多点，（三角形,线段，闭合单线图形）
 */
import {useEffect, useRef} from "react";
import {initShaders, initCanvas, getWebGlPositionByMousePosition} from "../../utils";
import VERTEX_SHADER from "../../shaders/MultipleShaders/Vertex.glsl";
import FRAGMENT_SHADER from '../../shaders/MultipleShaders/Fragment.glsl';
import {useInitWebGlContext} from "../../hooks";

function MultiPoint() {
    let canvasRef = useRef();
    let [addVertex, setWebGl, draw] = useInitWebGlContext([], 'a_Position');

    function extracted() {

        //获取canvas元素并设置宽高
        const canvasNode = canvasRef.current;
        let canvas = initCanvas(canvasNode);

        //获取webgl画笔
        return canvas.getContext('webgl');
    }

    useEffect(() => {
        window.onresize = extracted;
        return () => window.onresize = null;
    }, []);

    useEffect(() => {
        let gl = extracted();
        gl = initShaders(gl, VERTEX_SHADER, FRAGMENT_SHADER);
        // 指定将要用来清理绘图区的颜色
        gl.clearColor(0., 0.0, 0.0, 1);
        setWebGl(gl);
    }, []);

    useEffect(() => {
        draw(['POINTS', 'LINE_STRIP']);
    });

    return <canvas
        ref={canvasRef}
    />
}

export default MultiPoint;
