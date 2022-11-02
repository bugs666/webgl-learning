attribute vec4 a_Position;
//视图矩阵
uniform mat4 u_ViewMat;
//模型矩阵
uniform mat4 u_ModuleMat;

void main() {
    gl_Position = u_ViewMat * u_ModuleMat * a_Position;
}
