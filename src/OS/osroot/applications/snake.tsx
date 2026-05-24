import { useEffect, useRef, useState } from "react";

type Position = { x: number; y: number };

export function Snake() {
    const snakeCanvasRef = useRef<HTMLCanvasElement>(null);
    const gridSize = 30;
    const [snakeSegments, setSnakeSegments] = useState<Position[]>([{ x: 0, y: 0 }]);
    const [direction, setDirection] = useState<"right" | "left" | "up" | "down">("right");
    const [score, setScore] = useState(1);
    const [gameOver, setGameOver] = useState(false);
    const [gameWin, setGameWin] = useState(false);
    const foodPosition = useRef<Position>({ x: 0, y: 0 });
    const pendingDirectionRef = useRef(direction);
    const lastAppliedDirectionRef = useRef(direction);
    const gameOverRef = useRef(gameOver);
    const gameWinRef = useRef(gameWin);

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
        setSnakeSegments([{ x: 0, y: 0 }]);
        setDirection("right");
        setScore(1);
        setGameOver(false);
        const canvas = snakeCanvasRef.current;
        if (canvas) {
            foodPosition.current = getRandomFoodPosition(canvas, [{ x: 0, y: 0 }]);
        }
    };

    const drawSnake = (segments: Position[]) => {
        const canvas = snakeCanvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!ctx || !canvas) return;
        ctx.fillStyle = "green";
        segments.forEach((segment) => {
            ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
        });
    };

    const drawFood = (position: Position) => {
        const canvas = snakeCanvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!ctx || !canvas) return;
        ctx.fillStyle = "red";
        // ctx.fillRect(position.x, position.y, gridSize, gridSize);
        // ctx.fillRect(position.x + gridSize / 4, position.y + gridSize / 4, gridSize / 2, gridSize / 2);
        ctx.beginPath();
        ctx.arc(position.x + gridSize / 2, position.y + gridSize / 2, gridSize / 3, 0, Math.PI * 2);
        ctx.fill();
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
        foodPosition.current = getRandomFoodPosition(canvas, snakeSegments);
        draw(snakeSegments);
    }, []);

    useEffect(() => {
        draw(snakeSegments);
    }, [snakeSegments]);

    useEffect(() => {
        pendingDirectionRef.current = direction;
    }, [direction]);

    useEffect(() => {
        gameOverRef.current = gameOver;
    }, [gameOver]);

    useEffect(() => {
        gameWinRef.current = gameWin;
    }, [gameWin]);

    useEffect(() => {
        const moveSnake = () => {
            if (gameOverRef.current || gameWinRef.current) return;

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
                // mark this direction as applied so rapid input can't reverse into itself
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
                    setGameOver(true);
                    return prev;
                }
                if (score >= canvas.width * canvas.height / (gridSize * gridSize) - 1) {
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
        };

        const intervalId = window.setInterval(moveSnake, 200);
        return () => window.clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (gameOver || gameWin) {
                if (event.key === "Enter") {
                    resetGame();
                    return;
                }
            }

            const lastApplied = lastAppliedDirectionRef.current;
            const opposite = (a: string, b: string) =>
                (a === "left" && b === "right") ||
                (a === "right" && b === "left") ||
                (a === "up" && b === "down") ||
                (a === "down" && b === "up");

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
                if (!opposite(requested, lastApplied)) {
                    pendingDirectionRef.current = requested;
                    setDirection(requested);
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [gameOver, gameWin]);

    return (
        <>
            <h1 style={{ textAlign: "center" }}>Snake!</h1>
            <p style={{ textAlign: "center", color: "white" }}>Score: {score}</p>
            {gameOver && (
                <p style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", color: "tomato" }}>
                    Game over! Press Enter to restart.
                </p>
            )}
            {gameWin && (
                <p style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", color: "tomato" }}>
                    Oh wow, you won! I didn't expect that! Press Enter to play again.
                </p>
            )}
            <canvas
                id="snakeCanvas"
                width={20 * gridSize}
                height={20 * gridSize}
                style={{ backgroundColor: "black", display: "block", margin: "0 auto" }}
                ref={snakeCanvasRef}
            />
        </>
    );
}
