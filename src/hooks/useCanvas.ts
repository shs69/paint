import { useEffect, useRef, useState } from "react";
import type { Mode } from "../App";

type CanvasEvent =
	| React.MouseEvent<HTMLCanvasElement>
	| React.TouchEvent<HTMLCanvasElement>;

type CanvasCommand = {
	mode: "brush" | "erase";
	points: { x: number; y: number }[];
	lineWidth: number;
};

export default function useCanvas(mode: Mode, image: File | null) {
	const bgRef = useRef<HTMLCanvasElement | null>(null);
	const drawRef = useRef<HTMLCanvasElement | null>(null);

	const bgCtxRef = useRef<CanvasRenderingContext2D | null>(null);
	const drawCtxRef = useRef<CanvasRenderingContext2D | null>(null);

	const commandsRef = useRef<CanvasCommand[]>([]);
	const currentCommandRef = useRef<CanvasCommand | null>(null);
	const historyIndexRef = useRef<number>(0);

	const [isDrawing, setIsDrawing] = useState(false);

	useEffect(() => {
		const bgCanvas = bgRef.current;
		const drawCanvas = drawRef.current;
		if (!drawCanvas || !bgCanvas) return;

		const drawCtx = drawCanvas.getContext("2d");
		const bgCtx = bgCanvas.getContext("2d");
		if (!drawCtx || !bgCtx) return;

		drawCtx.lineCap = "round";
		drawCtx.lineJoin = "round";

		drawCtxRef.current = drawCtx;
		bgCtxRef.current = bgCtx;
	}, []);

	useEffect(() => {
		const bgCtx = bgCtxRef.current;
		const canvas = bgRef.current;
		if (!bgCtx || !canvas) return;
		if (!image) {
			bgCtx.clearRect(0, 0, canvas.width, canvas.height);
			return;
		}

		const img = new Image();
		img.src = URL.createObjectURL(image);

		img.onload = () => {
			bgCtx.clearRect(0, 0, canvas.width, canvas.height);
			bgCtx.drawImage(img, 0, 0, canvas.width, canvas.height);
			URL.revokeObjectURL(img.src);
		};
	}, [image]);

	const getCoords = (e: CanvasEvent) => {
		if (!drawRef.current) return;
		const rect = drawRef.current.getBoundingClientRect();

		if ("touches" in e && e.touches.length > 0) {
			return {
				x: e.touches[0].clientX - rect.left,
				y: e.touches[0].clientY - rect.top,
			};
		}

		return {
			x: (e as React.MouseEvent<HTMLCanvasElement>).clientX - rect.left,
			y: (e as React.MouseEvent<HTMLCanvasElement>).clientY - rect.top,
		};
	};

	const startDrawing = (e: CanvasEvent) => {
		const ctx = drawCtxRef.current;
		if (!ctx) return;

		switch (mode) {
			case "brush": {
				ctx.globalCompositeOperation = "source-over";
				ctx.lineWidth = 2;
				break;
			}
			case "erase": {
				ctx.globalCompositeOperation = "destination-out";
				ctx.lineWidth = 20;
				break;
			}
		}

		ctx.beginPath();
		const data = getCoords(e);
		if (!data) return;

		ctx.moveTo(data.x, data.y);
		currentCommandRef.current = {
			mode: mode,
			points: [{ x: data.x, y: data.y }],
			lineWidth: ctx.lineWidth,
		};
		setIsDrawing(true);
	};

	const stopDrawing = () => {
		drawCtxRef.current?.closePath();
		if (currentCommandRef.current) {
			commandsRef.current = commandsRef.current.slice(
				0,
				historyIndexRef.current,
			);
			commandsRef.current.push(currentCommandRef.current);
			historyIndexRef.current++;
		}
		setIsDrawing(false);
	};

	const drawFn = (e: CanvasEvent) => {
		if (!isDrawing) return;
		const ctx = drawCtxRef.current;

		if (!ctx) return;
		const data = getCoords(e);
		if (!data) return;

		ctx.lineTo(data.x, data.y);
		if (currentCommandRef.current) {
			currentCommandRef.current.points.push({ x: data.x, y: data.y });
		}
		ctx.stroke();
	};

	const redraw = () => {
		const ctx = drawCtxRef.current;
		const canvas = drawRef.current;
		if (!ctx || !canvas) return;

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		const commandsSlice = commandsRef.current.slice(0, historyIndexRef.current);

		commandsSlice.forEach((cmd) => {
			ctx.beginPath();
			ctx.globalCompositeOperation =
				cmd.mode === "brush" ? "source-over" : "destination-out";
			ctx.lineWidth = cmd.lineWidth;

			cmd.points.forEach((p, i) => {
				if (i === 0) {
					ctx.moveTo(p.x, p.y);
				} else {
					ctx.lineTo(p.x, p.y);
				}
			});
			ctx.stroke();
		});
	};

	const redo = () => {
		if (historyIndexRef.current >= commandsRef.current.length) return;
		historyIndexRef.current++;
		redraw();
	};

	const undo = () => {
		if (historyIndexRef.current <= 0) return;
		historyIndexRef.current--;
		redraw();
	};

	const download = () => {
		const tempCanvas = document.createElement("canvas");
		tempCanvas.width = bgRef.current?.width || 0;
		tempCanvas.height = bgRef.current?.height || 0;
		const tempCtx = tempCanvas.getContext("2d");

		if (bgRef.current) {
			tempCtx?.drawImage(bgRef.current, 0, 0);
		}

		if (drawRef.current) {
			tempCtx?.drawImage(drawRef.current, 0, 0);
		}

		tempCanvas.toBlob((blob) => {
			if (!blob) return;
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = "canvas.png";
			a.click();
			URL.revokeObjectURL(url);
		}, "image/png");
	};

	return {
		bgRef,
		drawRef,
		startDrawing,
		stopDrawing,
		drawFn,
		undo,
		redo,
		download,
	};
}
