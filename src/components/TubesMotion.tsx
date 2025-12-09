// import { useEffect, useRef } from "react";

// export default function TubesCursorBackground() {
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     let destroyed = false;
//     let app = null;

//     async function load() {
//       const module = await import(
//         "https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js"
//       );
//       if (destroyed) return;

//       const TubesCursor = module.default;
//       const canvas = canvasRef.current;

//       app = TubesCursor(canvas, {
//         tubes: {
//           colors: ["#f967fb", "#53bc28", "#6958d5"],
//           lights: {
//             intensity: 200,
//             colors: ["#83f36e", "#fe8a2e", "#ff008a", "#60aed5"],
//           },
//         },
//         // ⭐ ENABLE CURSOR TRACKING
//         events: {
//           mouse: true,
//           touch: true,
//         },
//       });

//       // ⭐ IMPORTANT — update size when needed
//       const resize = () => {
//         app?.onResize?.();
//       };

//       window.addEventListener("resize", resize);
//       resize();
//     }

//     load();

//     return () => {
//       destroyed = true;
//     };
//   }, []);

//   return <canvas ref={canvasRef} className="tubes-canvas" />;
// }

import { useEffect, useRef } from "react";

export default function TubesCursorBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let destroyed = false;
    let app: any = null;

    async function loadTubes() {
      const module = await import(
        "https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js"
      );
      if (destroyed) return;

      const TubesCursor = module.default;
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Initialize tubes cursor
      app = TubesCursor(canvas, {
        tubes: {
          colors: ["#f967fb", "#53bc28", "#6958d5"],
          lights: {
            intensity: 200,
            colors: ["#83f36e", "#fe8a2e", "#ff008a", "#60aed5"],
          },
        },
        events: {
          mouse: true,
          touch: true,
          click: true,
        },
      });

      // Resize handler (the missing fix)
      const resizeCanvas = () => {
        canvas.style.width = "100vw";
        canvas.style.height = "100vh";
        app?.onResize?.();
      };

      window.addEventListener("resize", resizeCanvas);
      resizeCanvas();
    }

    loadTubes();

    return () => {
      destroyed = true;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -10,
        pointerEvents: "none",
      }}
    />
  );
}
