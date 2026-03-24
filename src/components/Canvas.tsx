import type { Mode } from "../App";
import useCanvas from "../hooks/useCanvas";

interface CanvasProps {
	width: number;
	height: number;
	mode: Mode;
}

export default function Canvas(props: CanvasProps) {
	const { mode, ...rest } = props;
	const cursor = mode === "brush" ? "brush_cursor" : "erase_cursor";
	const { ref, startDrawing, stopDrawing, drawFn } = useCanvas(mode);

	return (
		<canvas
			className={cursor}
			onMouseDown={startDrawing}
			onMouseUp={stopDrawing}
			onMouseMove={drawFn}
			onTouchStart={startDrawing}
			onTouchEnd={stopDrawing}
			onTouchMove={drawFn}
			ref={ref}
			{...rest}
		/>
	);
}
