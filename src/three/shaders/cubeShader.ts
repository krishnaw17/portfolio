/**
 * GLSL shaders for the floating code cube.
 * The cube faces render scrolling code/circuit patterns with a fresnel rim glow.
 */

export const cubeVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  varying vec3 vWorldPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    vUv = uv;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

export const cubeFragment = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec3 uColorA;   // deep blue
  uniform vec3 uColorB;   // electric cyan
  uniform vec3 uColorRim; // bright rim

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  varying vec3 vWorldPosition;

  // Hash for pseudo-noise
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  // Code line pattern
  float codeLine(vec2 uv, float speed) {
    uv.y *= 22.0;
    float row = floor(uv.y);
    float offset = uTime * speed;
    float col = floor(uv.x * 26.0);
    float r = hash(vec2(row + floor(offset), col));
    float visibility = step(0.55, r);
    float block = step(0.5, fract(uv.y)) * step(0.5, fract(uv.x * 26.0));
    return visibility * block;
  }

  // Circuit grid
  float circuit(vec2 uv) {
    vec2 g = abs(fract(uv * 12.0) - 0.5);
    float line = step(0.46, max(g.x, g.y));
    float pulse = smoothstep(0.0, 1.0, sin(uTime * 2.0 - uv.x * 6.0 - uv.y * 6.0) * 0.5 + 0.5);
    return line * 0.6 + pulse * 0.3 * line;
  }

  void main() {
    // Project onto a 2D plane in local space (cube face)
    vec2 uv = vUv;
    vec3 n = normalize(vNormal);

    // Pattern mix
    float c1 = codeLine(uv + vec2(0.0, uTime * 0.04), 1.0);
    float c2 = codeLine(uv * 0.5 + vec2(0.05, -uTime * 0.02), 0.6);
    float grid = circuit(uv);

    vec3 base = mix(uColorA, uColorB, uv.x * 0.5 + 0.5);
    vec3 col = base * 0.15;
    col += uColorB * c1 * 0.9;
    col += uColorA * c2 * 0.4;
    col += mix(uColorA, uColorB, 0.5) * grid * 0.6;

    // Fresnel rim
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    float fres = pow(1.0 - max(dot(n, viewDir), 0.0), 2.4);
    col += uColorRim * fres * 1.4;

    // Subtle edge highlight from UV
    float edge = smoothstep(0.0, 0.04, uv.x) * smoothstep(1.0, 0.96, uv.x) *
                 smoothstep(0.0, 0.04, uv.y) * smoothstep(1.0, 0.96, uv.y);
    col += (1.0 - edge) * uColorRim * 0.5;

    // Slight vignette
    col *= smoothstep(0.0, 0.6, length(uv - 0.5));

    gl_FragColor = vec4(col, 1.0);
  }
`;

export const particlesVertex = /* glsl */ `
  uniform float uTime;
  uniform float uSize;

  attribute float aRandom;

  varying float vAlpha;

  void main() {
    vec3 p = position;
    p.y += sin(uTime * 0.4 + aRandom * 6.28) * 0.2;
    p.x += cos(uTime * 0.3 + aRandom * 6.28) * 0.2;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = uSize * (1.0 / -mv.z) * (0.6 + aRandom * 0.6);
    vAlpha = 0.4 + 0.6 * aRandom;
    gl_Position = projectionMatrix * mv;
  }
`;

export const particlesFragment = /* glsl */ `
  uniform vec3 uColor;

  varying float vAlpha;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(uColor, a * vAlpha);
  }
`;
