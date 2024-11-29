import { useState } from "react";
import { DndContext, DragOverlay, closestCorners } from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import List from "./List";
import { createPortal } from "react-dom";
import useBoardStore from "../store/boardStore";
import { FaPlus } from "react-icons/fa";
import Card from "./Card";

function Board() {
	const { lists, addList, reorderLists, moveCard } = useBoardStore();
	const [activeCard, setActiveCard] = useState(null);
	const [activeList, setActiveList] = useState(null);
	const [newListTitle, setNewListTitle] = useState("");
	const [showInput, setShowInput] = useState(false);

	//handle the drag start here
	const handleDragStart = (event) => {
		if (event.active.data.current?.type === "card") {
			setActiveCard(event.active.data.current.card);
		} else if (event.active.data.current?.type === "list") {
			setActiveList(event.active.data.current.list);
		}
	};

	//handle the drag end here
	const handleDragEnd = (event) => {
		setActiveCard(null);
		setActiveList(null);

		const { active, over } = event;
		if (!over) return;

		if (active.data.current?.type === "card") {
			const activeListId = active.data.current.listId;
			const overListId = over.data.current?.listId || over.id;
			const activeIndex = active.data.current.index;
			const overIndex = over.data.current?.index || 0;

			moveCard(activeListId, overListId, activeIndex, overIndex);
		} else if (active.data.current?.type === "list" && active.id !== over.id) {
			const oldIndex = lists.findIndex((list) => list.id === active.id);
			const newIndex = lists.findIndex((list) => list.id === over.id);
			const newLists = [...lists];
			const [movedList] = newLists.splice(oldIndex, 1);
			newLists.splice(newIndex, 0, movedList);
			reorderLists(newLists);
		}
	};

	// adding the new list
	const handleAddList = (e) => {
		e.preventDefault();
		if (newListTitle.trim()) {
			addList(newListTitle);
			setNewListTitle("");
			setShowInput(false);
		}
	};

	return (
		<DndContext
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
			collisionDetection={closestCorners}
		>
			<div className="flex gap-4 p-4 overflow-x-auto min-h-[calc(100vh-theme(spacing.32))] scrollable">
				<SortableContext
					items={lists.map((list) => list.id)}
					strategy={horizontalListSortingStrategy}
				>
					{lists.map((list) => (
						<List key={list.id} list={list} />
					))}
				</SortableContext>

				<div className="w-72 shrink-0">
					{showInput ? (
						<form
							onSubmit={handleAddList}
							className="bg-white/50 backdrop-blur-sm rounded-lg p-3 shadow-lg"
						>
							<input
								type="text"
								value={newListTitle}
								onChange={(e) => setNewListTitle(e.target.value)}
								placeholder="Enter list title..."
								className="w-full p-2 rounded border border-gray-300 mb-2"
								autoFocus
							/>
							<div className="flex gap-2">
								<button
									type="submit"
									className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
								>
									Add List
								</button>
								<button
									type="button"
									onClick={() => setShowInput(false)}
									className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 bg-white"
								>
									Cancel
								</button>
							</div>
						</form>
					) : (
						<button
							onClick={() => setShowInput(true)}
							className="bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-colors w-full rounded-lg p-3 flex items-center gap-2 text-gray-600 shadow-lg"
						>
							<FaPlus /> Add another list
						</button>
					)}
				</div>
			</div>

			{createPortal(
				<DragOverlay>
					{activeCard && <Card card={activeCard} />}
					{activeList && <List list={activeList} />}
				</DragOverlay>,
				document.body
			)}
		</DndContext>
	);
}

export default Board;
