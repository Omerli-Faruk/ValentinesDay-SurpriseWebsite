import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BlockPuzzleGameProps {
  onLinesCleared: () => void;
}

// --- CONFIG ---
const GRID_SIZE = 8;
const REQUIRED_LINES = 3; // Win condition

// Colors
const COLORS = [
  '#60a5fa', // Blue
  '#f472b6', // Pink
  '#34d399', // Emerald
  '#fbbf24', // Amber
  '#a78bfa', // Violet
];

// --- EASY SHAPES ---
const SHAPES = [
  { id: 'dot', layout: [[0, 0]], color: COLORS[0], weight: 3 },
  { id: 'sq2', layout: [[0, 0], [0, 1], [1, 0], [1, 1]], color: COLORS[1], weight: 2 },
  { id: 'v2', layout: [[0, 0], [1, 0]], color: COLORS[2], weight: 2 },
  { id: 'h2', layout: [[0, 0], [0, 1]], color: COLORS[2], weight: 2 },
  { id: 'v3', layout: [[0, 0], [1, 0], [2, 0]], color: COLORS[3], weight: 2 },
  { id: 'h3', layout: [[0, 0], [0, 1], [0, 2]], color: COLORS[3], weight: 2 },
];

export const BlockPuzzleGame: React.FC<BlockPuzzleGameProps> = ({ onLinesCleared }) => {
  // Grid State: stores color strings. null = empty.
  const [grid, setGrid] = useState<(string | null)[][]>(
    Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null))
  );

  // Game Progress
  const [linesClearedTotal, setLinesClearedTotal] = useState(0);
  const [dockShapes, setDockShapes] = useState<(typeof SHAPES[0] | null)[]>([]);

  // Dragging State
  const [draggingShapeIdx, setDraggingShapeIdx] = useState<number | null>(null);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [ghostPos, setGhostPos] = useState<{ r: number; c: number } | null>(null);
  
  // Animation State
  const [explodingCells, setExplodingCells] = useState<Set<string>>(new Set());

  // Refs
  const gridRef = useRef<HTMLDivElement>(null);

  // Init
  useEffect(() => {
    setDockShapes(getRandomShapes());
  }, []);

  const getRandomShapes = () => {
    const pool: typeof SHAPES[0][] = [];
    SHAPES.forEach(s => { for(let i=0; i<s.weight; i++) pool.push(s); });
    return [0, 1, 2].map(() => pool[Math.floor(Math.random() * pool.length)]);
  };

  // --- CORE COORDINATE LOGIC ---

  const getGridMetrics = () => {
    if (!gridRef.current) return null;
    const rect = gridRef.current.getBoundingClientRect();
    const cellSize = rect.width / GRID_SIZE;
    return { rect, cellSize };
  };

  const getTargetCell = (clientX: number, clientY: number, shape: typeof SHAPES[0]) => {
    const metrics = getGridMetrics();
    if (!metrics) return null;
    const { rect, cellSize } = metrics;

    // We assume the user is dragging the shape by its visual CENTER.
    // Calculate the dimensions of the shape in pixels
    const maxR = Math.max(...shape.layout.map(p => p[0]));
    const maxC = Math.max(...shape.layout.map(p => p[1]));
    const shapeWidth = (maxC + 1) * cellSize;
    const shapeHeight = (maxR + 1) * cellSize;

    // Calculate top-left corner of the shape relative to viewport
    const shapeTopLeftX = clientX - (shapeWidth / 2);
    const shapeTopLeftY = clientY - (shapeHeight / 2);

    // Convert to grid coordinates
    // We add 0.5 * cellSize to "snap" to the nearest cell center
    const relativeX = shapeTopLeftX - rect.left + (cellSize * 0.5);
    const relativeY = shapeTopLeftY - rect.top + (cellSize * 0.5);

    const c = Math.floor(relativeX / cellSize);
    const r = Math.floor(relativeY / cellSize);

    return { r, c };
  };

  // --- HANDLERS ---

  const handleDragStart = (e: React.PointerEvent | React.TouchEvent, index: number) => {
    // Standardize coordinates
    const cx = 'touches' in e ? e.touches[0].clientX : (e as React.PointerEvent).clientX;
    const cy = 'touches' in e ? e.touches[0].clientY : (e as React.PointerEvent).clientY;
    
    setDraggingShapeIdx(index);
    setDragPos({ x: cx, y: cy });
  };

  const handleDragMove = (e: React.PointerEvent | React.TouchEvent) => {
    if (draggingShapeIdx === null) return;
    
    const cx = 'touches' in e ? e.touches[0].clientX : (e as React.PointerEvent).clientX;
    const cy = 'touches' in e ? e.touches[0].clientY : (e as React.PointerEvent).clientY;
    setDragPos({ x: cx, y: cy });

    // Ghost Logic
    const shape = dockShapes[draggingShapeIdx];
    if (shape) {
      const target = getTargetCell(cx, cy, shape);
      if (target && isValidPlacement(grid, shape.layout, target.r, target.c)) {
        setGhostPos({ r: target.r, c: target.c });
      } else {
        setGhostPos(null);
      }
    }
  };

  const handleDragEnd = (e: React.PointerEvent | React.TouchEvent) => {
    if (draggingShapeIdx === null) return;
    
    // Use the last known ghost position for the drop if valid, 
    // or recalculate one last time to be sure.
    // Since ghostPos is updated on move, it's usually reliable, 
    // but touchEnd doesn't give coords, so we rely on state.
    
    if (ghostPos && dockShapes[draggingShapeIdx]) {
       placeShape(dockShapes[draggingShapeIdx]!, ghostPos.r, ghostPos.c);
       
       // Remove from dock
       const newDock = [...dockShapes];
       newDock[draggingShapeIdx] = null;
       setDockShapes(newDock);

       // Refill dock logic
       if (newDock.every(s => s === null)) {
         setTimeout(() => setDockShapes(getRandomShapes()), 200);
       }
    }

    setDraggingShapeIdx(null);
    setGhostPos(null);
  };

  // --- GAME LOGIC ---

  const isValidPlacement = (gridState: (string|null)[][], layout: number[][], r: number, c: number) => {
    for (const [rOff, cOff] of layout) {
        const nr = r + rOff;
        const nc = c + cOff;
        if (nr < 0 || nr >= GRID_SIZE || nc < 0 || nc >= GRID_SIZE) return false;
        if (gridState[nr][nc] !== null) return false;
    }
    return true;
  };

  const placeShape = (shape: typeof SHAPES[0], r: number, c: number) => {
    const newGrid = grid.map(row => [...row]);
    
    // 1. Place Block
    shape.layout.forEach(([rOff, cOff]) => {
        newGrid[r + rOff][c + cOff] = shape.color;
    });

    // 2. Check Lines
    const rowsToClear: number[] = [];
    const colsToClear: number[] = [];

    // Check Rows
    for (let i = 0; i < GRID_SIZE; i++) {
        if (newGrid[i].every(val => val !== null)) rowsToClear.push(i);
    }
    // Check Cols
    for (let j = 0; j < GRID_SIZE; j++) {
        if (newGrid.every(row => row[j] !== null)) colsToClear.push(j);
    }

    const totalLines = rowsToClear.length + colsToClear.length;
    
    if (totalLines > 0) {
        // TRIGGER EXPLOSION
        const cellsToExplode = new Set<string>();
        
        rowsToClear.forEach(rowIndex => {
            for(let k=0; k<GRID_SIZE; k++) cellsToExplode.add(`${rowIndex}-${k}`);
        });
        colsToClear.forEach(colIndex => {
            for(let k=0; k<GRID_SIZE; k++) cellsToExplode.add(`${k}-${colIndex}`);
        });

        // Set visual state to trigger heart animation
        setExplodingCells(cellsToExplode);

        // Update total score
        const newScore = linesClearedTotal + totalLines;
        setLinesClearedTotal(newScore);

        // Wait for animation then clear data
        setTimeout(() => {
            const clearedGrid = newGrid.map((row, rIdx) => 
                row.map((val, cIdx) => 
                   cellsToExplode.has(`${rIdx}-${cIdx}`) ? null : val
                )
            );
            setGrid(clearedGrid);
            setExplodingCells(new Set()); // Reset explosion

            // Win Condition
            if (newScore >= REQUIRED_LINES) {
                setTimeout(onLinesCleared, 500);
            }
        }, 800); // 800ms explosion duration

    } else {
        setGrid(newGrid);
    }
  };

  // --- RENDER ---

  return (
    <div 
      className="w-full h-full bg-slate-900 text-white flex flex-col items-center justify-center p-4 touch-none select-none overflow-hidden"
      onPointerMove={handleDragMove}
      onPointerUp={handleDragEnd}
      onTouchMove={handleDragMove}
      onTouchEnd={handleDragEnd}
    >
      {/* Header */}
      <div className="w-full max-w-md flex justify-between items-end mb-8 px-2">
        <div>
           <div className="text-blue-400 font-mono text-sm mb-1">BLOCK PUZZLE</div>
           <h1 className="text-2xl font-bold tracking-wider">BLOCK PUZZLE</h1>
        </div>
        <div className="">
            <div className="text-sm text-gray-500 font-mono tracking-widest mb-1">Score</div>
           <div className="text-2xl font-bold text-pink-400 font-mono items-center justify-center flex">{linesClearedTotal}</div>
        </div>
      </div>

      {/* GRID CONTAINER */}
      <div 
        ref={gridRef}
        className="relative bg-slate-800/50 p-1 rounded-xl border border-slate-700 shadow-2xl"
        style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            width: 'min(90vw, 360px)',
            aspectRatio: '1/1',
            gap: '2px'
        }}
      >
        {grid.map((row, r) => 
            row.map((color, c) => {
                const isExploding = explodingCells.has(`${r}-${c}`);
                const isGhost = ghostPos && ghostPos.r === r && ghostPos.c === c && dockShapes[draggingShapeIdx!]?.layout.some(p => p[0] + r === r && p[1] + c === c);
                
                // Check if this specific cell is part of the ghost shape
                let isGhostCell = false;
                if (ghostPos && dockShapes[draggingShapeIdx!]) {
                   const layout = dockShapes[draggingShapeIdx!]!.layout;
                   // Logic: if (r,c) minus ghostPos (gr, gc) exists in layout
                   const relativeR = r - ghostPos.r;
                   const relativeC = c - ghostPos.c;
                   if (layout.some(p => p[0] === relativeR && p[1] === relativeC)) {
                      isGhostCell = true;
                   }
                }

                return (
                  <div key={`${r}-${c}`} className="relative w-full h-full bg-slate-800/80 rounded-[4px] overflow-visible">
                    
                    {/* Ghost Preview */}
                    {isGhostCell && (
                        <div className="absolute inset-0 bg-white/20 border-2 border-white/50 rounded-[4px] z-10 animate-pulse" />
                    )}

                    {/* Active Block */}
                    {color && !isExploding && (
                        <motion.div 
                          layoutId={`block-${r}-${c}`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-full h-full rounded-[4px] shadow-sm"
                          style={{ backgroundColor: color, boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3)' }}
                        />
                    )}

                    {/* Heart Explosion */}
                    <AnimatePresence>
                        {isExploding && (
                            <motion.div
                                key="explode"
                                initial={{ scale: 0.5, opacity: 1, y: 0 }}
                                animate={{ scale: 2, opacity: 0, y: -50 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="absolute inset-0 z-20 flex items-center justify-center"
                            >
                                <span className="text-2xl drop-shadow-md">💖</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                  </div>
                );
            })
        )}
      </div>

      {/* DOCK */}
      <div className="mt-10 flex justify-center gap-6 h-20 w-full max-w-md">
         {dockShapes.map((shape, idx) => (
             <div 
               key={idx}
               className={`relative flex items-center justify-center w-20 h-20 transition-all ${draggingShapeIdx === idx ? 'opacity-0' : 'opacity-100'}`}
               onPointerDown={(e) => shape && handleDragStart(e, idx)}
               onTouchStart={(e) => shape && handleDragStart(e, idx)}
             >
                 {shape && <MiniShape shape={shape} />}
             </div>
         ))}
      </div>

      {/* DRAG PREVIEW PORTAL */}
      {draggingShapeIdx !== null && dockShapes[draggingShapeIdx] && (
          <div 
            className="fixed pointer-events-none z-[999]"
            style={{
                left: dragPos.x,
                top: dragPos.y,
                transform: 'translate(-50%, -50%)', // Center the preview on cursor
                filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.5))'
            }}
          >
             {/* Scale the shape up slightly to match grid feel better */}
             <div style={{ transform: 'scale(1.5)' }}>
                <MiniShape shape={dockShapes[draggingShapeIdx]!} />
             </div>
          </div>
      )}

    </div>
  );
};

// Helper for Shape rendering
const MiniShape = ({ shape }: { shape: typeof SHAPES[0] }) => {
    const cellSize = 15; // Small preview size
    const maxR = Math.max(...shape.layout.map(p => p[0]));
    const maxC = Math.max(...shape.layout.map(p => p[1]));
    
    return (
        <div 
          className="relative"
          style={{ width: (maxC + 1) * cellSize, height: (maxR + 1) * cellSize }}
        >
            {shape.layout.map(([r, c], i) => (
                <div
                    key={i}
                    className="absolute border border-white/20 rounded-[2px]"
                    style={{
                        top: r * cellSize,
                        left: c * cellSize,
                        width: cellSize,
                        height: cellSize,
                        backgroundColor: shape.color
                    }}
                />
            ))}
        </div>
    );
};