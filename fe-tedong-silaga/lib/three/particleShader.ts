export const vertexShader = /* glsl */`
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uProgress; // 0 to 1 scroll progress
  attribute float aSize;
  attribute float aPhase;
  attribute vec3 aDestination; // Target position in "World" state

  varying float vDist;
  varying float vAlpha;
  varying vec3 vColor;

  // Simplex-style noise functions
  vec3 mod289(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vec3 pos = position;

    // 1. Scene Logic based on uProgress
    // Stage 1-2: 0.0 -> 0.45 (Sphere to Zoom)
    float zoomFactor = smoothstep(0.15, 0.45, uProgress);
    
    // Zoom expansion
    pos *= 1.0 + zoomFactor * 8.0;

    // Transition to World nodes (aDestination)
    float worldFactor = smoothstep(0.40, 0.70, uProgress);
    pos = mix(pos, aDestination, worldFactor);

    // 2. Noise & Animation
    float slowTime = uTime * 0.15;
    float noise = snoise(pos * 0.5 + vec3(slowTime, slowTime * 0.8, slowTime * 1.2));
    pos += noise * 0.15 * (1.0 + worldFactor * 2.0);

    // 3. Mouse Interaction (Attraction/Nudge)
    // Note: Use positive X so moving cursor right attracts the RIGHT side of sphere
    vec3 mouseDir = vec3(uMouse.x * 2.0, uMouse.y * 2.0, 0.0);
    float mouseDist = length(pos - mouseDir);
    float influence = smoothstep(3.0, 0.0, mouseDist);
    pos += normalize(mouseDir - pos) * influence * 0.3 * (1.0 - zoomFactor * 0.8);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    
    // 4. Point Size
    // Particles get larger during zoom
    float sizeZoom = 1.0 + zoomFactor * 1.5;
    gl_PointSize = (aSize * sizeZoom) * (65.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;

    vDist = length(pos);
    
    // 5. Alpha & Flickering
    float flicker = sin(uTime * 1.5 + aPhase * 10.0) * 0.1 + 0.9;
    
    // Sharp particles: fade out if too close or too far
    float edgeFade = smoothstep(40.0, 15.0, length(mvPosition.xyz)) * smoothstep(0.1, 1.5, length(mvPosition.xyz));
    vAlpha = flicker * edgeFade * 0.4;
    
    // Transition color based on worldFactor
    vec3 sphereColor = mix(vec3(0.2, 0.35, 0.9), vec3(0.8, 0.5, 0.05), clamp(vDist * 0.4, 0.0, 1.0));
    vec3 worldColor = vec3(0.35, 0.25, 0.75);
    vColor = mix(sphereColor, worldColor, worldFactor);
  }
`;

export const fragmentShader = /* glsl */`
  varying float vDist;
  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    float r = distance(gl_PointCoord, vec2(0.5));
    if (r > 0.48) discard;

    // ULTRA CRISP DUO-CORE
    float core = 1.0 - smoothstep(0.0, 0.15, r);
    float glow = 1.0 - smoothstep(0.0, 0.5, r);
    float strength = (core * 0.8) + pow(glow, 10.0) * 0.2;

    gl_FragColor = vec4(vColor, strength * vAlpha * 0.5);
  }
`;
