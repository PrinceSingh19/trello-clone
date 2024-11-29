import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FaClock, FaEdit, FaTrash } from "react-icons/fa";
import useBoardStore from "../store/boardStore";
import CardModal from "./CardModal";
import { format } from "date-fns";

function Card({ card, listId, index }) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { deleteCard } = useBoardStore();

	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: card.id,
		data: {
			type: "card",
			card,
			listId,
			index,
		},
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	//delete the card
	const handleDelete = () => {
		console.log("hi");

		deleteCard(listId, card.id);
	};

	//edit the card
	const handleEdit = () => {
		setIsModalOpen(true);
	};

	return (
		<div className="relative">
			<div
				ref={setNodeRef}
				style={style}
				{...attributes}
				{...listeners}
				className="bg-white rounded p-3 shadow cursor-move group mb-2 relative"
			>
				<div className="flex justify-between items-start gap-2">
					<div className="flex-1 pr-12">
						<h4 className="text-sm font-medium text-gray-700">{card.title}</h4>
						{card.description && (
							<p className="text-xs text-gray-500 mt-1 line-clamp-2">{card.description}</p>
						)}
						{card.dueDate && (
							<div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
								<FaClock size={12} />
								<span>{format(new Date(card.dueDate), "MMM d, yyyy")}</span>
							</div>
						)}
					</div>
				</div>
			</div>

			{isModalOpen && (
				<CardModal
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					card={card}
					listId={listId}
				/>
			)}
			<div className="absolute top-2 right-2 flex gap-1">
				<button
					onClick={handleEdit}
					className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-blue-500"
				>
					<FaEdit size={12} />
				</button>
				<button
					onClick={handleDelete}
					className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-red-500"
				>
					<FaTrash size={12} />
				</button>
			</div>
		</div>
	);
}

export default Card;
