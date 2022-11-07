import {useEffect, useRef} from "react";
import {initShaders, initCanvas, buildLinearScale} from "../../utils";
import VERTEX_SHADER from "../../shaders/MatrixShaders/WaveVertex.glsl";
import FRAGMENT_SHADER from '../../shaders/MatrixShaders/Fragment.glsl';
import {useInitWebGlContext} from "../../hooks";
import {Matrix4, Vector3, Color} from 'three';

function MultiPoint() {
    let canvasRef = useRef();
    let phiRef = useRef(0);

    let {setWebGl, draw, webgl, setData, verticesData, updateBuffer} = useInitWebGlContext({
        dataIsMulti: true
    });

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
        if (!webgl) return;
        const viewMatrix = new Matrix4().lookAt(
            new Vector3(0.2, 1, 1),
            new Vector3(),
            new Vector3(0, 1, 0)
        );
        let matVal = webgl.getUniformLocation(webgl.program, 'u_ViewMat');
        webgl.uniformMatrix4fv(matVal, false, viewMatrix.elements);
        (function ani() {
            phiRef.current += 0.08;
            rebuildData(verticesData);
            setData(verticesData);
            updateBuffer(verticesData);
            draw(['POINTS']);
            requestAnimationFrame(ani);
        })();
    });

    const getXYAndZScale = () => {
        let [minX, maxX, minZ, maxZ] = [-0.8, 0.7, -0.9, 0.9];
        let [minAngX, maxAngX, minAngZ, maxAngZ] = [0, Math.PI * 4, 0, Math.PI * 2];
        let [minY, maxY, minG, maxG] = [-0.13, 0.13, 0.15, 0.5];
        const zScale = buildLinearScale(minZ, maxZ, minAngZ, maxAngZ);
        const xScale = buildLinearScale(minX, maxX, minAngX, maxAngX);
        const yScale = buildLinearScale(minY, maxY, minG, maxG);
        return [xScale, zScale, yScale];
    }

    const initData = () => {
        let newData = [];
        let [minX, maxX, minZ, maxZ] = [-0.8, 0.7, -0.9, 0.9];
        for (let z = minZ; z < maxZ; z += 0.04) {
            for (let x = minX; x < maxX; x += 0.04) {
                newData.push(x, 0, z, 0.5, 1, 0.6, 1);
            }
        }
        return newData;
    };
    const rebuildData = data => {
        let [xScale, zScale, yScale] = getXYAndZScale();
        for (let i = 0, j = data.length; i < j; i += 7) {
            const [x, z] = [data[i], data[i + 2]];
            // y = A*sin(w * x+ angle) 三角函数
            let a = 0.1 * Math.sin(zScale(z)) + 0.03;
            let offset = xScale(x) + phiRef?.current || 0;
            const y = a * Math.sin(2 * zScale(z) + offset);
            const {r, g, b} = new Color().setHSL(yScale(y), 1, 0.6);
            data[i + 1] = y;
            data[i + 3] = r;
            data[i + 4] = g;
            data[i + 5] = b;
        }
    }

    function extracted() {

        //获取canvas元素并设置宽高
        const canvasNode = canvasRef.current;
        let canvas = initCanvas(canvasNode);
        let data = initData();
        rebuildData(data);
        setData(data);
        //获取webgl画笔
        return canvas.getContext('webgl');
    }

    function render() {
        console.log(123);
        return <canvas ref={canvasRef}/>
    }

    return render();
}

export default MultiPoint;
