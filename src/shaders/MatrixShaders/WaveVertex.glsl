attribute vec4 a_Position;
uniform mat4 u_ViewMat;
void main() {
    gl_Position = u_ViewMat * a_Position;
    gl_PointSize = 3.0;
}
