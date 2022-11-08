/**
 * 用鼠标控制webgl点位(位置，大小，颜色)
 * 绘制圆形顶点
 */
import {useEffect, useRef} from "react";
import {initShaders, initCanvas} from "../../../../utils";
import vertex from '../../../../shaders/TextureMapShader/Vertex.glsl';
import fragment from '../../../../shaders/TextureMapShader/Fragment.glsl';
import funny from '../../../../assets/funny.jpg';
import {useInitWebGlContext} from "../../../../hooks";

function TextureMap() {
    let canvasRef = useRef();
    const {webgl, setWebGl, draw} = useInitWebGlContext({
        dataIsMulti: true,
        data: [
            -0.5, 0.5, 0.0, 1.0,
            -0.5, -0.5, 0.0, 0.0,
            0.5, 0.5, 1.0, 1.0,
            0.5, -0.5, 1.0, 0.0,
        ],
        attrConf: [
            {attrName: 'a_Position', dataSize: 2},
            {attrName: 'a_Pin', dataSize: 2}
        ]
    });

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
        gl = initShaders(gl, vertex, fragment);
        // 指定将要用来清理绘图区的颜色
        gl.clearColor(0., 0.0, 0.0, 1);
        setWebGl(gl);
    }, []);

    useEffect(() => {
        if (!webgl || !funny) return;
        //纹理单元
        webgl.activeTexture(webgl.TEXTURE0);
        //创建纹理对象
        const texture = webgl.createTexture();
        //把纹理对象装进纹理单元里
        webgl.bindTexture(webgl.TEXTURE_2D, texture);
        const image = new Image();
        image.src = funny;
        image.onload = () => {
            //配置纹理图像
            webgl.texImage2D(webgl.TEXTURE_2D, 0, webgl.RGB, webgl.RGB, webgl.UNSIGNED_BYTE, image);
            //配置纹理参数
            webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.LINEAR);
            const uSampler = webgl.getUniformLocation(webgl.program, 'u_Sampler');
            webgl.uniform1i(uSampler, 0);
            draw(['TRIANGLE_STRIP']);
        };
    }, [webgl]);

    return <canvas ref={canvasRef}/>
}

export default TextureMap;
