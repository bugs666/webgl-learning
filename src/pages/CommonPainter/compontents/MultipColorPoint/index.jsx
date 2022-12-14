/**
 * 多点异色，attribute合一
 * 前三位位置坐标，后四位色值
 * [x,y,z,r,g,b,a]
 */
import {useEffect, useRef, useState} from "react";
import {initShaders, initCanvas} from "../../../../utils";
import VERTEX_SHADER from "@shader/MultipleColor/Vertex.glsl";
import FRAGMENT_SHADER from '@shader/MultipleColor/Fragment.glsl';
import {useInitWebGlContext} from "../../../../hooks";

function MultiColorPoint() {
    let canvasRef = useRef();
    let {setWebGl, draw, webgl: webGl} = useInitWebGlContext(
        {
            data: [
                0, 0.5, 0, 1, 0, 0, 1,
                -0.2, -0.4, 0, 0, 1, 0, 1,
                0.2, -0.4, 0, 0, 0, 1, 1
            ],
            dataIsMulti: true
        }
    );

    useEffect(() => {
        window.onresize = extracted;
        return () => window.onresize = null;
    }, []);

    function extracted() {

        //获取canvas元素并设置宽高
        const canvasNode = canvasRef.current;
        let canvas = initCanvas(canvasNode, 'painter-container');

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
        draw(['TRIANGLES']);
    });

    return <canvas ref={canvasRef}/>
}

export default MultiColorPoint;
