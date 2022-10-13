//声明浮点值的精度（规定）
precision mediump float;
//初始化片元颜色变量
uniform vec4 a_FragColor;

void main() {
    //  计算片元中距中点位置的距离
    float dist = distance(gl_PointCoord, vec2(0.5, 0.5));
    //  距离小于0.5即半径，则绘图，否则放弃本次操作
    if (dist < 0.5) {
        gl_FragColor = a_FragColor;
    } else {
        discard;
    }
}
