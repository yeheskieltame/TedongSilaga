"use client";

import { useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface GlobeMarker {
  lat: number; // -90 to 90
  lng: number; // -180 to 180
  label?: string;
}

interface GlobeArc {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
}

interface GlobeProps {
  size?: number;
  dotColor?: string;
  arcColor?: string;
  markerColor?: string;
  autoRotateSpeed?: number;
  dotRadius?: number;
  className?: string;
  markers?: GlobeMarker[];
  arcs?: GlobeArc[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Convert lat/lng to 3D unit sphere coordinates (THREE-style: Y-up) */
function latLngToVec3(lat: number, lng: number): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return [
    -(Math.sin(phi) * Math.cos(theta)),
    Math.cos(phi),
    Math.sin(phi) * Math.sin(theta),
  ];
}

/** Project a 3D point onto 2D canvas given rotation angles */
function project(
  x: number,
  y: number,
  z: number,
  rotX: number,
  rotY: number,
  cx: number,
  cy: number,
  radius: number
): { sx: number; sy: number; depth: number } {
  // Rotate around Y axis (longitude rotation)
  const cosY = Math.cos(rotY);
  const sinY = Math.sin(rotY);
  const x1 = x * cosY + z * sinY;
  const z1 = -x * sinY + z * cosY;

  // Rotate around X axis (tilt)
  const cosX = Math.cos(rotX);
  const sinX = Math.sin(rotX);
  const y1 = y * cosX - z1 * sinX;
  const z2 = y * sinX + z1 * cosX;

  // Simple perspective projection
  const fov = 2.2;
  const scale = radius / fov;
  const sx = cx + x1 * scale;
  const sy = cy - y1 * scale;

  return { sx, sy, depth: z2 };
}

// ─── Default Data ─────────────────────────────────────────────────────────────

const DEFAULT_MARKERS: GlobeMarker[] = [
  { lat: 40.7128, lng: -74.006 },   // New York
  { lat: 51.5074, lng: -0.1278 },   // London
  { lat: 35.6762, lng: 139.6503 },  // Tokyo
  { lat: 1.3521, lng: 103.8198 },   // Singapore
  { lat: 48.8566, lng: 2.3522 },    // Paris
  { lat: -23.5505, lng: -46.6333 }, // São Paulo
  { lat: 37.7749, lng: -122.4194 }, // San Francisco
  { lat: 55.7558, lng: 37.6173 },   // Moscow
  { lat: 31.2304, lng: 121.4737 },  // Shanghai
  { lat: -33.8688, lng: 151.2093 }, // Sydney
  { lat: 52.52, lng: 13.405 },      // Berlin
  { lat: 25.2048, lng: 55.2708 },   // Dubai
];

const DEFAULT_ARCS: GlobeArc[] = [
  { startLat: 40.7128, startLng: -74.006, endLat: 51.5074, endLng: -0.1278 },
  { startLat: 40.7128, startLng: -74.006, endLat: 48.8566, endLng: 2.3522 },
  { startLat: 51.5074, startLng: -0.1278, endLat: 35.6762, endLng: 139.6503 },
  { startLat: 37.7749, startLng: -122.4194, endLat: 1.3521, endLng: 103.8198 },
  { startLat: 1.3521, startLng: 103.8198, endLat: 35.6762, endLng: 139.6503 },
  { startLat: 48.8566, startLng: 2.3522, endLat: 55.7558, endLng: 37.6173 },
  { startLat: 31.2304, startLng: 121.4737, endLat: -33.8688, endLng: 151.2093 },
  { startLat: 37.7749, startLng: -122.4194, endLat: 40.7128, endLng: -74.006 },
  { startLat: 25.2048, startLng: 55.2708, endLat: 1.3521, endLng: 103.8198 },
  { startLat: 52.52, startLng: 13.405, endLat: 51.5074, endLng: -0.1278 },
];

// Precompute dot positions (lat/lng grid on sphere surface)
function buildDotGrid(density: number = 200): Array<[number, number, number]> {
  const dots: Array<[number, number, number]> = [];
  // We use a Fibonacci / Fibonacci sphere-like approach for even distribution
  const goldenRatio = (1 + Math.sqrt(5)) / 2;
  for (let i = 0; i < density; i++) {
    const theta = (2 * Math.PI * i) / goldenRatio;
    const phi = Math.acos(1 - (2 * (i + 0.5)) / density);
    const x = Math.sin(phi) * Math.cos(theta);
    const y = Math.cos(phi);
    const z = Math.sin(phi) * Math.sin(theta);
    dots.push([x, y, z]);
  }
  return dots;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function InteractiveGlobe({
  size = 600,
  dotColor = "rgba(59, 130, 246, ALPHA)",
  arcColor = "rgba(96, 165, 250, 0.4)",
  markerColor = "rgba(255, 255, 255, 1)",
  autoRotateSpeed = 0.001,
  dotRadius = 1.8,
  className,
  markers = DEFAULT_MARKERS,
  arcs = DEFAULT_ARCS,
}: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    rotY: -0.3,
    rotX: 0.15,
    targetRotY: -0.3,
    targetRotX: 0.15,
    isDragging: false,
    lastX: 0,
    lastY: 0,
    dotGrid: buildDotGrid(480),
    arcProgress: arcs.map(() => 0),
    animFrame: 0,
  });

  // Use a ref for the draw fn so the rAF loop can call it without
  // triggering "accessed before declaration" (no circular closure).
  const drawRef = useRef<() => void>(() => {});

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const s = stateRef.current;
    const dpr = window.devicePixelRatio || 1;
    const W = size;
    const H = size;
    const cx = W / 2;
    const cy = H / 2;
    const R = W * 0.44; // radius in canvas units

    ctx.clearRect(0, 0, W * dpr, H * dpr);

    // ── Draw atmosphere glow ──────────────────────────────────────────
    const gradient = ctx.createRadialGradient(cx, cy, R * 0.7, cx, cy, R * 1.15);
    gradient.addColorStop(0, "rgba(59,130,246,0.04)");
    gradient.addColorStop(0.6, "rgba(59,130,246,0.02)");
    gradient.addColorStop(1, "transparent");
    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.15, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // ── Clip to sphere ─────────────────────────────────────────────────
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.clip();

    // ── Draw dots ─────────────────────────────────────────────────────
    for (const [dx, dy, dz] of s.dotGrid) {
      const { sx, sy, depth } = project(dx, dy, dz, s.rotX, s.rotY, cx, cy, R);

      // Only render dots on the visible hemisphere (depth > -0.1 for slight overlap)
      if (depth < -0.08) continue;

      // Fade dots near the edge for a 3D "limb darkening" effect
      const distFromCenter = Math.sqrt((sx - cx) ** 2 + (sy - cy) ** 2) / R;
      const limbFade = 1 - Math.pow(distFromCenter, 2.5) * 0.7;
      const depthFade = (depth + 1) * 0.5; // 0 (back) → 1 (front)
      const alpha = Math.max(0, Math.min(1, depthFade * limbFade * 0.55));

      const colorWithAlpha = dotColor.replace("ALPHA", alpha.toFixed(3));

      ctx.beginPath();
      ctx.arc(sx, sy, dotRadius, 0, Math.PI * 2);
      ctx.fillStyle = colorWithAlpha.includes("ALPHA")
        ? `rgba(59,130,246,${alpha.toFixed(3)})`
        : colorWithAlpha;
      ctx.fill();
    }

    ctx.restore();

    // ── Draw arcs (great circle paths) ───────────────────────────────
    arcs.forEach((arc, idx) => {
      const progress = s.arcProgress[idx];
      if (progress <= 0) return;

      const [x1, y1, z1] = latLngToVec3(arc.startLat, arc.startLng);
      const [x2, y2, z2] = latLngToVec3(arc.endLat, arc.endLng);

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.beginPath();

      const steps = 60;
      let started = false;
      for (let t = 0; t <= steps * progress; t++) {
        const tt = t / steps;
        // Spherical linear interpolation (slerp approximation via normalize lerp)
        const bx = x1 + (x2 - x1) * tt;
        const by = y1 + (y2 - y1) * tt;
        const bz = z1 + (z2 - z1) * tt;
        const L = Math.sqrt(bx * bx + by * by + bz * bz);
        // Add slight arc height
        const arcHeight = 1.15;
        const nx = (bx / L) * arcHeight;
        const ny = (by / L) * arcHeight;
        const nz = (bz / L) * arcHeight;

        const { sx, sy, depth } = project(nx, ny, nz, s.rotX, s.rotY, cx, cy, R);

        if (depth >= -0.15) {
          if (!started) { ctx.moveTo(sx, sy); started = true; }
          else ctx.lineTo(sx, sy);
        } else {
          started = false;
        }
      }

      ctx.strokeStyle = arcColor;
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.restore();
    });

    // ── Draw markers ─────────────────────────────────────────────────
    markers.forEach((marker) => {
      const [mx, my, mz] = latLngToVec3(marker.lat, marker.lng);
      const { sx, sy, depth } = project(mx, my, mz, s.rotX, s.rotY, cx, cy, R);

      if (depth < 0) return; // hide markers on back of globe

      ctx.save();
      ctx.scale(dpr, dpr);

      // Outer ring pulse
      ctx.beginPath();
      ctx.arc(sx, sy, 5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(96,165,250,0.15)";
      ctx.fill();

      // Inner dot
      ctx.beginPath();
      ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = markerColor;
      ctx.fill();

      ctx.restore();
    });

    // ── Advance arc progress ─────────────────────────────────────────
    s.arcProgress = s.arcProgress.map((p) => Math.min(1, p + 0.004));

    // ── Auto-rotation ────────────────────────────────────────────────
    if (!s.isDragging) {
      s.rotY += autoRotateSpeed;
    }

    // ── Lerp towards target (from mouse drag) ────────────────────────
    s.rotX += (s.targetRotX - s.rotX) * 0.08;
    s.rotY += (s.targetRotY - s.rotY) * 0.08;

    s.animFrame = requestAnimationFrame(() => drawRef.current());
  }, [size, dotColor, arcColor, markerColor, autoRotateSpeed, dotRadius, markers, arcs]);

  // Keep drawRef in sync with the latest draw closure (must be inside effect, not render)
  useEffect(() => {
    drawRef.current = draw;
  }, [draw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    const s = stateRef.current;

    // Mouse / Touch drag handlers
    const onPointerDown = (e: PointerEvent) => {
      s.isDragging = true;
      s.lastX = e.clientX;
      s.lastY = e.clientY;
      canvas.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!s.isDragging) return;
      const dx = e.clientX - s.lastX;
      const dy = e.clientY - s.lastY;
      s.targetRotY += dx * 0.005;
      s.targetRotX += dy * 0.005;
      // Clamp tilt
      s.targetRotX = Math.max(-0.5, Math.min(0.5, s.targetRotX));
      s.lastX = e.clientX;
      s.lastY = e.clientY;
    };

    const onPointerUp = () => {
      s.isDragging = false;
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);

    s.animFrame = requestAnimationFrame(() => drawRef.current());

    return () => {
      cancelAnimationFrame(s.animFrame);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
    };
  }, [draw, size]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("cursor-grab active:cursor-grabbing select-none", className)}
      style={{ touchAction: "none" }}
      aria-label="Interactive globe"
    />
  );
}
