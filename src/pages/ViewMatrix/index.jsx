/**
 * 视图矩阵
 * 从哪个点观察目标
 */
import {useEffect, useRef} from "react";
import {initShaders, initCanvas, buildLengthWidthEqualScale, getViewMatrix} from "../../utils";
import VERTEX_SHADER from "../../shaders/MatrixShaders/Vertex.glsl";
import FRAGMENT_SHADER from '../../shaders/MultipleShaders/CircleFragment.glsl';
import {useInitWebGlContext} from "../../hooks";
import {Matrix4, Vector3} from 'three';
import {CUBIC_DATA, POINT_INDEXES} from "../../constant";

function MultiPoint() {
    let canvasRef = useRef();
    let {setWebGl, draw, webgl, setData} = useInitWebGlContext({
        data: [],
        size: 3,
        pointIndex: POINT_INDEXES
    });

    useEffect(() => {
        window.onresize = extracted;
        return () => window.onresize = null;
    }, []);

    const rebuildData = canvas => {
        let scale = buildLengthWidthEqualScale(canvas);
        let newData = CUBIC_DATA.map((it, index) => {
            return index % 3 === 0 || (index + 1) % 3 === 0 ? it * scale : it;
        });
        setData(newData);
    };

    function extracted() {

        //获取canvas元素并设置宽高
        const canvasNode = canvasRef.current;
        let canvas = initCanvas(canvasNode);
        rebuildData(canvas);
        buildLengthWidthEqualScale(canvas);
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
        if (!webgl) return;
        const viewMatrix = getViewMatrix(
            new Vector3(0.1, 0.2, 0.5),
            new Vector3(0.0, 0.1, 0),
            new Vector3(0, 1, 0)
        )
        let matVal = webgl.getUniformLocation(webgl.program, 'u_mat');
        webgl.uniformMatrix4fv(matVal, false, viewMatrix);
        draw(['LINES']);
    }, [webgl]);

    return <canvas ref={canvasRef}/>
}

export default MultiPoint;
