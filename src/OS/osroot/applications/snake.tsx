import { useEffect, useRef, useState } from "react";

type Position = { x: number; y: number };

const lerp = (start: number, end: number, t: number) => start + (end - start) * t;

export function Snake() {
    const snakeCanvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameRef = useRef<number | null>(null);
    const nextMoveTimeoutRef = useRef<number | null>(null);
    const lastTickRef = useRef<number>(performance.now());
    const previousSegmentsRef = useRef<Position[]>([{ x: 0, y: 0 }]);
    const currentSegmentsRef = useRef<Position[]>([{ x: 0, y: 0 }]);
    const scoreRef = useRef<number>(1);
    const [snakeSegments, setSnakeSegments] = useState<Position[]>([{ x: 0, y: 0 }]);
    const [direction, setDirection] = useState<"right" | "left" | "up" | "down">("right");
    const [score, setScore] = useState(1);
    const [gameOver, setGameOver] = useState(false);
    const [gameWin, setGameWin] = useState(false);
    const foodPosition = useRef<Position>({ x: 0, y: 0 });
    const pendingDirectionRef = useRef(direction);
    const lastAppliedDirectionRef = useRef(direction);
    const directionChangedRef = useRef(false);
    const gameOverRef = useRef(gameOver);
    const gameWinRef = useRef(gameWin);
    const gridSize = 30;
    const tickDuration = 140;

    const isOnSnake = (position: Position, segments: Position[]) =>
        segments.some((segment) => segment.x === position.x && segment.y === position.y);

    const getRandomFoodPosition = (canvas: HTMLCanvasElement, segments: Position[]) => {
        let nextPosition: Position;
        let attempts = 0;
        do {
            nextPosition = {
                x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
                y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize,
            };
            attempts += 1;
        } while (isOnSnake(nextPosition, segments) && attempts < 1000);
        return nextPosition;
    };

    const resetGame = () => {
        const initialSegments = [{ x: 0, y: 0 }];
        previousSegmentsRef.current = initialSegments;
        currentSegmentsRef.current = initialSegments;
        pendingDirectionRef.current = "right";
        lastAppliedDirectionRef.current = "right";
        directionChangedRef.current = false;
        setSnakeSegments(initialSegments);
        setDirection("right");
        setScore(1);
        setGameOver(false);
        setGameWin(false);
        const canvas = snakeCanvasRef.current;
        if (canvas) {
            foodPosition.current = getRandomFoodPosition(canvas, initialSegments);
        }
        if (nextMoveTimeoutRef.current) {
            window.clearTimeout(nextMoveTimeoutRef.current);
            nextMoveTimeoutRef.current = null;
        }
        lastTickRef.current = performance.now();
        scheduleNextMove(tickDuration);
    };

    const drawSnake = (segments: Position[]) => {
        const canvas = snakeCanvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!ctx || !canvas) return;
        ctx.save();
        ctx.shadowColor = "rgba(0,0,0,0.12)";
        ctx.shadowBlur = 3;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 1;

        segments.forEach((segment, index) => {
            const isHead = index === 0;
            const fillColor = isHead ? "#82d47b" : "#63b76d";
            const strokeColor = isHead ? "#1d6f2e" : "#2a8a3d";
            const inset = 3;
            const x = segment.x + inset;
            const y = segment.y + inset;
            const size = gridSize - inset * 2;

            ctx.fillStyle = fillColor;
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.roundRect(x, y, size, size, size * 0.4);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = "rgba(255,255,255,0.16)";
            ctx.fillRect(x + 2, y + 2, size - 4, size * 0.28);

            if (isHead) {
                const eyeRadius = 2.5;
                const eyeY = y + size * 0.35;
                const eyeX1 = x + size * 0.28;
                const eyeX2 = x + size * 0.72;
                ctx.fillStyle = "#ffffff";
                ctx.beginPath();
                ctx.arc(eyeX1, eyeY, eyeRadius, 0, Math.PI * 2);
                ctx.arc(eyeX2, eyeY, eyeRadius, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = "#000000";
                ctx.beginPath();
                ctx.arc(eyeX1 + 1, eyeY, 1.2, 0, Math.PI * 2);
                ctx.arc(eyeX2 + 1, eyeY, 1.2, 0, Math.PI * 2);
                ctx.fill();
            }
        });

        ctx.restore();
    };

    const drawFood = (position: Position) => {
        const canvas = snakeCanvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!ctx || !canvas) return;
        ctx.fillStyle = "#ff5c5c";
        ctx.beginPath();
        ctx.arc(position.x + gridSize / 2, position.y + gridSize / 2, gridSize / 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.7)";
        ctx.lineWidth = 1;
        ctx.stroke();
    };

    const draw = (segments: Position[]) => {
        const canvas = snakeCanvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!ctx || !canvas) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawSnake(segments);
        drawFood(foodPosition.current);
    };

    useEffect(() => {
        const canvas = snakeCanvasRef.current;
        if (!canvas) return;
        canvas.width = 20 * gridSize;
        canvas.height = 20 * gridSize;
        const initialSegments = [{ x: 0, y: 0 }];
        previousSegmentsRef.current = initialSegments;
        currentSegmentsRef.current = initialSegments;
        foodPosition.current = getRandomFoodPosition(canvas, initialSegments);
        draw(initialSegments);
    }, []);

    useEffect(() => {
        const animate = (timestamp: number) => {
            const elapsed = timestamp - lastTickRef.current;
            const progress = Math.min(elapsed / tickDuration, 1);
            draw(getRenderedSegments(progress));
            animationFrameRef.current = window.requestAnimationFrame(animate);
        };

        animationFrameRef.current = window.requestAnimationFrame(animate);
        return () => {
            if (animationFrameRef.current) {
                window.cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    const getRenderedSegments = (progress: number) => {
        const previous = previousSegmentsRef.current;
        const current = currentSegmentsRef.current;
        return current.map((segment, index) => {
            const fallback = previous[index] ?? previous[previous.length - 1] ?? segment;
            return {
                x: lerp(fallback.x, segment.x, progress),
                y: lerp(fallback.y, segment.y, progress),
            };
        });
    };

    useEffect(() => {
        previousSegmentsRef.current = currentSegmentsRef.current;
        currentSegmentsRef.current = snakeSegments;
    }, [snakeSegments]);

    useEffect(() => {
        scoreRef.current = score;
    }, [score]);

    useEffect(() => {
        gameOverRef.current = gameOver;
    }, [gameOver]);

    useEffect(() => {
        gameWinRef.current = gameWin;
    }, [gameWin]);

    const scheduleNextMove = (delay = tickDuration) => {
        if (nextMoveTimeoutRef.current) {
            window.clearTimeout(nextMoveTimeoutRef.current);
        }
        nextMoveTimeoutRef.current = window.setTimeout(() => {
            nextMoveTimeoutRef.current = null;
            moveSnake();
        }, delay);
    };

    const moveSnake = () => {
        if (gameOverRef.current || gameWinRef.current) return;
        lastTickRef.current = performance.now();

        let shouldContinue = true;
        setSnakeSegments((prev) => {
            const head = prev[0];
            let newHead: Position;

            const currentDir = pendingDirectionRef.current;
            switch (currentDir) {
                case "right":
                    newHead = { x: head.x + gridSize, y: head.y };
                    break;
                case "left":
                    newHead = { x: head.x - gridSize, y: head.y };
                    break;
                case "up":
                    newHead = { x: head.x, y: head.y - gridSize };
                    break;
                case "down":
                    newHead = { x: head.x, y: head.y + gridSize };
                    break;
                default:
                    newHead = head;
            }

            lastAppliedDirectionRef.current = currentDir;
            setDirection(currentDir);

            const canvas = snakeCanvasRef.current;
            if (!canvas) return prev;

            const hitWall =
                newHead.x < 0 ||
                newHead.y < 0 ||
                newHead.x >= canvas.width ||
                newHead.y >= canvas.height;

            const isEating =
                newHead.x === foodPosition.current.x &&
                newHead.y === foodPosition.current.y;

            const collisionSegments = isEating ? prev : prev.slice(0, -1);
            const hitSelf = collisionSegments.some(
                (segment) => segment.x === newHead.x && segment.y === newHead.y,
            );

            if (hitWall || hitSelf) {
                shouldContinue = false;
                setGameOver(true);
                return prev;
            }

            if (scoreRef.current >= canvas.width * canvas.height / (gridSize * gridSize) - 1) {
                shouldContinue = false;
                setGameWin(true);
                return prev;
            }

            const nextSegments = [newHead, ...prev];
            if (isEating) {
                foodPosition.current = getRandomFoodPosition(canvas, nextSegments);
                setScore((prevScore) => prevScore + 1);
                return nextSegments;
            }

            nextSegments.pop();
            return nextSegments;
        });

        directionChangedRef.current = false;
        if (shouldContinue) {
            scheduleNextMove(tickDuration);
        }
    };

    useEffect(() => {
        scheduleNextMove(tickDuration);
        return () => {
            if (nextMoveTimeoutRef.current) {
                window.clearTimeout(nextMoveTimeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if ((gameOver || gameWin) && nextMoveTimeoutRef.current) {
            window.clearTimeout(nextMoveTimeoutRef.current);
            nextMoveTimeoutRef.current = null;
        }
    }, [gameOver, gameWin]);

    const setRequestedDirection = (requested: "right" | "left" | "up" | "down") => {
        if (gameOverRef.current || gameWinRef.current) return;
        if (directionChangedRef.current) return;

        const currentDirection = pendingDirectionRef.current;
        const opposite = (a: string, b: string) =>
            (a === "left" && b === "right") ||
            (a === "right" && b === "left") ||
            (a === "up" && b === "down") ||
            (a === "down" && b === "up");

        if (!opposite(requested, currentDirection) && requested !== currentDirection) {
            pendingDirectionRef.current = requested;
            setDirection(requested);
            directionChangedRef.current = true;
        }
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (gameOver || gameWin) {
                if (event.key === "Enter") {
                    resetGame();
                    return;
                }
            }

            let requested: "right" | "left" | "up" | "down" | null = null;
            switch (event.key) {
                case "ArrowUp":
                    requested = "up";
                    break;
                case "ArrowDown":
                    requested = "down";
                    break;
                case "ArrowLeft":
                    requested = "left";
                    break;
                case "ArrowRight":
                    requested = "right";
                    break;
                default:
                    requested = null;
            }

            if (requested) {
                setRequestedDirection(requested);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [gameOver, gameWin]);

    const containerStyle: React.CSSProperties = {
        width: "100%",
        maxWidth: "1068px",
        margin: "0 auto",
        color: "#000",
        fontFamily: "'Lucida Console', 'Courier New', monospace",
        fontSize: "0.95rem",
        fontWeight: 900,
        letterSpacing: "0.05em",
        lineHeight: 1.4,
    };

    const sectionStyle: React.CSSProperties = {
        display: "grid",
        gap: "0.9rem",
        padding: "1rem",
        background: "#c0c0c0",
        borderTop: "2px solid #fff",
        borderLeft: "2px solid #fff",
        borderRight: "2px solid #000",
        borderBottom: "2px solid #000",
        fontSize: "1rem",
        fontFamily: "inherit",
    };




    const panelTitleStyle: React.CSSProperties = {
        fontSize: "1.08rem",
        marginBottom: "0.45rem",
        display: "block",
        fontWeight: 900,
        letterSpacing: "0.08em",
    };

    const buttonStyle: React.CSSProperties = {
        borderTop: "2px solid #fff",
        borderLeft: "2px solid #fff",
        borderRight: "2px solid #000",
        borderBottom: "2px solid #000",
        background: "#c0c0c0",
        color: "#000",
        padding: "1rem 1.05rem",
        minWidth: "4rem",
        cursor: "pointer",
        fontWeight: 900,
        fontSize: "1.15rem",
        textAlign: "center",
        fontFamily: "inherit",
        letterSpacing: "0.04em",
        textTransform: "uppercase",
    };

    return (
        <div style={containerStyle}>
            <div style={{ display: "grid", gap: "1rem", marginTop: "0" }}>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 3.8fr 1fr", gap: "1rem", alignItems: "stretch" }}>
                    <div className="textWrapper" style={{fontSize: "1.2rem"}}>
                        <span style={panelTitleStyle}>Controls</span>
                        <br></br>
                        <span>Arrow keys or buttons</span>
                        <br></br>
                        <span>Eat the red dot</span>
                    </div>

                    <div style={{ position: "relative", top: "1%", overflow: "hidden" }}>
                        {(gameOver || gameWin) && (
                            <div style={{ position: "absolute", inset: 0, background: "rgba(192,192,192,0.95)", zIndex: 2, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "0.5rem", padding: "1rem", textAlign: "center", border: "2px solid #000" }}>
                                <strong style={{ color: "#000", fontSize: "1.1rem" }}>
                                    {gameOver ? "Game over" : "You won!"}
                                </strong>
                                <span style={{ color: "#000" }}>{gameOver ? "Press Enter to restart." : "Press Enter to play again."}</span>
                            </div>
                        )}
                        <div style={{ padding: "1rem", background: "#808080", borderBottom: "2px solid #000", borderRight: "2px solid #000" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#fff", fontSize: "1.1rem", gap: "1rem", fontFamily: "inherit", fontWeight: 900, letterSpacing: "0.08em" }}>
                                <span>Snake</span>
                                <span>Score: {score}</span>
                            </div>
                        </div>
                        <canvas
                            id="snakeCanvas"
                            width={20 * gridSize}
                            height={20 * gridSize}
                            style={{ width: "100%", aspectRatio: "1 / 1", display: "block", backgroundColor: "#000" }}
                            ref={snakeCanvasRef}
                        />
                    </div>

                    <div className="textWrapper" style={{fontSize: "1.2rem"}}>
                        <strong>Tips</strong>
                        <br></br>
                        <span>Move quickly and avoid the walls.</span>
                        <br></br>
                        <span>Food appears in random locations.</span>
                        <br></br>
                        <span>Grow carefully as the board fills.</span>
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "0.75rem" }}>
                    <button type="button" style={buttonStyle} onClick={() => setRequestedDirection("up")}>↑</button>
                    <button type="button" style={buttonStyle} onClick={() => setRequestedDirection("left")}>←</button>
                    <button type="button" style={buttonStyle} onClick={() => setRequestedDirection("down")}>↓</button>
                    <button type="button" style={buttonStyle} onClick={() => setRequestedDirection("right")}>→</button>
                </div>

                <div className="textWrapper" style={{fontSize: "1.2rem"}}>
                    <p style={{ margin: 0 }}>Try the buttons if your keyboard feels slow. Restart anytime with Enter.</p>
                </div>
            </div>
        </div>
    );
}
