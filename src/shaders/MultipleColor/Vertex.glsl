attribute vec4 a_Position;
attribute vec4 a_Color;

//提取为全局变量， 以便在片元着色器中取到该变量
varying vec4 v_Color;

void main() {
    gl_Position = a_Position;
    gl_PointSize = 20.0;
    v_Color = a_Color;
}
