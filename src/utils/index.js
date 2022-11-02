function loadShader(gl, type, source) {
    //根据着色类型，建立着色器对象
    const shader = gl.createShader(type);
    //将着色器源文件传入着色器对象中
    gl.shaderSource(shader, source);
    //编译着色器对象
    gl.compileShader(shader);
    //返回着色器对象
    return shader;
}

function initShaders(gl, vsSource, fsSource) {
    //创建程序对象
    const program = gl.createProgram();
    //建立着色对象
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
    //把顶点着色对象装进程序对象中
    gl.attachShader(program, vertexShader);
    //把片元着色对象装进程序对象中
    gl.attachShader(program, fragmentShader);
    //连接webgl上下文对象和程序对象
    gl.linkProgram(program);

    //debugger程序，查看更多的报错信息
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        let info = gl.getProgramInfoLog(program);
        throw new Error('Could not compile WebGL program. \n\n' + info);
    }

    //启动程序对象
    gl.useProgram(program);
    //将程序对象挂到上下文对象上
    gl.program = program;
    return gl;
}

//鼠标坐标位置转化为webgl坐标系坐标
function getWebGlPositionByMousePosition(event, callback) {
    const {clientX, clientY} = event;
    const {top, left, width, height} = event.target.getBoundingClientRect();
    const [canvasX, canvasY] = [clientX - left, clientY - top];
    const [canvasOriginX, canvasOriginY] = [width / 2, height / 2];
    const [baseCenterX, baseCenterY] = [canvasX - canvasOriginX, canvasY - canvasOriginY];
    //canvas坐标系中Y轴方向和webgl坐标系方向相反，所以需要将y坐标取反
    //webgl坐标系的单位长度是canvas画布的一半长宽，所以需要除以一半长宽进行坐标变换
    if (!!callback) {
        callback({
            x: baseCenterX / canvasOriginX,
            y: -baseCenterY / canvasOriginY
        });
    }
}

/**
 * 构建css与webgl单位长度的比例尺，y=kx+b,点斜式求关系
 * @param minCss css坐标最小值
 * @param minWg  webgl坐标最小值
 * @param maxCss css坐标最大值
 * @param maxWg  webgl坐标最大值
 */
function cssPosition2WebGl(minCss, minWg, maxCss, maxWg) {
    // k = (y1-y1) / (x2-x1);
    const delta = {
        x: maxCss - minCss,
        y: maxWg - minWg,
    }
    const k = delta.y / delta.x;
    const b = (minWg - k * minCss);
    return x => {
        return k * x + b;
    }
}

function initCanvas(canvasNode) {
    let {width, height} = document.getElementsByClassName('site-layout-background')?.[0]?.getBoundingClientRect();
    canvasNode.width = width;
    canvasNode.height = height;
    return canvasNode;
}

//构建长宽等比例尺
function buildLengthWidthEqualScale(canvas) {
    const {width, height} = canvas;
    const widthHeightRatio = width / height;
    const squH = 1.0;
    return squH / widthHeightRatio;
}

export {
    initCanvas,
    initShaders,
    cssPosition2WebGl,
    buildLengthWidthEqualScale,
    getWebGlPositionByMousePosition
};
