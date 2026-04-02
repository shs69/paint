import "../App.css";
import { useRef } from "react";
import type { Mode } from "../App";

export default function Toolbar({
	setMode,
	setImage,
	onUndo,
	onRedo,
	download,
}: {
	setMode: (mode: Mode) => void;
	setImage: (image: File | null) => void;
	onUndo: () => void;
	onRedo: () => void;
	download: () => void;
}) {
	const inputRef = useRef<HTMLInputElement | null>(null);
	const handleImageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setImage(file);
		}
	};

	const clearImage = () => {
		if (inputRef.current) {
			inputRef.current.value = "";
			setImage(null);
		}
	};

	return (
		<div className="toolbar">
			Добавить изображение на холст:
			<div className="toolbar__background">
				<input type="file" onChange={handleImageInput} ref={inputRef} />
				<button
					type="button"
					className="toolbar_btn desctructive"
					onClick={clearImage}
				>
					Удалить
				</button>
			</div>
			<div className="toolbar__tools">
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
				<button type="button" className="toolbar_btn" onClick={onUndo}>
					Назад
				</button>
				<button type="button" className="toolbar_btn" onClick={onRedo}>
					Вперед
				</button>
				<button
					type="button"
					className="toolbar_btn desctructive"
					onClick={download}
				>
					Скачать холст
				</button>
			</div>
		</div>
	);
}
