/**
 * 用鼠标控制webgl点位(位置，大小，颜色)
 * 绘制圆形顶点
 */
import {useEffect, useRef} from "react";
import {initShaders, initCanvas, buildLengthWidthEqualScale} from "../../../../utils";
import vertex from '@shader/TextureMapShader/Vertex.glsl';
import fragment from '@shader/TextureMapShader/Fragment.glsl';
import funny from '../../../../assets/funny.jpg';
import {useInitWebGlContext} from "../../../../hooks";

function TextureMap() {
    let canvasRef = useRef();
    const {webgl, setWebGl, draw, setData} = useInitWebGlContext({
        dataIsMulti: true,
        attrConf: [
            {attrName: 'a_Position', dataSize: 2},
            {attrName: 'a_Pin', dataSize: 2}
        ]
    });

    useEffect(() => {
        window.onresize = extracted;
        let gl = extracted();
        gl = initShaders(gl, vertex, fragment);
        // 指定将要用来清理绘图区的颜色
        gl.clearColor(0, 0, 0, 1);
        setWebGl(gl);
        return () => window.onresize = null;
    }, []);

    function extracted() {
        //获取canvas元素并设置宽高
        const canvasNode = canvasRef.current;
        let canvas = initCanvas(canvasNode, 'painter-container');
        let scale = buildLengthWidthEqualScale(canvas);
        setData([
            -0.5 * scale, 0.5, 0.0, 1.0,
            -0.5 * scale, -0.5, 0.0, 0.0,
            0.5 * scale, 0.5, 1.0, 1.0,
            0.5 * scale, -0.5, 1.0, 0.0,
        ]);
        //获取webgl画笔
        return canvas.getContext('webgl');
    }

    useEffect(() => {
        if (!webgl || !funny) return;
        //预处理图像，垂直翻转纹理图像（uv坐标系垂直正方向与webgl相反）
        webgl.pixelStorei(webgl.UNPACK_FLIP_Y_WEBGL, 1);
        //激活纹理单元
        webgl.activeTexture(webgl.TEXTURE1);
        //创建纹理对象
        const texture = webgl.createTexture();
        //把纹理对象装进纹理单元里
        webgl.bindTexture(webgl.TEXTURE_2D, texture);
        const image = new Image();
        image.src = funny;
        image.onload = () => {
            // 配置纹理图像
            webgl.texImage2D(webgl.TEXTURE_2D, 0, webgl.RGB, webgl.RGB, webgl.UNSIGNED_BYTE, image);
            //配置纹理参数
            webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.LINEAR);
            //图片大小不是2的次幂时需加下面的配置
            webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_S, webgl.CLAMP_TO_EDGE);
            webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_T, webgl.CLAMP_TO_EDGE);
            const uSampler = webgl.getUniformLocation(webgl.program, 'u_Sampler');
            webgl.uniform1i(uSampler, 1);
            draw(['TRIANGLE_STRIP']);
        };
    }, [webgl]);

    return <canvas ref={canvasRef}/>
}

export default TextureMap;
