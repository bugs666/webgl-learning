import {Matrix4, Vector3} from "three";

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
 * 构建线性比例尺，y=kx+b,点斜式求关系
 * k = (y1-y1) / (x2-x1);
 * @param x1 见名知意
 * @param x2 见名知意
 * @param y1 见名知意
 * @param y2 见名知意
 */
function buildLinearScale(x1, x2, y1, y2) {
    const delta = {
        x: y1 - x1,
        y: y2 - x2,
    }
    const k = delta.y / delta.x;
    const b = (x2 - k * x1);
    return x => {
        return k * x + b;
    }
}

function initCanvas(canvasNode, containerName = 'site-layout-background') {
    let {width, height} = document.getElementsByClassName(containerName)?.[0]?.getBoundingClientRect();
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

/**
 * 根据视点坐标，目标点坐标，上方向 构建视图矩阵
 * @param viewPoint   视点坐标
 * @param targetPoint 目标点坐标
 * @param upDirection 上方向
 * https://juejin.cn/post/7067377496722767908
 */
function getViewMatrix(viewPoint, targetPoint, upDirection) {
    //视线方向单位向量
    let sight = new Vector3().subVectors(viewPoint, targetPoint).normalize();
    //根据上方向和视线方向计算视线和上方向平面的法向量
    let normalVector = new Vector3().crossVectors(upDirection, sight).normalize();
    //根据上面求出的两个值计算垂直的上方向
    let newUpDirection = new Vector3().crossVectors(sight, normalVector).normalize();

    const {x: sx, y: sy, z: sz} = sight;
    // 旋转矩阵
    const rotation = new Matrix4().set(
        ...normalVector, 0,
        ...newUpDirection, 0,
        -sx, -sy, -sz, 0,
        0, 0, 0, 1);

    const {x: vx, y: vy, z: vz} = viewPoint;
    // 位移矩阵
    const transition = new Matrix4().set(
        1, 0, 0, -vx,
        0, 1, 0, -vy,
        0, 0, 1, -vz,
        0, 0, 0, 1
    );

    return rotation.multiply(transition).elements;
}

export {
    initCanvas,
    initShaders,
    getViewMatrix,
    buildLinearScale,
    buildLengthWidthEqualScale,
    getWebGlPositionByMousePosition
};
