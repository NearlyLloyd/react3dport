import { useEffect, useRef } from "react";


export function Paint() {

    const Canvas = () => {
        const canvasRef = useRef<HTMLCanvasElement>(null);
        const isDrawing = useRef(false);
        const lastPoint = useRef<{ x: number; y: number } | null>(null);
        const brushSize = 6;

        useEffect(() => {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext("2d");
            if (!ctx || !canvas) return;
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }, []);

        const getCanvasCoords = (event: React.MouseEvent<HTMLCanvasElement>) => {
            const canvas = canvasRef.current;
            if (!canvas) return null;
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            return {
                x: (event.clientX - rect.left) * scaleX,
                y: (event.clientY - rect.top) * scaleY,
            };
        };

        const startDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
            const pos = getCanvasCoords(event);
            if (!pos) return;
            isDrawing.current = true;
            lastPoint.current = pos;
            const ctx = canvasRef.current?.getContext("2d");
            if (!ctx) return;
            ctx.fillStyle = "black";
            ctx.fillRect(pos.x - brushSize / 2, pos.y - brushSize / 2, brushSize, brushSize);
        };

        const draw = (event: React.MouseEvent<HTMLCanvasElement>) => {
            if (!isDrawing.current) return;
            const pos = getCanvasCoords(event);
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext("2d");
            if (!ctx || !pos) return;
            ctx.strokeStyle = "black";
            ctx.lineWidth = brushSize;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.beginPath();
            if (lastPoint.current) {
                ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
            } else {
                ctx.moveTo(pos.x, pos.y);
            }
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
            lastPoint.current = pos;
        };

        const stopDrawing = () => {
            isDrawing.current = false;
            lastPoint.current = null;
        };
        const clearCanvas = () => {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext("2d");
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        };

        return (
            <>
            <div style={{width: "100%", height: "50px", backgroundColor: "rgb(0, 0, 0, 0.2)",margin: "0 0 20px 0", textAlign: "center"}}>
                
            </div>
                <canvas
                    ref={canvasRef}
                    width={800}
                    height={600}
                    style={{ border: "1px solid black", cursor: "crosshair" }}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                />
                <button onClick={clearCanvas} style={{ marginTop: "10px" }}>Clear</button>
            </>
        );
    }
    return (
        <>
            <Canvas />
        </>
    );


}