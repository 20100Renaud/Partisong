import { useState } from "react";
import { GripVertical } from "lucide-react";

export default function DragReorderList({
  items,
  getKey,
  renderItem,
  onReorder,
}) {
  const [dragIndex, setDragIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);

  function handleDragStart(index) {
    setDragIndex(index);
  }

  function handleDragOver(event, index) {
    event.preventDefault();

    if (index !== overIndex) {
      setOverIndex(index);
    }
  }

  function handleDrop(index) {
    if (dragIndex === null || dragIndex === index) {
      setDragIndex(null);
      setOverIndex(null);
      return;
    }

    const reordered = [...items];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(index, 0, moved);

    setDragIndex(null);
    setOverIndex(null);
    onReorder(reordered.map((item) => getKey(item)));
  }

  function handleDragEnd() {
    setDragIndex(null);
    setOverIndex(null);
  }

  return (
    <div className="drag-list">
      {items.map((item, index) => (
        <div
          key={getKey(item)}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(event) => handleDragOver(event, index)}
          onDrop={() => handleDrop(index)}
          onDragEnd={handleDragEnd}
          className={`drag-list__item ${
            dragIndex === index ? "is-dragging" : ""
          } ${overIndex === index && dragIndex !== index ? "is-over" : ""}`}
        >
          <span className="drag-list__handle" aria-hidden="true">
            <GripVertical size={18} />
          </span>

          <div className="drag-list__content">{renderItem(item, index)}</div>
        </div>
      ))}
    </div>
  );
}
