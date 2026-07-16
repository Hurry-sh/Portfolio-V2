import { useEffect, useMemo, useRef, useState } from "react";

export function Reveal({ children, className = "", delay = 0 }) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      element.classList.add("is-visible");
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add("is-visible");
          observer.unobserve(element);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${className}`} style={{ "--reveal-delay": `${delay}ms` }}>
      {children}
    </div>
  );
}

export function useMotionRegion(rootMargin = "160px 0px") {
  const ref = useRef(null);
  const [motionActive, setMotionActive] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      setMotionActive(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setMotionActive(entry.isIntersecting),
      { threshold: 0.01, rootMargin },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin]);

  return [ref, motionActive];
}

export function RoleRotator() {
  const roles = useMemo(() => ["DATA ENGINEER", "ML BUILDER", "RESEARCHER"], []);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % roles.length), 2200);
    return () => window.clearInterval(timer);
  }, [roles]);

  return (
    <span className="role-window" aria-live="polite">
      <span key={roles[index]} className="role-word">{roles[index]}</span>
    </span>
  );
}

export function TiltCard({ children, className = "" }) {
  const ref = useRef(null);

  const handleMove = (event) => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const card = ref.current;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    card.style.setProperty("--tilt-x", `${(0.5 - y) * 7}deg`);
    card.style.setProperty("--tilt-y", `${(x - 0.5) * 9}deg`);
    card.style.setProperty("--spot-x", `${x * 100}%`);
    card.style.setProperty("--spot-y", `${y * 100}%`);
  };

  const reset = () => {
    const card = ref.current;
    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
  };

  return (
    <article ref={ref} onPointerMove={handleMove} onPointerLeave={reset} className={`tilt-card ${className}`}>
      {children}
    </article>
  );
}

export function NetworkCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d", { alpha: true, desynchronized: true });
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const activeFrameInterval = 1000 / (coarsePointer ? 20 : 24);
    const idleFrameInterval = 1000 / 10;
    const idleAfter = 3500;
    const connectionRadius = 125;
    const connectionRadiusSquared = connectionRadius * connectionRadius;
    const pointerRadius = 110;
    const pointerRadiusSquared = pointerRadius * pointerRadius;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let frame = 0;
    let previousTime = 0;
    let lastInteraction = performance.now();
    let running = false;
    let nodes = [];
    const pointer = { x: -1000, y: -1000 };

    const createNodes = () => {
      const count = Math.min(32, Math.max(18, Math.floor(width / 45)));
      nodes = Array.from({ length: count }, (_, index) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.24,
        vy: (Math.random() - 0.5) * 0.24,
        radius: index % 9 === 0 ? 2.1 : 1.15,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      createNodes();
    };

    const movePointer = (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      lastInteraction = performance.now();
    };

    const markInteraction = () => {
      lastInteraction = performance.now();
    };

    const clearPointer = () => {
      pointer.x = -1000;
      pointer.y = -1000;
    };

    const draw = (time = 0) => {
      const frameInterval = time - lastInteraction > idleAfter ? idleFrameInterval : activeFrameInterval;
      if (!reduceMotion && previousTime && time - previousTime < frameInterval) {
        if (running) frame = window.requestAnimationFrame(draw);
        return;
      }

      const step = previousTime ? Math.min(2, (time - previousTime) / frameInterval) : 1;
      previousTime = time;
      context.clearRect(0, 0, width, height);

      nodes.forEach((node, index) => {
        if (!reduceMotion) {
          node.x += node.vx * step;
          node.y += node.vy * step;
          if (node.x < -10 || node.x > width + 10) node.vx *= -1;
          if (node.y < -10 || node.y > height + 10) node.vy *= -1;

          const dx = node.x - pointer.x;
          const dy = node.y - pointer.y;
          const distanceSquared = dx * dx + dy * dy;
          if (distanceSquared < pointerRadiusSquared && distanceSquared > 0) {
            const distance = Math.sqrt(distanceSquared);
            node.x += (dx / distance) * 0.16;
            node.y += (dy / distance) * 0.16;
          }
        }

        for (let other = index + 1; other < nodes.length; other += 1) {
          const target = nodes[other];
          const dx = node.x - target.x;
          const dy = node.y - target.y;
          const distanceSquared = dx * dx + dy * dy;
          if (distanceSquared < connectionRadiusSquared) {
            const distance = Math.sqrt(distanceSquared);
            const alpha = (1 - distance / connectionRadius) * 0.22;
            context.beginPath();
            context.moveTo(node.x, node.y);
            context.lineTo(target.x, target.y);
            context.strokeStyle = `rgba(121, 230, 255, ${alpha})`;
            context.lineWidth = 0.8;
            context.stroke();
          }
        }

        const pulse = reduceMotion ? 1 : 0.78 + Math.sin(time * 0.0015 + node.phase) * 0.22;
        context.beginPath();
        context.arc(node.x, node.y, node.radius * pulse, 0, Math.PI * 2);
        context.fillStyle = index % 9 === 0 ? "rgba(216, 255, 101, .82)" : "rgba(121, 230, 255, .56)";
        context.fill();
      });

      if (running) frame = window.requestAnimationFrame(draw);
    };

    const handleResize = () => {
      resize();
      if (!running) draw();
    };

    const stop = () => {
      running = false;
      window.cancelAnimationFrame(frame);
    };

    const start = () => {
      if (reduceMotion || running || document.hidden) return;
      running = true;
      previousTime = 0;
      frame = window.requestAnimationFrame(draw);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) stop();
      else {
        markInteraction();
        start();
      }
    };

    resize();
    if (reduceMotion) draw();
    else start();
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", markInteraction, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);
    if (!coarsePointer) {
      window.addEventListener("pointermove", movePointer, { passive: true });
      window.addEventListener("pointerleave", clearPointer);
    }

    return () => {
      stop();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", markInteraction);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (!coarsePointer) {
        window.removeEventListener("pointermove", movePointer);
        window.removeEventListener("pointerleave", clearPointer);
      }
    };
  }, []);

  return <canvas className="network-canvas" ref={canvasRef} aria-hidden="true" />;
}

const pipelineModes = {
  ingest: {
    label: "INGEST",
    metric: "1.2M events",
    note: "Raw signals arrive continuously.",
    nodes: ["events", "stream", "lake", "data"],
  },
  learn: {
    label: "LEARN",
    metric: "94.8% signal",
    note: "Features become useful patterns.",
    nodes: ["clean", "features", "model", "data"],
  },
  serve: {
    label: "SERVE",
    metric: "42ms response",
    note: "Predictions become decisions.",
    nodes: ["model", "API", "impact", "data"],
  },
};

export function PipelineLab() {
  const [mode, setMode] = useState("learn");
  const [motionRef, motionActive] = useMotionRegion();
  const active = pipelineModes[mode];

  return (
    <div ref={motionRef} className={`pipeline-lab pipeline-lab--${mode} motion-region${motionActive ? " is-motion-active" : ""}`}>
      <div className="pipeline-topbar">
        <div className="window-dots" aria-hidden="true"><span /><span /><span /></div>
        <span>harish.pipeline / live</span>
        <span className="live-pulse">RUNNING</span>
      </div>

      <div className="pipeline-stage" aria-live="polite">
        <div className="pipeline-grid" aria-hidden="true" />
        <div className="orbit orbit--outer"><span className="orbit-node orbit-node--a" /><span className="orbit-node orbit-node--b" /></div>
        <div className="orbit orbit--inner"><span className="orbit-node orbit-node--c" /></div>
        <div className="model-core">
          <span className="model-core__eyebrow">ACTIVE MODE</span>
          <strong>{active.label}</strong>
          <span>{active.metric}</span>
        </div>
        <svg className="pipeline-lines" viewBox="0 0 560 330" preserveAspectRatio="none" aria-hidden="true">
          <path className="flow-path flow-path--one" d="M24 94 C160 94 165 165 280 165 S405 94 536 94" />
          <path className="flow-path flow-path--two" d="M24 256 C140 256 174 165 280 165 S410 258 536 258" />
        </svg>
        <div className="data-node data-node--left-top"><i />{active.nodes[3]}</div>
        <div className="data-node data-node--left-bottom"><i />{active.nodes[0]}</div>
        <div className="data-node data-node--right-bottom"><i />{active.nodes[1]}</div>
        <div className="data-node data-node--right"><i />{active.nodes[2]}</div>
      </div>

      <div className="pipeline-controls">
        <p>{active.note}</p>
        <div className="mode-switch" aria-label="Choose pipeline stage">
          {Object.keys(pipelineModes).map((key) => (
            <button key={key} type="button" onClick={() => setMode(key)} className={mode === key ? "is-active" : ""} aria-pressed={mode === key}>
              {pipelineModes[key].label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const annLayers = [
  [38, 74, 110, 146].map((y) => ({ x: 38, y })),
  [24, 55, 86, 117, 148].map((y) => ({ x: 126, y })),
  [38, 74, 110, 146].map((y) => ({ x: 218, y })),
  [66, 120].map((y) => ({ x: 310, y })),
];

const annEdges = annLayers.slice(0, -1).flatMap((layer, layerIndex) =>
  layer.flatMap((source) =>
    annLayers[layerIndex + 1].map((target) => ({ source, target, layerIndex })),
  ),
);

export function ProjectVisual({ type }) {
  const [motionRef, motionActive] = useMotionRegion();

  return (
    <div ref={motionRef} className={`project-visual project-visual--${type} motion-region${motionActive ? " is-motion-active" : ""}`} aria-hidden="true">
      {type === "tokens" && <><span>tomato</span><span>basil</span><span>→ recipe</span></>}
      {type === "radar" && <><div className="radar-ring radar-ring--one" /><div className="radar-ring radar-ring--two" /><div className="radar-sweep" /><i className="radar-hit radar-hit--a" /><i className="radar-hit radar-hit--b" /></>}
      {type === "network" && <svg viewBox="0 0 300 150"><path d="M25 110 87 45l55 56 50-68 82 67" /><circle cx="25" cy="110" r="6" /><circle cx="87" cy="45" r="6" /><circle cx="142" cy="101" r="6" /><circle cx="192" cy="33" r="6" /><circle cx="274" cy="100" r="6" /></svg>}
      {type === "blocks" && (
        <div className="server-cluster">
          {[0, 1, 2].map((rack) => (
            <div className="server-rack" key={rack} style={{ "--rack": rack }}>
              <div className="server-rack__head"><span>NODE 0{rack + 1}</span><i /></div>
              {[0, 1, 2, 3].map((bay) => (
                <div className="server-rack__bay" key={bay}>
                  <i /><i /><span />
                </div>
              ))}
            </div>
          ))}
          <div className="server-cluster__status"><i /> DISTRIBUTED / 03 NODES</div>
        </div>
      )}
      {type === "ann" && (
        <svg className="ann-diagram" viewBox="0 0 348 180" preserveAspectRatio="xMidYMid meet">
          <g className="ann-edges">
            {annEdges.map(({ source, target, layerIndex }, index) => (
              <line
                key={`${source.x}-${source.y}-${target.x}-${target.y}`}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                className={`ann-edge ann-edge--layer-${layerIndex + 1}`}
                style={{ "--edge": index }}
              />
            ))}
          </g>
          <g className="ann-nodes">
            {annLayers.flatMap((layer, layerIndex) => layer.map((node, nodeIndex) => (
              <circle
                key={`${node.x}-${node.y}`}
                cx={node.x}
                cy={node.y}
                r={layerIndex === annLayers.length - 1 ? 7 : 5.5}
                className={layerIndex === annLayers.length - 1 ? "ann-node ann-node--output" : "ann-node"}
                style={{ "--node": layerIndex * 5 + nodeIndex }}
              />
            )))}
          </g>
          <g className="ann-labels">
            <text x="38" y="172">INPUT</text>
            <text x="126" y="172">HIDDEN</text>
            <text x="218" y="172">HIDDEN</text>
            <text x="310" y="172">CLASS</text>
          </g>
        </svg>
      )}
      {type === "digits" && (
        <svg className="digit-canvas" viewBox="0 0 350 150" preserveAspectRatio="xMidYMid meet">
          <path className="digit-signal" d="M45 124 H305" />
          {[58, 136, 214, 292].map((x, index) => (
            <circle key={x} className="digit-sensor" cx={x} cy="124" r="6" style={{ "--digit": index }} />
          ))}
          {["7", "7", "7", "3"].map((digit, index) => (
            <text key={`${digit}-${index}`} className={index === 3 ? "digit-glyph digit-glyph--blue" : "digit-glyph"} x={58 + index * 78} y="98" style={{ "--digit": index }}>
              {digit}
            </text>
          ))}
          <text className="digit-caption" x="175" y="143">HANDWRITING / RECOGNIZED</text>
        </svg>
      )}
      {type === "clock" && <><div className="clock-face"><i /><b /></div><span>SYNC_OK</span></>}
      {type === "window" && <><div className="mini-window"><i /><i /><i /><span /><span /></div></>}
      {type === "cursor" && <div className="cursor-mark">HK</div>}
    </div>
  );
}
