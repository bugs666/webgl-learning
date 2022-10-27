attribute vec4 a_Position;
uniform float scale;
void main() {
    gl_Position = vec4(vec3(a_Position) * scale, 1.0);
}
