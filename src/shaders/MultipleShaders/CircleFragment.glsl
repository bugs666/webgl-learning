//声明浮点值的精度（规定）
precision mediump float;
uniform bool isPoints;
void main() {
    //  计算片元中距中点位置的距离
    if (isPoints){
        float dist = distance(gl_PointCoord, vec2(0.5, 0.5));
        //  距离小于0.5即半径，则绘图，否则放弃本次操作
        if (dist < 0.5) {
            gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
        } else {
            discard;
        }
    } else {
        gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
    }
}
