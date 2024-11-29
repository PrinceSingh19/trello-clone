import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

const useBoardStore = create(
	persist(
		(set) => ({
			lists: [],
			//add new list
			addList: (title) =>
				set((state) => ({
					lists: [...state.lists, { id: uuidv4(), title, cards: [] }],
				})),

			// delete the list
			deleteList: (listId) =>
				set((state) => ({
					lists: state.lists.filter((list) => list.id !== listId),
				})),

			//update the list
			updateListTitle: (listId, newTitle) =>
				set((state) => ({
					lists: state.lists.map((list) =>
						list.id === listId ? { ...list, title: newTitle } : list
					),
				})),

			// add new card
			addCard: (listId, card) =>
				set((state) => ({
					lists: state.lists.map((list) =>
						list.id === listId
							? { ...list, cards: [...list.cards, { id: uuidv4(), ...card }] }
							: list
					),
				})),

			//update the exsiting card details
			updateCard: (listId, cardId, updatedCard) =>
				set((state) => ({
					lists: state.lists.map((list) =>
						list.id === listId
							? {
									...list,
									cards: list.cards.map((card) =>
										card.id === cardId ? { ...card, ...updatedCard } : card
									),
							  }
							: list
					),
				})),

			//delete the card details
			deleteCard: (listId, cardId) =>
				set((state) => ({
					lists: state.lists.map((list) =>
						list.id === listId
							? { ...list, cards: list.cards.filter((card) => card.id !== cardId) }
							: list
					),
				})),

			//reorder the lists
			reorderLists: (lists) => set({ lists }),
			//move the cards
			moveCard: (sourceListId, destinationListId, sourceIndex, destinationIndex) =>
				set((state) => {
					const newLists = [...state.lists];
					const sourceList = newLists.find((list) => list.id === sourceListId);
					const destList = newLists.find((list) => list.id === destinationListId);
					const [movedCard] = sourceList.cards.splice(sourceIndex, 1);
					destList.cards.splice(destinationIndex, 0, movedCard);
					return { lists: newLists };
				}),
			resetBoard: () => set({ lists: [] }),
		}),
		{
			name: "board-storage",
		}
	)
);

export default useBoardStore;
