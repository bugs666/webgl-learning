/**
 * 图形转面，图形网格化
 */
import {useEffect, useRef} from "react";
import {initShaders, initCanvas, buildLinearScale} from "../../utils";
import VERTEX_SHADER from "../../shaders/MultipleShaders/Vertex.glsl";
import FRAGMENT_SHADER from '../../shaders/MultipleShaders/Fragment.glsl';
import {useInitWebGlContext} from "../../hooks";
import {SQUARE_PATH_DATA} from "../../constant";

function MultiPoint() {
    let canvasRef = useRef();
    let {addVertex, setWebGl, draw} = useInitWebGlContext({});

    function initSquareData(canvas) {
        const {width, height} = canvas;
        const widthHeightRatio = width / height;
        const squH = 1.0;
        const squW = squH / widthHeightRatio;
        const [maxSquX, maxSquY] = [squW / 2, squH / 2];
        let getWebGlPositionX = buildLinearScale(0, -maxSquX, 600, maxSquX);
        let getWebGlPositionY = buildLinearScale(0, -maxSquY, 600, maxSquY);
        return SQUARE_PATH_DATA.map((position, i) => {
            const flag = i % 2 === 0
            if (flag) return getWebGlPositionX(position)
            return getWebGlPositionY(position);
        });
    }

    function extracted() {

        //获取canvas元素并设置宽高
        const canvasNode = canvasRef.current;
        let canvas = initCanvas(canvasNode);
        addVertex(initSquareData(canvas));
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
        draw(['POINTS', 'LINE_LOOP']);
    });

    return <canvas
        ref={canvasRef}
    />
}

export default MultiPoint;
