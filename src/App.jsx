import Board from "./components/Board";
import useBoardStore from "./store/boardStore";

function App() {
	const { resetBoard } = useBoardStore();

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
			<header className="bg-white/10 backdrop-blur-sm shadow-lg">
				<div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
					<h1 className="text-2xl font-bold text-white">Trello Clone</h1>
					<div className="flex items-center gap-4">
						<button
							onClick={resetBoard}
							className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
						>
							Reset Board
						</button>
					</div>
				</div>
			</header>

			<main className="max-w-7xl mx-auto px-4 py-8">
				<Board />
			</main>
		</div>
	);
}

export default App;
