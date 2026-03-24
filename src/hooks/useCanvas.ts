import { useEffect, useRef, useState } from "react";
import type { Mode } from "../App";

type CanvasEvent =
	| React.MouseEvent<HTMLCanvasElement>
	| React.TouchEvent<HTMLCanvasElement>;

export default function useCanvas(mode: Mode) {
	const ref = useRef<HTMLCanvasElement | null>(null);
	const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
	const [isDrawing, setIsDrawing] = useState(false);

	useEffect(() => {
		const canvas = ref.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		ctx.lineCap = "round";
		ctx.lineJoin = "round";
		ctxRef.current = ctx;
		switch (mode) {
			case "brush": {
				ctxRef.current.globalCompositeOperation = "source-over";
				ctxRef.current.lineWidth = 2;
				break;
			}
			case "erase": {
				ctxRef.current.globalCompositeOperation = "destination-out";
				ctxRef.current.lineWidth = 20;
				break;
			}
		}
	}, [mode]);

	const getCoords = (e: CanvasEvent) => {
		if (!ref.current) return;
		const rect = ref.current.getBoundingClientRect();

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
		const ctx = ctxRef.current;
		if (!ctx) return;

		ctx.beginPath();
		const data = getCoords(e);
		if (!data) return;

		ctx.moveTo(data.x, data.y);
		setIsDrawing(true);
	};

	const stopDrawing = () => {
		ctxRef.current?.closePath();
		setIsDrawing(false);
	};

	const drawFn = (e: CanvasEvent) => {
		if (!isDrawing) return;
		const ctx = ctxRef.current;

		if (!ctx) return;
		const data = getCoords(e);
		if (!data) return;

		ctx.lineTo(data.x, data.y);
		ctx.stroke();
	};

	return { ref, startDrawing, stopDrawing, drawFn };
}
