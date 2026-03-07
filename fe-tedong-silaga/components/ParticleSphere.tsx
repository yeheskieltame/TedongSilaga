"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { vertexShader, fragmentShader } from "@/lib/three/particleShader";
import { useSpring, useMotionValueEvent, MotionValue } from "framer-motion";

// ─── Helper: Generate Particles with Start (Sphere) and End (World) positions ───
function generateParticles(count: number) {
  const positions = new Float32Array(count * 3);
  const destinations = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const phases = new Float32Array(count);

  const goldenRatio = (1 + Math.sqrt(5)) / 2;

  for (let i = 0; i < count; i++) {
    // Stage 1: Sphere Initial positions
    const theta = Math.acos(1 - (2 * (i + 0.5)) / count);
    const phi = 2 * Math.PI * i * (1 / goldenRatio);
    const r = 2.0 + (Math.random() - 0.5) * 0.4;

    positions[i * 3 + 0] = r * Math.sin(theta) * Math.cos(phi);
    positions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
    positions[i * 3 + 2] = r * Math.cos(theta);

    // Stage 3-4: World Destination positions (Wide Volume)
    destinations[i * 3 + 0] = (Math.random() - 0.5) * 35.0;
    destinations[i * 3 + 1] = (Math.random() - 0.5) * 20.0;
    destinations[i * 3 + 2] = (Math.random() - 0.5) * 30.0 - 10.0;

    sizes[i] = 0.8 + Math.random() * 2.5;
    phases[i] = Math.random() * Math.PI * 2;
  }

  return { positions, destinations, sizes, phases };
}

interface SceneProps {
  progress: number;
}

function Scene({ progress }: SceneProps) {
  const meshRef = useRef<THREE.Points>(null!);
  const matRef = useRef<THREE.ShaderMaterial>(null!);
  const mouse = useRef<[number, number]>([0, 0]);

  const count = 14000;
  const { positions, destinations, sizes, phases } = useMemo(() => generateParticles(count), []);

  const uniforms = useMemo(() => ({
    uTime:     { value: 0 },
    uMouse:    { value: new THREE.Vector2(0, 0) },
    uProgress: { value: 0 },
  }), []);

  // Update mouse ref on movement
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouse.current = [
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1,
      ];
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  function smoothstep(min: number, max: number, value: number) {
    const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
    return x * x * (3 - 2 * x);
  }

  useFrame((state) => {
    const { clock, camera } = state;
    if (!matRef.current) return;

    // 1. Uniforms
    matRef.current.uniforms.uTime.value = clock.getElapsedTime();
    matRef.current.uniforms.uProgress.value = progress;

    // Smoothed mouse
    const targetX = matRef.current.uniforms.uMouse.value.x + (mouse.current[0] - matRef.current.uniforms.uMouse.value.x) * 0.05;
    const targetY = matRef.current.uniforms.uMouse.value.y + (mouse.current[1] - matRef.current.uniforms.uMouse.value.y) * 0.05;
    matRef.current.uniforms.uMouse.value.set(targetX, targetY);

    // 2. Camera Animation based on Progress
    // Zoom in significantly during stage 2
    const camZ = THREE.MathUtils.lerp(8.0, 0.4, THREE.MathUtils.smoothstep(progress, 0.15, 0.55));
    camera.position.z = camZ;
    camera.lookAt(0, -0.6 * (1.0 - smoothstep(0.4, 0.7, progress)), 0);

    // 3. Rotation logic
    if (meshRef.current) {
      meshRef.current.position.y = -0.6 * (1.0 - smoothstep(0.4, 0.7, progress));
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.04;
      meshRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.2) * 0.08;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aDestination" args={[destinations, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  );
}

export default function ParticleSphere({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 25,
    restDelta: 0.001
  });

  const [value, setValue] = useState(0);
  
  useMotionValueEvent(smoothProgress, "change", (latest) => {
    setValue(latest);
  });

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none" }}>
      <Canvas
        camera={{ fov: 45, position: [0, 0, 8] }}
        gl={{ 
            antialias: false, 
            alpha: true,
            powerPreference: "high-performance"
        }}
        dpr={[1, 1.5]}
      >
        <Scene progress={value} />
      </Canvas>
    </div>
  );
}
