/**
 * 图形旋转
 */
import {useEffect, useRef} from "react";
import {initShaders, initCanvas} from "../../utils";
import VERTEX_SHADER from "../../shaders/Rotate/Vertex.glsl";
import FRAGMENT_SHADER from '../../shaders/MultipleShaders/CircleFragment.glsl';
import {useInitWebGlContext} from "../../hooks";

function MultiPoint() {
    let canvasRef = useRef();
    let zRef = useRef(0);
    let {addVertex, setWebGl, draw, webgl} = useInitWebGlContext({});

    function initSquareData(canvas) {
        const {width, height} = canvas;
        const widthHeightRatio = width / height;
        const squH = 1.0;
        const squW = squH / widthHeightRatio;
        const [maxSquX, maxSquY] = [squW / 2, squH / 2];
        return [
            -maxSquX, maxSquY,
            maxSquX, maxSquY,
            maxSquX, -maxSquY,
            -maxSquX, -maxSquY
        ]
    }

    useEffect(() => {
        window.onresize = extracted;
        return () => window.onresize = null;
    }, []);

    function extracted() {

        //获取canvas元素并设置宽高
        const canvasNode = canvasRef.current;
        let canvas = initCanvas(canvasNode);
        addVertex(initSquareData(canvas));
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
            zRef.current += 0.02;
            let angle = webgl.getUniformLocation(webgl.program, 'angle');
            webgl.uniform1f(angle, zRef.current);
            draw(['LINE_LOOP']);
            requestAnimationFrame(ani);
        })();
    });

    const addPoint = position => {
        let {x, y} = position;
        x = Number(x).toFixed(3) * 1;
        y = Number(y).toFixed(3) * 1;
        addVertex([x, y]);
    }

    return <canvas ref={canvasRef} /*onClick={() => flagRef.current = !flagRef.current}*//>
}

export default MultiPoint;
