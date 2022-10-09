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

export function initShaders(gl, vsSource, fsSource) {
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
    //启动程序对象
    gl.useProgram(program);
    //将程序对象挂到上下文对象上
    gl.program = program;
    return gl;
}

export function getWebGlPositionByMousePosition(event, callback) {
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
