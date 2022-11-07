attribute vec4 a_Position;
attribute vec4 a_Color;
varying vec4 v_Color;
uniform mat4 u_ViewMat;
void main() {
    gl_Position = u_ViewMat * a_Position;
    gl_PointSize = 3.0;
    v_Color = a_Color;
}
