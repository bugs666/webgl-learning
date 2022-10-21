attribute vec4 a_Position;
uniform float angle;
float sinB = sin(angle);
float cosB = cos(angle);
void main() {
    gl_Position.x = a_Position.x * cosB - a_Position.y * sinB;
    gl_Position.y = a_Position.y * cosB + a_Position.x * sinB;
    gl_Position.z = a_Position.z;
    gl_Position.w = 1.0;
}
