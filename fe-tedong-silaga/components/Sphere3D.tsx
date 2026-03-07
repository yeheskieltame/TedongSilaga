"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function InteractivePoints() {
  const pointsRef = useRef<THREE.Points>(null);

  // 1. Animation & Interaction Logic (Refactored to stop free-spin)
  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    // Use normalized pointer coordinates (-1 to 1)
    const { x, y } = state.pointer;

    // 2. Controlled, restricted parallax (No free spinning)
    // We constrain the rotation to a small dampening factor (e.g., 0.3 rad max)
    // This creates a subtle tilt that follows the mouse comfortably.
    const targetRotationY = x * 0.3;
    const targetRotationX = -y * 0.3;

    // Use THREE.MathUtils.lerp to prevent rigid snapping
    // We lerp the current rotation towards the target absolute rotation.
    // Speed factor of delta * 4 provides a smooth, fluid feeling.
    pointsRef.current.rotation.y = THREE.MathUtils.lerp(
      pointsRef.current.rotation.y,
      targetRotationY,
      delta * 4
    );
    pointsRef.current.rotation.x = THREE.MathUtils.lerp(
      pointsRef.current.rotation.x,
      targetRotationX,
      delta * 4
    );
  });

  return (
    <points ref={pointsRef}>
      {/* High segment sphere for smooth particle shell */}
      <sphereGeometry args={[2.5, 64, 64]} />
      <pointsMaterial
        size={0.015}
        color="#60a5fa"
        transparent={true}
        opacity={0.6}
        sizeAttenuation={true}
      />
    </points>
  );
}

export default function Sphere3D() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
      >
        {/* The Interactive Particle Sphere */}
        <InteractivePoints />
      </Canvas>
    </div>
  );
}
