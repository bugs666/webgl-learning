//uniform mat4 u_ViewMat;
uniform mat4 u_ModuleMat;
attribute vec4 a_Position;
attribute vec2 a_Pin;
varying vec2 v_Pin;
void main() {
    //    gl_Position = u_ViewMat * u_MoudleMat * a_Position;
    gl_Position = u_ModuleMat * a_Position;
    v_Pin = a_Pin;
}