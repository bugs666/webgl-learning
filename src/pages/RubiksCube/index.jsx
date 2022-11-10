/**
 * 模型矩阵
 * 描述模型运动，旋转，位移，缩放
 */
import {useEffect, useRef} from "react";
import {initShaders, initCanvas, buildLengthWidthEqualScale, getViewMatrix} from "../../utils";
import VERTEX_SHADER from "@shader/RubiksCubeShaders/Vertex.glsl";
import FRAGMENT_SHADER from '@shader/RubiksCubeShaders/Fragment.glsl';
import {useInitWebGlContext} from "../../hooks";
import {Matrix4, Vector3} from 'three';
import mf from '@assets/mf.jpg';

function MultiPoint() {
    let canvasRef = useRef();
    let {setWebGl, draw, webgl, setData} = useInitWebGlContext({
        dataIsMulti: true,
        attrConf: [
            {attrName: 'a_Position', dataSize: 3},
            {attrName: 'a_Pin', dataSize: 2}
        ]
    });

    useEffect(() => {
        window.onresize = extracted;
        return () => window.onresize = null;
    }, []);

    const rebuildData = canvas => {
        let scale = buildLengthWidthEqualScale(canvas);
        const data = [
            -0.4, -0.4, -0.4, 0, 0,
            -0.4, 0.4, -0.4, 0, 0.5,
            0.4, -0.4, -0.4, 0.25, 0,
            -0.4, 0.4, -0.4, 0, 0.5,
            0.4, 0.4, -0.4, 0.25, 0.5,
            0.4, -0.4, -0.4, 0.25, 0,

            -0.4, -0.4, 0.4, 0.25, 0,
            0.4, -0.4, 0.4, 0.5, 0,
            -0.4, 0.4, 0.4, 0.25, 0.5,
            -0.4, 0.4, 0.4, 0.25, 0.5,
            0.4, -0.4, 0.4, 0.5, 0,
            0.4, 0.4, 0.4, 0.5, 0.5,

            -0.4, 0.4, -0.4, 0.5, 0,
            -0.4, 0.4, 0.4, 0.5, 0.5,
            0.4, 0.4, -0.4, 0.75, 0,
            -0.4, 0.4, 0.4, 0.5, 0.5,
            0.4, 0.4, 0.4, 0.75, 0.5,
            0.4, 0.4, -0.4, 0.75, 0,

            -0.4, -0.4, -0.4, 0, 0.5,
            0.4, -0.4, -0.4, 0.25, 0.5,
            -0.4, -0.4, 0.4, 0, 1,
            -0.4, -0.4, 0.4, 0, 1,
            0.4, -0.4, -0.4, 0.25, 0.5,
            0.4, -0.4, 0.4, 0.25, 1,

            -0.4, -0.4, -0.4, 0.25, 0.5,
            -0.4, -0.4, 0.4, 0.25, 1,
            -0.4, 0.4, -0.4, 0.5, 0.5,
            -0.4, -0.4, 0.4, 0.25, 1,
            -0.4, 0.4, 0.4, 0.5, 1,
            -0.4, 0.4, -0.4, 0.5, 0.5,

            0.4, -0.4, -0.4, 0.5, 0.5,
            0.4, 0.4, -0.4, 0.75, 0.5,
            0.4, -0.4, 0.4, 0.5, 1,
            0.4, -0.4, 0.4, 0.5, 1,
            0.4, 0.4, -0.4, 0.75, 0.5,
            0.4, 0.4, 0.4, 0.75, 1,
        ];
        for (let i = 0, j = data.length; i < j; i += 5) {
            data[i] = scale * data[i];
            data[i + 2] = scale * data[i + 2];
        }
        setData(data);
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
        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);
        setWebGl(gl);
    }, []);

    useEffect(() => {
        if (!webgl) return;
        webgl.activeTexture(webgl.TEXTURE0);
        const texture = webgl.createTexture();
        webgl.bindTexture(webgl.TEXTURE_2D, texture);
        const image = new Image();
        image.src = mf;
        image.onload = () => {
            // 配置纹理图像
            webgl.texImage2D(webgl.TEXTURE_2D, 0, webgl.RGB, webgl.RGB, webgl.UNSIGNED_BYTE, image);
            //配置纹理参数
            webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.LINEAR);
            const uSampler = webgl.getUniformLocation(webgl.program, 'u_Sampler');
            let moduleMatrix = new Matrix4();
            let moduleMat = webgl.getUniformLocation(webgl.program, 'u_ModuleMat');
            webgl.uniform1i(uSampler, 0);
            // (function ani() {
                const x = new Matrix4().makeRotationX(0.5 * Math.PI);
                // const y = new Matrix4().makeRotationY(0.02);
                // webgl.uniformMatrix4fv(moduleMat, false, moduleMatrix.multiply(y).elements);
                webgl.uniformMatrix4fv(moduleMat, false, moduleMatrix.multiply(x).elements);
                // webgl.uniformMatrix4fv(moduleMat, false, moduleMatrix.multiply(x).multiply(y).elements);
                // const viewMatrix = new Matrix4().lookAt(
                //     new Vector3(0, 1, 0),
                //     new Vector3(),
                //     new Vector3(0, 1, 0)
                // );
                // webgl.uniformMatrix4fv(moduleMat, false, viewMatrix.multiply(moduleMatrix).elements);
                draw(['TRIANGLES']);
            //     requestAnimationFrame(ani);
            // })()
        }
    }, [webgl]);

    return <canvas ref={canvasRef}/>
}

export default MultiPoint;
