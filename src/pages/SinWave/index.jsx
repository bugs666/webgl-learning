/**
 * 视图矩阵
 * 从哪个点观察目标
 */
import {useEffect, useRef} from "react";
import {initShaders, initCanvas, buildLengthWidthEqualScale} from "../../utils";
import VERTEX_SHADER from "../../shaders/MatrixShaders/WaveVertex.glsl";
import FRAGMENT_SHADER from '../../shaders/MultipleShaders/CircleFragment.glsl';
import {useInitWebGlContext} from "../../hooks";
import {Matrix4, Vector3} from 'three';

function MultiPoint() {
    let canvasRef = useRef();
    let {setWebGl, draw, webgl, setData} = useInitWebGlContext({
        data: [],
        position: 'a_Position',
        size: 3
    });

    useEffect(() => {
        window.onresize = extracted;
        return () => window.onresize = null;
    }, []);

    const rebuildData = canvas => {
        // let scale = buildLengthWidthEqualScale(canvas);
        let newData = [];
        let [minX, maxX, minZ, maxZ] = [-0.8, 0.7, -0.9, 0.9];
        for (let z = minZ; z < maxZ; z += 0.04) {
            for (let x = minX; x < maxX; x += 0.04) {
                newData.push(x, 0, z);
            }
        }
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
        const viewMatrix = new Matrix4().lookAt(
            new Vector3(-0.2, -1, 0.6),
            new Vector3(0.0, 0.1, 0),
            new Vector3(0, 1, 0)
        );
        let matVal = webgl.getUniformLocation(webgl.program, 'u_ViewMat');
        webgl.uniformMatrix4fv(matVal, false, viewMatrix.elements);
        draw(['POINTS']);
    }, [webgl]);

    return <canvas ref={canvasRef}/>
}

export default MultiPoint;
