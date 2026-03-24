import "../App.css";
import type { Mode } from "../App";

export default function Toolbar({
	setMode,
}: {
	setMode: (mode: Mode) => void;
}) {
	return (
		<div className="toolbar">
			<button
				type="button"
				className="toolbar_btn"
				onClick={() => setMode("brush")}
			>
				Кисть
			</button>
			<button
				type="button"
				className="toolbar_btn"
				onClick={() => setMode("erase")}
			>
				Ластик
			</button>
		</div>
	);
}
