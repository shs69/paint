import { forwardRef, useImperativeHandle } from "react";
import type { Mode } from "../App";
import useCanvas from "../hooks/useCanvas";

interface CanvasProps {
	width: number;
	height: number;
	mode: Mode;
	image: File | null;
}

export default forwardRef(function Canvas(props: CanvasProps, ref) {
	const { mode, image, width, height } = props;
	const cursor = mode === "brush" ? "brush_cursor" : "erase_cursor";
	const {
		bgRef,
		drawRef,
		startDrawing,
		stopDrawing,
		drawFn,
		undo,
		redo,
		download,
	} = useCanvas(mode, image);

	useImperativeHandle(ref, () => ({
		undo,
		redo,
		download,
	}));

	return (
		<div style={{ position: "relative", width, height }}>
			<canvas
				ref={bgRef}
				width={width}
				height={height}
				style={{ position: "absolute", top: 0, left: 0, touchAction: "none" }}
			/>
			<canvas
				className={cursor}
				ref={drawRef}
				width={width}
				height={height}
				onMouseDown={startDrawing}
				onMouseUp={stopDrawing}
				onMouseMove={drawFn}
				onTouchStart={startDrawing}
				onTouchEnd={stopDrawing}
				onTouchMove={drawFn}
				style={{ position: "absolute", top: 0, left: 0, touchAction: "none" }}
			/>
		</div>
	);
});
