/**
 * 模型矩阵
 * 描述模型运动，旋转，位移，缩放
 */
import {useEffect, useRef} from "react";
import {initShaders, initCanvas, buildLengthWidthEqualScale, getViewMatrix} from "../../utils";
import VERTEX_SHADER from "../../shaders/MatrixShaders/ModuleVertex.glsl";
import FRAGMENT_SHADER from '../../shaders/MultipleShaders/CircleFragment.glsl';
import {useInitWebGlContext} from "../../hooks";
import {Matrix4, Vector3} from 'three';
import {CUBIC_DATA, POINT_INDEXES} from "../../constant";

function MultiPoint() {
    let canvasRef = useRef();
    //旋转角度
    let rotateRef = useRef(0);
    //位移高度
    let yRef = useRef(0.7);
    //运动速度
    let vyRef = useRef(0);
    let {setWebGl, draw, webgl, setData} = useInitWebGlContext({
        data: [],
        position: 'a_Position',
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
        let viewMat = webgl.getUniformLocation(webgl.program, 'u_ViewMat');
        webgl.uniformMatrix4fv(viewMat, false, viewMatrix);
        let moduleMat = webgl.getUniformLocation(webgl.program, 'u_ModuleMat');
        let moduleMatrix = new Matrix4();
        (function ani() {
            rotateRef.current += 0.01;
            //运动加速度为-0.001，下落速度逐渐加快 v= V0+at;
            vyRef.current -= 0.001;
            //从初始高度开始下落 （此处并不遵循物理的位移公式，只是为了高度加快递减）
            yRef.current += vyRef.current;
            moduleMatrix.makeRotationY(rotateRef.current);
            moduleMatrix.setPosition(0, yRef.current, 0);
            let element_13 = moduleMatrix.elements[13];
            webgl.uniformMatrix4fv(moduleMat, false, moduleMatrix.elements);
            if (element_13 <= -0.6) {
                yRef.current = -0.6;
                vyRef.current *= -1;
            }
            draw(['LINES']);
            requestAnimationFrame(ani);
        })();
    });

    return <canvas ref={canvasRef}/>
}

export default MultiPoint;
