import { useState, useEffect } from "react";
import useBoardStore from "../store/boardStore";
import { FaTimes } from "react-icons/fa";

function CardModal({ isOpen, onClose, card, listId }) {
	const [title, setTitle] = useState(card.title);
	const [description, setDescription] = useState(card.description || "");
	const [dueDate, setDueDate] = useState(card.dueDate || "");
	const { updateCard } = useBoardStore();

	useEffect(() => {
		if (isOpen) {
			setTitle(card.title);
			setDescription(card.description || "");
			setDueDate(card.dueDate || "");
		}
	}, [card, isOpen]);

	if (!isOpen) return null;

	//submit the edit card modal
	const handleSubmit = (e) => {
		e.preventDefault();
		updateCard(listId, card.id, {
			title: title.trim(),
			description: description.trim(),
			dueDate: dueDate || null,
		});
		onClose();
	};

	const handleOverlayClick = (e) => {
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	return (
		<div
			className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
			onClick={handleOverlayClick}
		>
			<div className="bg-white rounded-lg p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-semibold">Edit Card</h2>
					<button
						onClick={onClose}
						className="text-gray-500 hover:text-gray-700 p-2"
						aria-label="Close modal"
					>
						<FaTimes />
					</button>
				</div>

				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
							Title
						</label>
						<input
							id="title"
							type="text"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							required
						/>
					</div>

					<div className="mb-4">
						<label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
							Description
						</label>
						<textarea
							id="description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className="w-full p-2 border rounded h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>

					<div className="mb-4">
						<label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
							Due Date
						</label>
						<input
							id="dueDate"
							type="date"
							value={dueDate}
							onChange={(e) => setDueDate(e.target.value)}
							className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>

					<div className="flex justify-end gap-2">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 border rounded hover:bg-gray-50"
						>
							Cancel
						</button>
						<button
							type="submit"
							className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
						>
							Save
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default CardModal;
