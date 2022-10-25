attribute vec4 a_Position;
//二维矩阵对象
//uniform mat2 u_mat;
//四维矩阵对象
uniform mat4 u_mat;
void main() {
    /*
        二维向量旋转公式
         [
          cosB,  sinB,
          -sinB, cosB *  [ax,ay] = [ax*cosB-ay*sinb,ax*sinB+ay*cosB]
         ]
    */
    //    gl_Position = vec4(u_mat * vec2(a_Position), a_Position.z, a_Position.w);
    gl_Position = u_mat * a_Position;
}

