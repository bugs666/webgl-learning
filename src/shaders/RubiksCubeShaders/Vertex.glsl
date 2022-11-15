//视图矩阵：相机的正交投影矩阵和相机世界的逆矩阵相乘
uniform mat4 u_pvMatrix;
uniform mat4 u_ModuleMat;
attribute vec4 a_Position;
attribute vec2 a_Pin;
varying vec2 v_Pin;
void main() {
    gl_Position = u_pvMatrix * u_ModuleMat * a_Position;
    v_Pin = a_Pin;
}
