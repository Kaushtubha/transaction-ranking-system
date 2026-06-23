import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Sphere, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { MathUtils } from 'three';

function GradientMesh() {
  const meshRef = useRef();
  const materialRef = useRef();

  // Custom vertex shader to deform the sphere over time
  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vPosition;
    uniform float uTime;

    // Simplex noise function
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    float snoise(vec3 v) {
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 = v - i + dot(i, C.xxx) ;
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
      vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y
      i = mod289(i);
      vec4 p = permute( permute( permute(
                 i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
               + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
               + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
      float n_ = 0.142857142857; // 1.0/7.0
      vec3  ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                    dot(p2,x2), dot(p3,x3) ) );
    }

    void main() {
      vUv = uv;
      vPosition = position;
      
      // Calculate noise based displacement
      float noise = snoise(vec3(position.x * 1.5, position.y * 1.5, position.z * 1.5 + uTime * 0.2));
      vec3 newPosition = position + normal * noise * 0.3;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `;

  // Custom fragment shader for colors
  const fragmentShader = `
    varying vec2 vUv;
    varying vec3 vPosition;
    uniform float uTime;
    
    void main() {
      vec3 color1 = vec3(0.015, 0.027, 0.06); // Deep space blue/black
      vec3 color2 = vec3(0.36, 0.25, 0.76); // Deep indigo
      vec3 color3 = vec3(0.65, 0.84, 0.94); // Soft cyan
      
      float mixValue1 = sin(vUv.x * 3.14 + uTime * 0.5) * 0.5 + 0.5;
      float mixValue2 = cos(vUv.y * 3.14 - uTime * 0.3) * 0.5 + 0.5;
      
      vec3 finalColor = mix(color1, mix(color2, color3, mixValue2), mixValue1);
      
      // Add subtle glow
      float intensity = pow(1.0 - max(dot(vPosition, vec3(0.0, 0.0, 1.0)), 0.0), 3.0);
      finalColor = mix(finalColor, vec3(1.0), intensity * 0.1);
      
      gl_FragColor = vec4(finalColor, 0.8);
    }
  `;

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    []
  );

  useFrame((state) => {
    const { clock, pointer } = state;
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
    if (meshRef.current) {
      // Parallax effect
      meshRef.current.rotation.x = MathUtils.lerp(meshRef.current.rotation.x, (pointer.y * Math.PI) / 10, 0.05);
      meshRef.current.rotation.y = MathUtils.lerp(meshRef.current.rotation.y, (pointer.x * Math.PI) / 10, 0.05);
    }
  });

  return (
    <Sphere args={[2, 128, 128]} ref={meshRef} position={[2, 0, -2]} scale={1.5}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        wireframe={false}
        transparent={true}
      />
    </Sphere>
  );
}

function ParticleField() {
  const count = 1500;
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 20; // x
      p[i * 3 + 1] = (Math.random() - 0.5) * 20; // y
      p[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5; // z
    }
    return p;
  }, [count]);

  const pointsRef = useRef();

  useFrame((state) => {
    const { clock, pointer } = state;
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.02;
      pointsRef.current.position.x = MathUtils.lerp(pointsRef.current.position.x, pointer.x * -1, 0.05);
      pointsRef.current.position.y = MathUtils.lerp(pointsRef.current.position.y, pointer.y * -1, 0.05);
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#A8D8F0"
        size={0.03}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  );
}

export function R3FBackground() {
  return (
    <div className="fixed inset-0 z-[-10] bg-[#050505]">
      {/* Noise Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none mix-blend-overlay opacity-30" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
      
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <Environment preset="night" />
        <GradientMesh />
        <ParticleField />
      </Canvas>
    </div>
  );
}
