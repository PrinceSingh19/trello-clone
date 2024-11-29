import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FaPlus, FaTrash } from "react-icons/fa";
import Card from "./Card";
import useBoardStore from "../store/boardStore";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

function List({ list }) {
	const [newCardTitle, setNewCardTitle] = useState("");
	const [showInput, setShowInput] = useState(false);
	const { deleteList, addCard } = useBoardStore();

	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: list.id,
		data: {
			type: "list",
			list,
		},
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	// add new card here
	const handleAddCard = (e) => {
		e.preventDefault();
		if (newCardTitle.trim()) {
			addCard(list.id, {
				title: newCardTitle,
				description: "",
				dueDate: null,
			});
			setNewCardTitle("");
			setShowInput(false);
		}
	};

	// delete list here
	const handleDeleteList = (e) => {
		e.stopPropagation();
		deleteList(list.id);
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className="bg-gray-100 rounded-lg w-72 shrink-0 h-fit flex flex-col shadow-lg "
		>
			<div className="p-3 flex justify-between items-center">
				<div className="flex-1 cursor-move" {...attributes} {...listeners}>
					<h3 className="font-semibold text-gray-700">{list.title}</h3>
				</div>
				<button
					onClick={handleDeleteList}
					className="p-1.5 rounded hover:bg-gray-200 text-gray-500 hover:text-red-500"
				>
					<FaTrash size={14} />
				</button>
			</div>

			<div className="flex-1 overflow-y-auto px-3 pb-3">
				<SortableContext
					items={list.cards.map((card) => card.id)}
					strategy={verticalListSortingStrategy}
				>
					{list.cards.map((card, index) => (
						<Card key={card.id} card={card} listId={list.id} index={index} />
					))}
				</SortableContext>

				{showInput ? (
					<form onSubmit={handleAddCard}>
						<input
							type="text"
							value={newCardTitle}
							onChange={(e) => setNewCardTitle(e.target.value)}
							placeholder="Enter card title..."
							className="w-full p-2 rounded border border-gray-300 mb-2"
							autoFocus
						/>
						<div className="flex gap-2">
							<button
								type="submit"
								className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
							>
								Add Card
							</button>
							<button
								type="button"
								onClick={() => setShowInput(false)}
								className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50"
							>
								Cancel
							</button>
						</div>
					</form>
				) : (
					<button
						onClick={() => setShowInput(true)}
						className="flex items-center gap-2 text-gray-600 hover:bg-gray-200 w-full rounded p-2"
					>
						<FaPlus size={12} /> Add a card
					</button>
				)}
			</div>
		</div>
	);
}

export default List;
