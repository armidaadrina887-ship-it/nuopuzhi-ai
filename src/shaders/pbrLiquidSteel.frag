precision highp float;

varying vec2 vUv;
uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;
uniform float uBrushSize;
uniform float uFluidDecay;
uniform float uTrailLength;
uniform float uStopDecay;

#define NUM_FBM_OCTAVES 4
#define NUM_REFLECTION_SAMPLES 4

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float valueNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  vec2 shift = vec2(100.0);
  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
  for (int i = 0; i < NUM_FBM_OCTAVES; i++) {
    v += a * valueNoise(p);
    p = rot * p * 2.0 + shift;
    a *= 0.5;
  }
  return v;
}

float advectionNoise(vec2 p, float t) {
  float v1 = fbm(p + t * 0.04);
  float v2 = fbm(p * 1.5 - t * 0.03 + v1 * 0.8);
  float v3 = fbm(p * 2.0 + t * 0.05 + v2 * 0.5);
  return v1 * 0.5 + v2 * 0.3 + v3 * 0.2;
}

float anisotropicK(vec2 hGrad, vec2 aDir) {
  float roughnessX = 0.95;
  float roughnessY = 0.05;
  vec3 h = normalize(vec3(-hGrad.x, 1.0, -hGrad.y));
  vec2 tangent = normalize(aDir);
  vec2 bitangent = vec2(-tangent.y, tangent.x);
  float hx = dot(h.xz, tangent);
  float hy = dot(h.xz, bitangent);
  float hz = h.y;
  float cosPhi2 = hx * hx;
  float sinPhi2 = hy * hy;
  float tanTheta2 = (cosPhi2 + sinPhi2) / max(hz * hz, 0.0001);
  float cos2 = cosPhi2 / max(roughnessX * roughnessX, 0.0001);
  float sin2 = sinPhi2 / max(roughnessY * roughnessY, 0.0001);
  return exp(-tanTheta2 * (cos2 + sin2)) / max(4.0 * 3.14159 * roughnessX * roughnessY * hz * hz * hz * hz, 0.0001);
}

void main() {
  vec2 uv = (vUv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);
  vec2 mouseOffset = (uMouse - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);
  float dist = length(uv - mouseOffset);
  float mouseInteraction = exp(-dist * dist * 6.0) * 0.6;
  float t = uTime * 0.4;

  float n1 = advectionNoise(uv * 3.0, t);
  float n2 = advectionNoise(uv * 5.0 + 100.0, t * 1.2);
  float n3 = advectionNoise(uv * 8.0 + 50.0, t * 0.8);

  float heightField = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;
  float e = 0.001;
  vec2 hGrad = vec2(
    (advectionNoise((uv + vec2(e, 0.0)) * 3.0, t) * 0.5 + advectionNoise((uv + vec2(e, 0.0)) * 5.0 + 100.0, t * 1.2) * 0.3 + advectionNoise((uv + vec2(e, 0.0)) * 8.0 + 50.0, t * 0.8) * 0.2 - heightField) / e,
    (advectionNoise((uv + vec2(0.0, e)) * 3.0, t) * 0.5 + advectionNoise((uv + vec2(0.0, e)) * 5.0 + 100.0, t * 1.2) * 0.3 + advectionNoise((uv + vec2(0.0, e)) * 8.0 + 50.0, t * 0.8) * 0.2 - heightField) / e
  );

  vec2 anisotropyDir = vec2(n2 * 2.0 - 1.0, n3 * 2.0 - 1.0);
  anisotropyDir += mouseInteraction * (uv - mouseOffset) * 2.0;
  anisotropyDir = normalize(anisotropyDir);

  float ripples = sin(dist * 25.0 - t * 4.0) * mouseInteraction;
  float ringWave = sin(atan(uv.y - mouseOffset.y, uv.x - mouseOffset.x) * 8.0 + t * 2.0) * mouseInteraction * 0.2;
  heightField += ripples + ringWave;
  hGrad += mouseInteraction * (uv - mouseOffset) * 8.0;

  float specular = 0.0;
  vec3 viewDir = vec3(0.0, 1.0, 0.6);
  viewDir = normalize(viewDir);
  for (int i = 0; i < NUM_REFLECTION_SAMPLES; i++) {
    float angle = float(i) * 6.28318 / float(NUM_REFLECTION_SAMPLES);
    vec2 sampleDir = vec2(cos(angle), sin(angle)) * 0.5;
    vec2 lhGrad = hGrad + vec2(
      advectionNoise((uv + sampleDir) * 6.0 + float(i) * 20.0, t * 0.5) * 0.4,
      advectionNoise((uv + sampleDir.yx) * 6.0 + float(i) * 30.0, t * 0.5) * 0.4
    );
    specular += anisotropicK(lhGrad, anisotropyDir);
  }
  specular /= float(NUM_REFLECTION_SAMPLES);
  specular = pow(clamp(specular, 0.0, 1.0), 2.0) * 2.0;

  float fresnel = pow(1.0 - abs(dot(normalize(vec3(-hGrad.x, 1.0, -hGrad.y)), viewDir)), 4.0);
  // Updated to blue highlight color
  vec3 highlightCol = vec3(0.0, 0.66, 1.0);
  vec3 col = specular * highlightCol * 1.5 + highlightCol * fresnel * specular * 0.5;
  // Updated to deep blue background
  vec3 background = vec3(0.04, 0.08, 0.15);

  gl_FragColor = vec4(background + col, 1.0);
}
