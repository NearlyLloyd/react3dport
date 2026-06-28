import { useEffect, useRef, useState } from "react";

const DEFAULT_COLORS = ["black", "white", "red", "blue", "green", "yellow", "purple", "pink"];

function hexToRgb(hex: string) {
    const normalized = hex.trim().replace(/^#/, "");
    if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(normalized)) return null;
    const fullHex = normalized.length === 3
        ? normalized.split("").map((character) => character + character).join("")
        : normalized;
    const value = Number.parseInt(fullHex, 16);
    return {
        r: (value >> 16) & 255,
        g: (value >> 8) & 255,
        b: value & 255,
    };
}

function rgbToHsv(r: number, g: number, b: number) {
    const red = r / 255;
    const green = g / 255;
    const blue = b / 255;
    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    const delta = max - min;

    let hue = 0;
    if (delta !== 0) {
        if (max === red) hue = 60 * (((green - blue) / delta) % 6);
        else if (max === green) hue = 60 * ((blue - red) / delta + 2);
        else hue = 60 * ((red - green) / delta + 4);
    }

    if (hue < 0) hue += 360;

    const saturation = max === 0 ? 0 : delta / max;
    return { h: hue, s: saturation * 100, v: max * 100 };
}

function hsvToHex(h: number, s: number, v: number) {
    const saturation = s / 100;
    const value = v / 100;
    const chroma = value * saturation;
    const match = value - chroma;
    const secondary = chroma * (1 - Math.abs(((h / 60) % 2) - 1));

    let red = 0;
    let green = 0;
    let blue = 0;

    if (h >= 0 && h < 60) {
        red = chroma;
        green = secondary;
    } else if (h < 120) {
        red = secondary;
        green = chroma;
    } else if (h < 180) {
        green = chroma;
        blue = secondary;
    } else if (h < 240) {
        green = secondary;
        blue = chroma;
    } else if (h < 300) {
        red = secondary;
        blue = chroma;
    } else {
        red = chroma;
        blue = secondary;
    }

    const toHex = (component: number) => Math.round((component + match) * 255).toString(16).padStart(2, "0");
    return `#${toHex(red)}${toHex(green)}${toHex(blue)}`;
}

export function Paint() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isDrawing = useRef(false);
    const lastPoint = useRef<{ x: number; y: number } | null>(null);
    const historyRef = useRef<string[]>([]);
    const redoRef = useRef<string[]>([]);
    const maxHistory = 20;

    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);
    const [brushSize, setBrushSize] = useState(10);
    const [color, setColor] = useState(DEFAULT_COLORS[0]);
    const [paletteColors, setPaletteColors] = useState(DEFAULT_COLORS);
    const [tool, setTool] = useState("Pencil");

    const initialPicker = hexToRgb("#ff8800");
    const initialHsv = initialPicker ? rgbToHsv(initialPicker.r, initialPicker.g, initialPicker.b) : { h: 30, s: 100, v: 100 };
    const [pickerColor, setPickerColor] = useState("#ff8800");
    const [pickerHue, setPickerHue] = useState(initialHsv.h);
    const [pickerSaturation, setPickerSaturation] = useState(initialHsv.s);
    const [pickerValue, setPickerValue] = useState(initialHsv.v);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!ctx || !canvas) return;
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }, []);

    function CustomSelect<T extends string | number>(props: {
        options: T[];
        value: T;
        onChange: (v: T) => void;
        style?: React.CSSProperties;
        id?: string;
    }) {
        const { options, value, onChange, style, id } = props;
        const [open, setOpen] = useState(false);
        const [hovered, setHovered] = useState<T | null>(null);
        const ref = useRef<HTMLDivElement | null>(null);

        useEffect(() => {
            const handle = (event: MouseEvent) => {
                if (!ref.current) return;
                if (!ref.current.contains(event.target as Node)) setOpen(false);
            };

            window.addEventListener("mousedown", handle);
            return () => window.removeEventListener("mousedown", handle);
        }, []);

        return (
            <div ref={ref} style={{ display: "inline-block", position: "relative" }} id={id}>
                <button
                    onClick={() => setOpen((current) => !current)}
                    style={{ fontSize: 25, margin: 5, padding: "4px 10px", cursor: "pointer", ...style }}
                    aria-haspopup="listbox"
                    aria-expanded={open}
                >
                    {String(value)}
                </button>
                {open && (
                    <ul
                        role="listbox"
                        style={{
                            position: "absolute",
                            left: 0,
                            top: "100%",
                            background: "#fff",
                            border: "2px solid #000",
                            margin: 0,
                            padding: 0,
                            listStyle: "none",
                            zIndex: 10000,
                            boxSizing: "border-box",
                            minWidth: "100%",
                        }}
                    >
                        {options.map((option) => (
                            <li
                                key={String(option)}
                                role="option"
                                onClick={() => {
                                    onChange(option as T);
                                    setOpen(false);
                                }}
                                onMouseEnter={() => setHovered(option)}
                                onMouseLeave={() => setHovered(null)}
                                style={{ padding: "6px 10px", cursor: "pointer", background: hovered === option ? "#e0e0e0" : "transparent" }}
                            >
                                {String(option)}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    }

    function InlineColorSidebar(props: {
        colors: string[];
        value: string;
        onChange: (c: string) => void;
        pickerColor: string;
        pickerHue: number;
        pickerSaturation: number;
        pickerValue: number;
        onPickerColorChange: (c: string) => void;
        onPickerHueChange: (h: number) => void;
        onPickerSVChange: (s: number, v: number) => void;
        onAddColor: (c: string) => void;
    }) {
        const {
            colors,
            value,
            onChange,
            pickerColor,
            pickerHue,
            pickerSaturation,
            pickerValue,
            onPickerColorChange,
            onPickerHueChange,
            onPickerSVChange,
            onAddColor,
        } = props;

        const saturationBackground = `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, hsl(${pickerHue}, 100%, 50%))`;
        const previewColor = hexToRgb(pickerColor) ? pickerColor : hsvToHex(pickerHue, pickerSaturation, pickerValue);
        const canAddColor = hexToRgb(pickerColor) !== null;

        const syncPickerFromHex = (nextColor: string) => {
            onPickerColorChange(nextColor);
            const rgb = hexToRgb(nextColor);
            if (!rgb) return;
            const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
            onPickerHueChange(hsv.h);
            onPickerSVChange(hsv.s, hsv.v);
        };

        const handleSaturationPointer = (event: React.PointerEvent<HTMLDivElement>) => {
            const rect = event.currentTarget.getBoundingClientRect();
            const saturation = Math.min(100, Math.max(0, ((event.clientX - rect.left) / rect.width) * 100));
            const value = Math.min(100, Math.max(0, (1 - (event.clientY - rect.top) / rect.height) * 100));
            event.currentTarget.setPointerCapture(event.pointerId);
            onPickerSVChange(saturation, value);
            onPickerColorChange(hsvToHex(pickerHue, saturation, value));
        };

        const handleSaturationPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
            if (event.buttons === 0) return;
            handleSaturationPointer(event);
        };

        return (
            <div style={{ width: 240, display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ padding: 10, boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 12, background: "#c0c0c0", borderTop: "4px solid #fff", borderLeft: "4px solid #fff", borderRight: "2px solid #000", borderBottom: "2px solid #000" }}>
                    <div style={{ fontSize: 16, fontWeight: 700, textAlign: "center" }}>Palette</div>

                    <div style={{ width: "100%", display: "grid", gridTemplateColumns: "repeat(2, 52px)", gap: 10, justifyContent: "center" }}>
                        {colors.map((swatch) => (
                            <button
                                key={swatch}
                                type="button"
                                onClick={() => onChange(swatch)}
                                title={swatch}
                                aria-pressed={value === swatch}
                                style={{
                                    width: 52,
                                    height: 30,
                                    background: swatch,
                                    cursor: "pointer",
                                    boxSizing: "border-box",
                                    borderTop: value === swatch ? "3px solid #000" : "2px solid #fff",
                                    borderLeft: value === swatch ? "3px solid #000" : "2px solid #fff",
                                    borderRight: "2px solid #000",
                                    borderBottom: "2px solid #000",
                                    padding: 0,
                                    outline: value === swatch ? "2px solid #000" : "none",
                                    outlineOffset: 1,
                                }}
                            />
                        ))}
                    </div>
                </div>

                <div style={{ padding: 10, boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 10, background: "#c0c0c0", borderTop: "4px solid #fff", borderLeft: "4px solid #fff", borderRight: "2px solid #000", borderBottom: "2px solid #000" }}>
                    <div style={{ fontSize: 16, fontWeight: 700, textAlign: "center" }}>Custom Picker</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 36, height: 36, border: "2px solid #000", background: previewColor, flexShrink: 0 }} aria-label="Current custom color preview" />
                        <div style={{ fontSize: 14, lineHeight: 1.2 }}>
                            <div style={{ fontWeight: 700 }}>Custom color</div>
                            <div>{previewColor.toUpperCase()}</div>
                        </div>
                    </div>

                    <div
                        onPointerDown={handleSaturationPointer}
                        onPointerMove={handleSaturationPointerMove}
                        style={{ position: "relative", width: "100%", aspectRatio: "1 / 1", minHeight: 180, border: "2px solid #000", background: saturationBackground, cursor: "crosshair", touchAction: "none" }}
                        aria-label="Color saturation and brightness picker"
                    >
                        <div
                            style={{
                                position: "absolute",
                                left: `${pickerSaturation}%`,
                                top: `${100 - pickerValue}%`,
                                width: 12,
                                height: 12,
                                borderRadius: "50%",
                                transform: "translate(-50%, -50%)",
                                border: "2px solid #000",
                                boxShadow: "0 0 0 2px #fff",
                                pointerEvents: "none",
                            }}
                        />
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 12, width: 32, flexShrink: 0 }}>Hue</span>
                        <input
                            type="range"
                            min={0}
                            max={360}
                            value={pickerHue}
                            onChange={(event) => {
                                const nextHue = Number(event.target.value);
                                onPickerHueChange(nextHue);
                                onPickerColorChange(hsvToHex(nextHue, pickerSaturation, pickerValue));
                            }}
                            style={{ flex: 1 }}
                            aria-label="Hue slider"
                        />
                    </div>

                    <input
                        type="text"
                        value={pickerColor}
                        onChange={(event) => syncPickerFromHex(event.target.value)}
                        aria-label="Custom color hex value"
                        style={{ width: "100%", boxSizing: "border-box", height: 32, padding: "4px 6px", border: "2px solid #000", background: "#fff" }}
                    />

                    <button
                        type="button"
                        onClick={() => {
                            if (!canAddColor) return;
                            onAddColor(pickerColor);
                        }}
                        disabled={!canAddColor}
                        style={{ width: "100%", height: 32, cursor: canAddColor ? "pointer" : "not-allowed", boxSizing: "border-box", borderTop: "2px solid #fff", borderLeft: "2px solid #fff", borderRight: "2px solid #000", borderBottom: "2px solid #000", background: "#e6e6e6", fontWeight: 700, opacity: canAddColor ? 1 : 0.7 }}
                    >
                        Add to Palette
                    </button>
                </div>
            </div>
        );
    }

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
        const canvas = canvasRef.current;
        if (canvas) {
            try {
                const dataUrl = canvas.toDataURL();
                historyRef.current.push(dataUrl);
                if (historyRef.current.length > maxHistory) {
                    historyRef.current.shift();
                }
                redoRef.current = [];
                setCanRedo(false);
                setCanUndo(historyRef.current.length > 0);
            } catch {
                // ignore
            }
        }

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

        if (tool === "Smiley") {
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

    const undo = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;
        const history = historyRef.current;
        if (history.length === 0) return;

        try {
            const current = canvas.toDataURL();
            redoRef.current.push(current);
            if (redoRef.current.length > maxHistory) redoRef.current.shift();
            setCanRedo(true);
        } catch {
            // ignore
        }

        const dataUrl = history.pop()!;
        const image = new Image();
        image.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        };
        image.src = dataUrl;
        setCanUndo(historyRef.current.length > 0);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!ctx || !canvas) return;

        try {
            const dataUrl = canvas.toDataURL();
            historyRef.current.push(dataUrl);
            if (historyRef.current.length > maxHistory) historyRef.current.shift();
            setCanUndo(true);
        } catch {
            // ignore
        }

        redoRef.current = [];
        setCanRedo(false);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const redo = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;
        const redoStack = redoRef.current;
        if (redoStack.length === 0) return;

        try {
            const current = canvas.toDataURL();
            historyRef.current.push(current);
            if (historyRef.current.length > maxHistory) historyRef.current.shift();
            setCanUndo(true);
        } catch {
            // ignore
        }

        const dataUrl = redoStack.pop()!;
        const image = new Image();
        image.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        };
        image.src = dataUrl;
        setCanRedo(redoRef.current.length > 0);
    };

    useEffect(() => {
        const handler = (event: KeyboardEvent) => {
            if (event.ctrlKey && !event.altKey) {
                const key = event.key.toLowerCase();
                if (key === "z" && !event.shiftKey) {
                    event.preventDefault();
                    undo();
                } else if (key === "y" || (key === "z" && event.shiftKey)) {
                    event.preventDefault();
                    redo();
                }
            }
        };

        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    const downloadImage = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const link = document.createElement("a");
        link.download = "my-portfolio-drawing.png";
        link.href = canvas.toDataURL();
        link.click();
    };

    const addPaletteColor = (nextColor: string) => {
        setPaletteColors((currentColors) => (currentColors.includes(nextColor) ? currentColors : [...currentColors, nextColor]));
        setColor(nextColor);
    };

    return (
        <>
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <InlineColorSidebar
                    colors={paletteColors}
                    value={color}
                    onChange={(nextColor) => setColor(nextColor)}
                    pickerColor={pickerColor}
                    pickerHue={pickerHue}
                    pickerSaturation={pickerSaturation}
                    pickerValue={pickerValue}
                    onPickerColorChange={setPickerColor}
                    onPickerHueChange={setPickerHue}
                    onPickerSVChange={(nextSaturation, nextValue) => {
                        setPickerSaturation(nextSaturation);
                        setPickerValue(nextValue);
                    }}
                    onAddColor={addPaletteColor}
                />

                <div style={{ flex: 1 }}>
                    <div style={{ width: "100%", minHeight: 50, backgroundColor: "rgb(0, 0, 0, 0.2)", margin: "0 0 20px 0", textAlign: "center", padding: 6, boxSizing: "border-box" }}>
                        <label htmlFor="Brushsize" style={{ marginRight: 10, fontSize: 25 }}>Size:</label>
                        <CustomSelect id="Brushsize" options={[2, 5, 10, 20, 30, 50]} value={brushSize} onChange={(nextSize) => setBrushSize(Number(nextSize))} />
                        <label htmlFor="Tool" style={{ marginRight: 10, fontSize: 25 }}>Tool:</label>
                        <CustomSelect id="Tool" options={["Pencil", "Spray Can", "Smiley"]} value={tool} onChange={(nextTool) => setTool(String(nextTool))} />
                    </div>

                    <canvas
                        ref={canvasRef}
                        width={920}
                        height={680}
                        style={{ border: "1px solid black", cursor: "crosshair" }}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                    />
                </div>
            </div>

            <br />
            <button onClick={clearCanvas} style={{ marginTop: 10, width: 140, height: 30, fontSize: 25 }}>Clear</button>
            <button onClick={undo} disabled={!canUndo} style={{ marginTop: 10, width: 140, height: 30, fontSize: 25, marginLeft: 10 }}>Undo</button>
            <button onClick={redo} disabled={!canRedo} style={{ marginTop: 10, width: 140, height: 30, fontSize: 25, marginLeft: 10 }}>Redo</button>
            <button onClick={downloadImage} style={{ marginTop: 10, width: 140, height: 30, fontSize: 25, marginLeft: 10 }}>Download</button>
        </>
    );
}
