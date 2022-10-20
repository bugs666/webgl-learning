//向量相加，位移
attribute vec4 a_Position;
uniform vec4 transition;
void main() {
    gl_Position = a_Position + transition;
//    gl_Position = a_Position;
}
