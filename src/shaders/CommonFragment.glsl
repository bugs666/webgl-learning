//声明浮点值的精度（规定）
precision mediump float;
//初始化片元颜色变量
uniform vec4 a_FragColor;
void main() {
    gl_FragColor = a_FragColor;
}
