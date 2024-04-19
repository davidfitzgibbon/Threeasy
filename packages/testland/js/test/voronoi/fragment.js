export default /* glsl */ `uniform float amount;
uniform sampler2D tDiffuse;
varying vec2 vUv;

float random (vec2 st, float seed) {
  const float a = 12.9898;
  const float b = 78.233;
  const float c = 43758.543123;
  return fract(sin(dot(st, vec2(a, b)) + seed) * c );
}

void main() {
  vec4 color = texture2D( tDiffuse, vUv );
  vec3 colorFlip = 1.0 - color.rgb;

	gl_FragColor = vec4( colorFlip, 1);
}`;
