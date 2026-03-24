import { useState } from "react";
import "./App.css";
import Canvas from "./components/Canvas";
import Toolbar from "./components/Toolbar";

export type Mode = "brush" | "erase";

function App() {
	const [mode, setMode] = useState<Mode>("brush");
	return (
		<div className="app">
			<Toolbar setMode={setMode} />
			<Canvas width={400} height={600} mode={mode} />
		</div>
	);
}

export default App;
