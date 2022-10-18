/**
 * 补间动画，改变顶点的透明度（星星眨眼）
 */
import {useEffect, useRef, useState} from "react";
import {initShaders, getWebGlPositionByMousePosition, initCanvas} from "../../utils";
import COMMON_VERTEX_SHADER from "../../shaders/CommonShaders/CommonVertex.glsl";
import CIRCLE_FRAGMENT_SHADER from '../../shaders/CircleShader/CircleFragment.glsl';
import {STAR_BASE_COLOR} from "../../constant";
import Compose from "./Compose";
import Track from "./Track";

let compose = new Compose();

function RandomStar() {
    let ref = useRef();
    const webGlRef = useRef();
    const positionRef = useRef();
    const pointSizeRef = useRef();
    const colorRef = useRef();
    const [pointConf, setPointConf] = useState([]);

    const render = () => {
        const gl = webGlRef.current;
        const glPosition = positionRef.current;
        const pointSize = pointSizeRef.current;
        const pointColor = colorRef.current;
        if (!gl) return;
        // 指定将要用来清理绘图区的颜色
        gl.clearColor(0., 0.0, 0.0, 0);
        // // 清理绘图区
        gl.clear(gl.COLOR_BUFFER_BIT);
        pointConf.forEach(({x, y, size, a}) => {
            //js控制点位尺寸
            gl.vertexAttrib1f(pointSize, size);
            gl.vertexAttrib2f(glPosition, x, y);
            gl.uniform4fv(pointColor, [...STAR_BASE_COLOR, a]);
            // 绘制顶点
            gl.drawArrays(gl.POINTS, 0, 1);
        })
    }

    useEffect(() => {
        if (!pointConf.length) return;
        !(function ani() {
            compose.update(new Date())
            render()
            requestAnimationFrame(ani)
        })()
    }, [pointConf]);

    function extracted() {
        if (!ref.current) {
            return;
        }
        //获取canvas元素并设置宽高
        const canvasNode = ref.current;
        let canvas = initCanvas(canvasNode);

        //获取webgl画笔
        return canvas.getContext('webgl');
    }

    useEffect(() => {
        let gl = extracted();
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl = initShaders(gl, COMMON_VERTEX_SHADER, CIRCLE_FRAGMENT_SHADER);
        webGlRef.current = gl;
        // 通过js获取点坐标
        let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
        // 通过js获取获取点尺寸
        let a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
        // 通过js获取片元色值
        const a_FragColor = gl.getUniformLocation(gl.program, 'a_FragColor');
        positionRef.current = a_Position;
        pointSizeRef.current = a_PointSize;
        colorRef.current = a_FragColor;
    }, []);

    const changePositions = position => {
        const conf = {
            //坐标
            ...position,
            //尺寸
            size: Math.random() * 5 + 2,
            //初始透明度
            a: 1
        };
        let track = new Track(conf);
        track.start = new Date();
        track.keyMap = new Map([
            ['a', [
                [500, 1],
                [1000, 0],
                [1500, 1],
            ]]
        ])
        track.timeLen = 2000;
        track.loop = true;
        compose.add(track);
        setPointConf([
            ...pointConf, conf
        ]);
    }

    return <canvas ref={ref} onClick={e => getWebGlPositionByMousePosition(e, changePositions)}/>;
}

export default RandomStar;
