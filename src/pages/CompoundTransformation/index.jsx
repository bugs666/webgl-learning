/**
 * 平移变换
 */
import {useEffect, useRef} from "react";
import {initShaders, initCanvas} from "../../utils";
import VERTEX_SHADER from "../../shaders/MatrixShaders/Vertex.glsl";
import FRAGMENT_SHADER from '../../shaders/MultipleShaders/CircleFragment.glsl';
import {useInitWebGlContext} from "../../hooks";
import {Matrix4, Vector3} from 'three';

function MultiPoint() {
    let canvasRef = useRef();
    let transitionRef = useRef(0);
    let rotateRef = useRef(0);
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
            rotateRef.current += 0.01;
            if (transitionRef.current > 1) {
                transitionRef.current = -1;
            } else {
                transitionRef.current += 0.02;
            }
            scaleRef.current += 0.01;
            let angle = Math.sin(scaleRef.current) + 1;
            const rotationM = new Matrix4().makeRotationZ(rotateRef.current);
            const translationM = new Matrix4().makeTranslation(transitionRef.current, transitionRef.current, 0);
            const scaleM = new Matrix4().makeScale(angle, angle, angle);
            const matrix = rotationM.multiply(scaleM).multiply(translationM);
            let matVal = webgl.getUniformLocation(webgl.program, 'u_mat');
            webgl.uniformMatrix4fv(matVal, false, matrix.elements);
            draw(['TRIANGLES']);
            requestAnimationFrame(ani);
        })();
    });

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

        new Matrix4().set()
    }

    return <canvas ref={canvasRef}/>
}

export default MultiPoint;
