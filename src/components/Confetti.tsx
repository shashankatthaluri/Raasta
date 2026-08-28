"use client";

import { useEffect, useRef } from "react";

interface ConfettiProps {
  active: boolean;
  duration?: number;
}

export function Confetti({ active, duration = 4500 }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ["#F59E0B", "#10B981", "#3B82F6", "#EC4899", "#8B5CF6", "#F97316", "#059669"];
    const particleCount = 140;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: window.innerWidth / 2 + (Math.random() - 0.5) * 260,
      y: window.innerHeight * 0.45 + (Math.random() - 0.5) * 120,
      vx: (Math.random() - 0.5) * 18,
      vy: (Math.random() - 1.6) * 16,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
      opacity: 1,
      shape: Math.random() > 0.4 ? "rect" : "circle",
    }));

    let animationFrame: number;
    const startTime = Date.now();

    function render() {
      if (!ctx || !canvas) return;
      const elapsed = Date.now() - startTime;
      if (elapsed > duration) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.38;
        p.vx *= 0.98;
        p.rotation += p.rotationSpeed;
        p.opacity = Math.max(0, 1 - elapsed / duration);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      animationFrame = requestAnimationFrame(render);
    }

    render();

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", handleResize);
      if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [active, duration]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50 h-full w-full"
    />
  );
}
