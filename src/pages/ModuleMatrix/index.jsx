/**
 * 模型矩阵
 * 描述模型运动，旋转，位移，缩放
 */
import {useEffect, useRef} from "react";
import {initShaders, initCanvas, buildLengthWidthEqualScale} from "../../utils";
import VERTEX_SHADER from "../../shaders/MatrixShaders/ModuleVertex.glsl";
import FRAGMENT_SHADER from '../../shaders/MultipleShaders/CircleFragment.glsl';
import {useInitWebGlContext} from "../../hooks";
import {Matrix4, Vector3} from 'three';

function MultiPoint() {
    let canvasRef = useRef();
    let {setWebGl, draw, webgl, setData} = useInitWebGlContext({
        data: [],
        position: 'a_Position',
        size: 3,
        pointIndex: new Uint8Array([
            0, 1,
            1, 2,
            2, 3,
            3, 0,

            0, 5,
            1, 6,
            2, 7,
            3, 4,

            4, 5,
            5, 6,
            6, 7,
            7, 4
        ])
    });

    useEffect(() => {
        window.onresize = extracted;
        return () => window.onresize = null;
    }, []);

    const rebuildData = canvas => {
        let scale = buildLengthWidthEqualScale(canvas);
        const data = [0.2, 0.2, 0.2,
            -0.2, 0.2, 0.2,
            -0.2, -0.2, 0.2,
            0.2, -0.2, 0.2,
            0.2, -0.2, -0.2,
            0.2, 0.2, -0.2,
            -0.2, 0.2, -0.2,
            -0.2, -0.2, -0.2];
        let newData = data.map((it, index) => {
            return index % 3 === 0 ? it * scale : it;
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

    /**
     * 根据视点坐标，目标点坐标，上方向 构建视图矩阵
     * @param viewPoint   视点坐标
     * @param targetPoint 目标点坐标
     * @param upDirection 上方向
     */
    const getViewMatrix = (viewPoint, targetPoint, upDirection) => {
        //视线方向单位向量
        let sight = new Vector3().subVectors(viewPoint, targetPoint).normalize();
        //根据上方向和视线方向计算视线和上方向平面的法向量
        let normalVector = new Vector3().crossVectors(upDirection, sight).normalize();
        //根据上面求出的两个值计算垂直的上方向
        let newUpDirection = new Vector3().crossVectors(sight, normalVector).normalize();

        const {x: sx, y: sy, z: sz} = sight;
        // 旋转矩阵
        const rotation = new Matrix4().set(
            ...normalVector, 0,
            ...newUpDirection, 0,
            -sx, -sy, -sz, 0,
            0, 0, 0, 1);

        const {x: vx, y: vy, z: vz} = viewPoint;
        // 位移矩阵
        const transition = new Matrix4().set(
            1, 0, 0, -vx,
            0, 1, 0, -vy,
            0, 0, 1, -vz,
            0, 0, 0, 1
        );

        return rotation.multiply(transition).elements;
    }

    return <canvas ref={canvasRef}/>
}

export default MultiPoint;
