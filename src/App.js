import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const onDragEnd = (result, containers, setContainers) => {
	if (!result.destination) return;
	const { source, destination } = result;

	const [sourceContainer] = containers.filter(c => c._id === source.droppableId);
	const sourceTodos = [...sourceContainer.todos];
	const [removed] = sourceTodos.splice(source.index, 1);
	sourceContainer.todos = sourceTodos;

	if (source.droppableId !== destination.droppableId) {
		const [destinationContainer] = containers.filter(c => c._id === destination.droppableId);
		const destTodos = [...destinationContainer.todos];
		destTodos.splice(destination.index, 0, removed);
		destinationContainer.todos = destTodos;
	} else {
		sourceTodos.splice(destination.index, 0, removed);
	}
	const containersCopy = [...containers];
	setContainers([...containersCopy]);
};

function App() {
	const [containers, setContainers] = useState([]);
	useEffect(() => {
		const fetchData = async () => {
			const result = await axios.get(`${process.env.REACT_APP_API_URL}/api/container/all/5f8f3d9ca2595559f0f311ea`);
			setContainers(result.data);
		};
		fetchData();
	}, []);

	return (
		<div style={{ display: 'flex', justifyContent: 'center', height: '100%' }}>
			<DragDropContext onDragEnd={result => onDragEnd(result, containers, setContainers)}>
				{containers.map(container => (
					<Droppable key={container._id} droppableId={container._id}>
						{provided => {
							return (
								<div
									className="container"
									{...provided.props}
									ref={provided.innerRef}
									style={{
										backgroundColor: 'lightblue',
										padding: 4,
										width: 250,
										minHeight: 500,
										margin: '0 10px',
									}}
								>
									{container.todos.map((todo, index) => (
										<Draggable key={todo._id} draggableId={todo._id} index={index}>
											{(provided, snapshot) => (
												<div
													ref={provided.innerRef}
													{...provided.draggableProps}
													{...provided.dragHandleProps}
													style={{
														userSelect: 'none',
														padding: 16,
														margin: '0 0 8px 0',
														minHeight: '50px',
														backgroundColor: snapshot.isDragging ? '#264b4a' : '#456c86',
														color: 'white',
														...provided.draggableProps.style,
													}}
												>
													{`${todo._id}`}
												</div>
											)}
										</Draggable>
									))}
									{provided.placeholder}
								</div>
							);
						}}
					</Droppable>
				))}
			</DragDropContext>
		</div>
	);
}

export default App;
