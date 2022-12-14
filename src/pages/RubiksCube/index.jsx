import {useEffect, useRef} from "react";
import {initShaders, initCanvas, buildLengthWidthEqualScale, getViewMatrix} from "../../utils";
import VERTEX_SHADER from "@shader/RubiksCubeShaders/Vertex.glsl";
import FRAGMENT_SHADER from '@shader/RubiksCubeShaders/Fragment.glsl';
import {useInitWebGlContext} from "../../hooks";
import {Matrix4, OrthographicCamera} from 'three';
import mf from '@assets/mf.jpg';

function MultiPoint() {
    let canvasRef = useRef();
    let {setWebGl, draw, webgl, setData} = useInitWebGlContext({
        dataIsMulti: true,
        attrConf: [
            {attrName: 'a_Position', dataSize: 3},
            {attrName: 'a_Pin', dataSize: 2}
        ],
        data: [
            -0.5, -0.5, -0.5, 0, 0,
            -0.5, 0.5, -0.5, 0, 0.5,
            0.5, -0.5, -0.5, 0.25, 0,
            -0.5, 0.5, -0.5, 0, 0.5,
            0.5, 0.5, -0.5, 0.25, 0.5,
            0.5, -0.5, -0.5, 0.25, 0,

            -0.5, -0.5, 0.5, 0.25, 0,
            0.5, -0.5, 0.5, 0.5, 0,
            -0.5, 0.5, 0.5, 0.25, 0.5,
            -0.5, 0.5, 0.5, 0.25, 0.5,
            0.5, -0.5, 0.5, 0.5, 0,
            0.5, 0.5, 0.5, 0.5, 0.5,

            -0.5, 0.5, -0.5, 0.5, 0,
            -0.5, 0.5, 0.5, 0.5, 0.5,
            0.5, 0.5, -0.5, 0.75, 0,
            -0.5, 0.5, 0.5, 0.5, 0.5,
            0.5, 0.5, 0.5, 0.75, 0.5,
            0.5, 0.5, -0.5, 0.75, 0,

            -0.5, -0.5, -0.5, 0, 0.5,
            0.5, -0.5, -0.5, 0.25, 0.5,
            -0.5, -0.5, 0.5, 0, 1,
            -0.5, -0.5, 0.5, 0, 1,
            0.5, -0.5, -0.5, 0.25, 0.5,
            0.5, -0.5, 0.5, 0.25, 1,

            -0.5, -0.5, -0.5, 0.25, 0.5,
            -0.5, -0.5, 0.5, 0.25, 1,
            -0.5, 0.5, -0.5, 0.5, 0.5,
            -0.5, -0.5, 0.5, 0.25, 1,
            -0.5, 0.5, 0.5, 0.5, 1,
            -0.5, 0.5, -0.5, 0.5, 0.5,

            0.5, -0.5, -0.5, 0.5, 0.5,
            0.5, 0.5, -0.5, 0.75, 0.5,
            0.5, -0.5, 0.5, 0.5, 1,
            0.5, -0.5, 0.5, 0.5, 1,
            0.5, 0.5, -0.5, 0.75, 0.5,
            0.5, 0.5, 0.5, 0.75, 1,
        ]
    });

    useEffect(() => {
        window.onresize = extracted;
        return () => window.onresize = null;
    }, []);

    function extracted() {

        //??????canvas?????????????????????
        const canvasNode = canvasRef.current;
        let canvas = initCanvas(canvasNode);
        // rebuildData(canvas);
        buildLengthWidthEqualScale(canvas);
        //??????webgl??????
        return canvas.getContext('webgl');
    }

    useEffect(() => {
        let gl = extracted();
        gl = initShaders(gl, VERTEX_SHADER, FRAGMENT_SHADER);
        // ??????????????????????????????????????????
        gl.clearColor(0., 0.0, 0.0, 1);
        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);
        setWebGl(gl);
    }, []);

    const buildCamera = () => {
        let canvas = canvasRef.current;
        let scale = buildLengthWidthEqualScale(canvas);
        const halfCameraH = 2;
        let halfCameraW = halfCameraH / scale;
        //?????????????????????????????????(??????)??????
        return [-halfCameraW, halfCameraW, halfCameraH, -halfCameraH, 0, 4];
    }

    useEffect(() => {
        if (!webgl) return;
        webgl.activeTexture(webgl.TEXTURE0);
        const texture = webgl.createTexture();
        webgl.bindTexture(webgl.TEXTURE_2D, texture);
        const image = new Image();
        image.src = mf;
        image.onload = () => {
            // ??????????????????
            webgl.texImage2D(webgl.TEXTURE_2D, 0, webgl.RGB, webgl.RGB, webgl.UNSIGNED_BYTE, image);
            //??????????????????
            webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.LINEAR);
            const uSampler = webgl.getUniformLocation(webgl.program, 'u_Sampler');
            let pvMatrix = webgl.getUniformLocation(webgl.program, 'u_pvMatrix');
            let moduleMat = webgl.getUniformLocation(webgl.program, 'u_ModuleMat');
            let moduleMatrix = new Matrix4();
            //??????????????????
            let camera = new OrthographicCamera(...buildCamera());
            camera.position.set(0, 0, 3);
            camera.updateMatrixWorld(true);
            const pvMat = new Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
            webgl.uniformMatrix4fv(pvMatrix, false, pvMat.elements);
            webgl.uniform1i(uSampler, 0);
            (function ani() {
                const x = new Matrix4().makeRotationX(0.02);
                const y = new Matrix4().makeRotationY(0.02);
                webgl.uniformMatrix4fv(moduleMat, false, moduleMatrix.multiply(x).multiply(y).elements);
                draw(['TRIANGLES']);
                requestAnimationFrame(ani);
            })();
        }
    }, [webgl]);

    return <canvas ref={canvasRef}/>
}

export default MultiPoint;
