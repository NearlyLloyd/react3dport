import { useEffect, useRef, useState } from "react";
import Window from "../window";

export function Paint() {


    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isDrawing = useRef(false);
    const lastPoint = useRef<{ x: number; y: number } | null>(null);
    const [brushSize, setBrushSize] = useState(10);
    const [color, setColor] = useState("black");
    const [tool, setTool] = useState("Pencil");
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
    };

    const draw = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing.current) return;
        const pos = getCanvasCoords(event);
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!ctx || !pos) return;
        if (tool === "Spray Can" && canvas) {
            for (let i = 0; i < brushSize * 2; i++) {
                const offsetX = (Math.random() - 0.5) * brushSize * 2;
                const offsetY = (Math.random() - 0.5) * brushSize * 2;
                if (Math.sqrt(offsetX * offsetX + offsetY * offsetY) < brushSize) {
                    ctx.fillStyle = color;
                    ctx.fillRect(pos.x + offsetX, pos.y + offsetY, 1, 1);
                }
            }
            return;
        }
        if(tool === "Smiley") {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, brushSize, 0, Math.PI * 2);
            ctx.fill();
                ctx.beginPath();
                ctx.arc(pos.x - brushSize / 3, pos.y - brushSize / 3, brushSize / 5, 0, Math.PI * 2);
                ctx.arc(pos.x + brushSize / 3, pos.y - brushSize / 3, brushSize / 5, 0, Math.PI * 2);
                ctx.fillStyle = "white";
                ctx.fill();
                ctx.beginPath();
                ctx.arc(pos.x, pos.y + brushSize / 3, brushSize / 2.5, 0, Math.PI);
                ctx.fillStyle = "white";
                ctx.fill();
            return;
        }
        ctx.strokeStyle = color;
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
    const downloadImage = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const link = document.createElement("a");
        link.download = "my-portfolio-drawing" + ".png";
        link.href = canvas.toDataURL();
        link.click();
    };
    return (
        <>
            <div style={{ width: "100%", height: "50px", backgroundColor: "rgb(0, 0, 0, 0.2)", margin: "0 0 20px 0", textAlign: "center" }}>
                <label htmlFor="Brushsize" style={{ marginRight: "10px", fontSize: "25px" }}>Size:</label>
                <select style={{ fontSize: "25px", margin: "5px" }} id="Brushsize" value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))}>
                    <option style={{ fontSize: "15px" }}>2</option>
                    <option style={{ fontSize: "15px" }}>5</option>
                    <option style={{ fontSize: "15px" }}>10</option>
                    <option style={{ fontSize: "15px" }}>20</option>
                    <option style={{ fontSize: "15px" }}>30</option>
                    <option style={{ fontSize: "15px" }}>50</option>
                </select>
                <label htmlFor="Color" style={{ marginRight: "10px", fontSize: "25px" }}>Color:</label>
                <select style={{ fontSize: "25px", margin: "5px" }} id="Color" value={color} onChange={(e) => setColor(e.target.value)}>
                    <option style={{ fontSize: "15px" }}>black</option>
                    <option style={{ fontSize: "15px" }}>white</option>
                    <option style={{ fontSize: "15px" }}>red</option>
                    <option style={{ fontSize: "15px" }}>blue</option>
                    <option style={{ fontSize: "15px" }}>green</option>
                    <option style={{ fontSize: "15px" }}>yellow</option>
                    <option style={{ fontSize: "15px" }}>purple</option>
                    <option style={{ fontSize: "15px" }}>pink</option>
                </select>
                <label htmlFor="Tool" style={{ marginRight: "10px", fontSize: "25px" }}>Tool:</label>
                <select style={{ fontSize: "25px", margin: "5px" }} id="Tool" value={tool} onChange={(e) => setTool(e.target.value)}>
                    <option style={{ fontSize: "15px" }}>Pencil</option>
                    <option style={{ fontSize: "15px" }}>Spray Can</option>
                    <option style={{ fontSize: "15px" }}>Smiley</option>
                </select>

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
            <br></br>
            <button onClick={clearCanvas} style={{ marginTop: "10px", width: "140px", height: "30px", fontSize: "25px" }}>Clear</button>
            <button onClick={downloadImage} style={{ marginTop: "10px", width: "140px", height: "30px", fontSize: "25px" }}>Download</button>
        </>
    );


}