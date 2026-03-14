{/* Just Slide Page */ }

import { useState, useEffect, useCallback, useRef } from "react";
import LevelSelect from "./LevelSelect";
import { LEVELS } from "../data/levels.js";
import "../css/just.css";

const EMPTY = 0;
const WALL = 1;
const TRACK_H = 2;
const TRACK_V = 3;
const TRACK_CROSS = 4;
const GOAL = 5;

const CELL_SIZE = 60;

const DIRS = {
    up: { dx: 0, dy: -1 },
    down: { dx: 0, dy: 1 },
    left: { dx: -1, dy: 0 },
    right: { dx: 1, dy: 0 },
};

// LEVELS moved to ../data/levels.js

function canMove(grid, x, y, dir) {
    const { dx, dy } = DIRS[dir];
    const nx = x + dx, ny = y + dy;
    const nc = grid[ny]?.[nx];
    return nc !== undefined && nc !== WALL;
}

function computeSlide(grid, pos, dir) {
    const { dx, dy } = DIRS[dir];
    let x = pos.x, y = pos.y;
    const cells = [{ x, y }];
    while (true) {
        const nx = x + dx, ny = y + dy;
        const nc = grid[ny]?.[nx];
        if (nc === undefined || nc === WALL) break;
        x = nx; y = ny;
        cells.push({ x, y });
    }
    return cells;
}

function cellKey(x, y) { return `${x},${y}`; }

export default function JustSlide({ initialLevelIdx = 0, onBackToLevels, onWin }) {
    const [levelIdx, setLevelIdx] = useState(initialLevelIdx);
    const level = LEVELS[levelIdx];
    const grid = level.grid;

    const posRef = useRef({ ...level.start });
    const [charPx, setCharPx] = useState({ ...level.start });
    const [filledCells, setFilledCells] = useState(() => new Set([cellKey(level.start.x, level.start.y)]));
    const [won, setWon] = useState(false);
    const [moves, setMoves] = useState(0);
    const animating = useRef(false);
    const timers = useRef([]);
    const [showLevelSelect, setShowLevelSelect] = useState(false);

    const fillableCount = () => {
        let count = 0;
        level.grid.forEach(row => row.forEach(cell => {
            if (cell !== WALL) count++;
        }));
        return count;
    };

    const [winSize, setWinSize] = useState({ w: window.innerWidth, h: window.innerHeight });

    useEffect(() => {
        const handleResize = () => setWinSize({ w: window.innerWidth, h: window.innerHeight });
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const reset = useCallback((idx) => {
        const lv = LEVELS[idx !== undefined ? idx : levelIdx];
        posRef.current = { ...lv.start };
        setCharPx({ ...lv.start });
        setFilledCells(new Set([cellKey(lv.start.x, lv.start.y)]));
        setWon(false);
        setMoves(0);
        animating.current = false;
        timers.current.forEach(clearTimeout);
        timers.current = [];
    }, [levelIdx]);

    useEffect(() => { reset(levelIdx); }, [levelIdx]);

    const doSlide = useCallback((dir) => {
        if (animating.current || won) return;
        const pos = posRef.current;
        if (!canMove(grid, pos.x, pos.y, dir)) return;

        const cells = computeSlide(grid, pos, dir);
        if (cells.length < 2) return;

        animating.current = true;
        setMoves(m => m + 1);
        timers.current.forEach(clearTimeout);
        timers.current = [];

        cells.forEach((cell, i) => {
            const t = setTimeout(() => {
                setCharPx({ x: cell.x, y: cell.y });

                setFilledCells(prev => {
                    const next = new Set(prev);
                    for (let j = 0; j <= i; j++) next.add(cellKey(cells[j].x, cells[j].y));

                    if (next.size === fillableCount()) {
                        setWon(true);
                    }
                    return next;
                });

                if (i === cells.length - 1) {
                    posRef.current = { x: cell.x, y: cell.y };
                    animating.current = false;
                }
            }, i * 55);
            timers.current.push(t);
        });

    }, [won, grid]);

    useEffect(() => {
        const onKey = (e) => {
            const map = {
                ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
                w: "up", s: "down", a: "left", d: "right",
            };
            if (e.key === "r" || e.key === "R") { reset(); return; }
            const dir = map[e.key];
            if (dir) { e.preventDefault(); doSlide(dir); }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [doSlide, reset]);

    const touch = useRef(null);
    const onTouchStart = (e) => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
    const onTouchEnd = (e) => {
        if (!touch.current) return;
        const dx = e.changedTouches[0].clientX - touch.current.x;
        const dy = e.changedTouches[0].clientY - touch.current.y;
        if (Math.abs(dx) > Math.abs(dy)) { if (Math.abs(dx) > 20) doSlide(dx > 0 ? "right" : "left"); }
        else { if (Math.abs(dy) > 20) doSlide(dy > 0 ? "down" : "up"); }
        touch.current = null;
    };

    const onMouseDown = (e) => { touch.current = { x: e.clientX, y: e.clientY }; };
    const onMouseUp = (e) => {
        if (!touch.current) return;
        const dx = e.clientX - touch.current.x;
        const dy = e.clientY - touch.current.y;
        if (Math.abs(dx) > Math.abs(dy)) { if (Math.abs(dx) > 20) doSlide(dx > 0 ? "right" : "left"); }
        else { if (Math.abs(dy) > 20) doSlide(dy > 0 ? "down" : "up"); }
        touch.current = null;
    };

    const BOARD_SIZE = 400;
    const cellSize = BOARD_SIZE / level.cols;

    const maxW = winSize.w * 0.95;
    const maxH = winSize.h * 0.5;
    const scale = Math.min(maxW / BOARD_SIZE, maxH / BOARD_SIZE, 1);

    return (
        <div className="game-container">
            <div className="game-header" style={{ transform: winSize.w < 500 ? "scale(0.85)" : "scale(1)" }}>
                <div className="header-controls">
                    <button className="control-btn" onClick={onBackToLevels} title="Home">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                    </button>
                    
                    <div className="game-stats">
                        {level.name} &nbsp;·&nbsp; MOVES: {moves}
                    </div>

                    <button className="control-btn" onClick={() => reset()} title="Reset">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
                            <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16"/>
                        </svg>
                    </button>
                </div>
            </div>

            <div className="board-wrapper" style={{ width: BOARD_SIZE * scale, height: BOARD_SIZE * scale }}>
                <div
                    onTouchStart={onTouchStart}
                    onTouchEnd={onTouchEnd}
                    onMouseDown={onMouseDown}
                    onMouseUp={onMouseUp}
                    onMouseLeave={onMouseUp}
                    className="game-board"
                    style={{ width: BOARD_SIZE, height: BOARD_SIZE, transform: `scale(${scale})` }}
                >
                    {grid.map((row, y) => row.map((cell, x) => {
                        if (cell === WALL) {
                            return (
                                <div key={`${x}-${y}`} className="cell-wall" style={{ left: x * cellSize, top: y * cellSize, width: cellSize, height: cellSize }}>
                                    {y < grid.length - 1 && grid[y + 1][x] !== WALL && (
                                        <div className="cell-wall-bottom" />
                                    )}
                                </div>
                            );
                        }
                        return (
                            <div key={`${x}-${y}`} className="cell-empty" style={{ left: x * cellSize, top: y * cellSize, width: cellSize, height: cellSize }}>
                                <div className="cell-dot" />
                            </div>
                        );
                    }))}

                    {Array.from(filledCells).map(key => {
                        const [cx, cy] = key.split(",").map(Number);
                        return (
                            <div key={`fill-${key}`} className="cell-filled" style={{ left: cx * cellSize, top: cy * cellSize, width: cellSize, height: cellSize }}>
                                <div className="fill-overlay" />
                            </div>
                        );
                    })}

                    <div className="character-unit" style={{ left: charPx.x * cellSize + 2, top: charPx.y * cellSize + 2, width: cellSize - 4, height: cellSize - 4 }}>
                        <div className="character-face">
                            <div className="eye eye-left" />
                            <div className="eye eye-right" />
                            <div className="mouth" />
                        </div>
                    </div>
                </div>
            </div>

            {won && (
                <div className="win-overlay">
                    <div className="win-tray">
                        <div className="win-avatar">
                            <div className="avatar-face">
                                <div className="avatar-eye" />
                                <div className="avatar-eye" />
                                <div className="avatar-mouth" />
                            </div>
                        </div>
                        <div className="win-content">
                            <h2 className="win-title">PERFECT!</h2>
                            <p className="win-subtitle">Level {levelIdx + 1} Cleared</p>
                            <div className="win-meta">
                                <span>{moves} MOVES</span>
                            </div>
                            <div className="win-actions-vertical">
                                {levelIdx < LEVELS.length - 1 && (
                                    <button 
                                        onClick={() => {
                                            if (onWin) onWin(levelIdx); // Unlock when moving forward
                                            setLevelIdx(i => i + 1);
                                        }} 
                                        className="btn-action-main"
                                    >
                                        NEXT SLIDE
                                    </button>
                                )}
                                <div className="win-actions-row">
                                    <button onClick={() => reset()} className="btn-action-sub">RETRY</button>
                                    <button 
                                        onClick={() => {
                                            if (onWin) onWin(levelIdx); // Also unlock if going to menu after win
                                            onBackToLevels();
                                        }} 
                                        className="btn-action-sub"
                                    >
                                        MENU
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Local level select removed in favor of App-level navigation */}
        </div>
    );
}