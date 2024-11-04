precision mediump float;

varying vec3 vNormal;
uniform float uColorMode; // 0.0 for color, 1.0 for grayscale

void main() {
    vec3 color = vNormal * 0.5 + 0.5;
    
    if (uColorMode > 0.5) {
        // Grayscale mode
        float grayscale = dot(color, vec3(0.333, 0.333, 0.333));
        color = vec3(grayscale);
    }

    gl_FragColor = vec4(color, 1.0);
}
