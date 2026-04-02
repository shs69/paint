import { useEffect, useRef, useState } from "react";
import "./App.css";
import Canvas from "./components/Canvas";
import Toolbar from "./components/Toolbar";

export type Mode = "brush" | "erase";

function App() {
	const [mode, setMode] = useState<Mode>("brush");
	const [img, setImg] = useState<File | null>(null);
	const canvasRef = useRef<{
		undo: () => void;
		redo: () => void;
		download: () => void;
	} | null>(null);

	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.ctrlKey || e.metaKey) {
				if (e.key.toLowerCase() === "z") {
					e.preventDefault();

					if (e.shiftKey) {
						console.log("shift");
						canvasRef.current?.redo();
					} else {
						canvasRef.current?.undo();
					}
				}

				if (e.key === "y") {
					canvasRef.current?.redo();
				}
			}
		};

		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, []);

	return (
		<div className="app">
			<Toolbar
				setMode={setMode}
				onUndo={() => canvasRef.current?.undo()}
				onRedo={() => canvasRef.current?.redo()}
				download={() => canvasRef.current?.download()}
				setImage={setImg}
			/>
			<Canvas
				width={400}
				height={600}
				mode={mode}
				ref={canvasRef}
				image={img}
			/>
		</div>
	);
}

export default App;
