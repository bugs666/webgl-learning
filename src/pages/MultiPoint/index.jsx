/**
 * 绘制多点，（三角形,线段，闭合单线图形）
 */
import {useEffect, useRef} from "react";
import {initShaders, initCanvas, getWebGlPositionByMousePosition} from "../../utils";
import VERTEX_SHADER from "../../shaders/MultipleShaders/Vertex.glsl";
import FRAGMENT_SHADER from '../../shaders/MultipleShaders/CircleFragment.glsl';
import {useInitWebGlContext} from "../../hooks";

function MultiPoint() {
    let canvasRef = useRef();
    let {addVertex, setWebGl, draw} = useInitWebGlContext({
        data: [
            //三个顶点位置（x，y）
            0, 0.2,
            -0.1, -0.1,
            0.1, -0.1
        ],
        position: 'a_Position'
    });

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
        draw(['POINTS', 'LINE_LOOP']);
    });

    const addPoint = position => {
        let {x, y} = position;
        x = Number(x).toFixed(3) * 1;
        y = Number(y).toFixed(3) * 1;
        addVertex([x, y]);
    }

    return <canvas ref={canvasRef} onClick={e => getWebGlPositionByMousePosition(e, addPoint)}/>
}

export default MultiPoint;
