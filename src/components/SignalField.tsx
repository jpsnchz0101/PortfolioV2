import React, { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  drift: number;
  depth: number;
}

/**
 * The constellation background, rebuilt around scrolling.
 * Nodes link up when the page is still and stretch into motion streaks as it moves.
 */
export const SignalField: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 0;
    let height = 0;
    let nodes: Node[] = [];
    let raf = 0;
    let lastScroll = window.scrollY;
    let velocity = 0;

    const nodeColor = () =>
      getComputedStyle(document.documentElement).getPropertyValue('--node-rgb').trim();
    let rgb = nodeColor();

    const themeObserver = new MutationObserver(() => {
      rgb = nodeColor();
      if (reduced) draw();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(70, Math.round((width * height) / 22000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        drift: (Math.random() - 0.5) * 0.12,
        depth: 0.35 + Math.random() * 0.65,
      }));
    };

    function draw() {
      ctx!.clearRect(0, 0, width, height);
      const speed = Math.abs(velocity);
      const linkAlpha = Math.max(0, 0.16 - speed * 0.006);

      if (linkAlpha > 0) {
        ctx!.lineWidth = 1;
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const dist = dx * dx + dy * dy;
            if (dist < 15000) {
              ctx!.strokeStyle = `rgba(${rgb}, ${linkAlpha * (1 - dist / 15000)})`;
              ctx!.beginPath();
              ctx!.moveTo(nodes[i].x, nodes[i].y);
              ctx!.lineTo(nodes[j].x, nodes[j].y);
              ctx!.stroke();
            }
          }
        }
      }

      for (const node of nodes) {
        const streak = velocity * 2.4 * node.depth;
        ctx!.strokeStyle = `rgba(${rgb}, ${0.22 + node.depth * 0.4})`;
        ctx!.lineWidth = 1 + node.depth;
        ctx!.lineCap = 'round';
        ctx!.beginPath();
        ctx!.moveTo(node.x, node.y);
        ctx!.lineTo(node.x, node.y + streak + 0.1);
        ctx!.stroke();
      }
    }

    const frame = () => {
      const scrollY = window.scrollY;
      const delta = scrollY - lastScroll;
      lastScroll = scrollY;
      velocity += (Math.max(-60, Math.min(60, delta)) - velocity) * 0.14;

      for (const node of nodes) {
        node.y -= velocity * node.depth * 0.9;
        node.x += node.drift;
        if (node.y < -80) node.y = height + 80;
        if (node.y > height + 80) node.y = -80;
        if (node.x < 0) node.x = width;
        if (node.x > width) node.x = 0;
      }

      draw();
      raf = requestAnimationFrame(frame);
    };

    resize();
    window.addEventListener('resize', resize);
    if (reduced) draw();
    else raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      themeObserver.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full z-0 pointer-events-none" aria-hidden="true" />;
};
