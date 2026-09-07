import { useRef, useState } from "react";
import { GripVertical } from "lucide-react";

export default function DragReorderList({
  items,
  getKey,
  renderItem,
  onReorder,
}) {
  const itemRefs = useRef({});
  const dragStateRef = useRef(null);

  const [draggedId, setDraggedId] = useState(null);
  const [previewOrder, setPreviewOrder] = useState(null);

  const displayItems = previewOrder
    ? previewOrder
        .map((id) => items.find((item) => getKey(item) === id))
        .filter(Boolean)
    : items;

  function getCurrentOrder() {
    return items.map(getKey);
  }

  function getPreviewOrder(clientY) {
    const dragState = dragStateRef.current;

    if (!dragState) return;

    const currentOrder = dragState.previewOrder;
    const draggedId = dragState.itemId;

    const otherIds = currentOrder.filter((id) => id !== draggedId);

    let targetIndex = otherIds.length;

    for (let i = 0; i < otherIds.length; i++) {
      const element = itemRefs.current[otherIds[i]];

      if (!element) continue;

      const rect = element.getBoundingClientRect();
      const middle = rect.top + rect.height / 2;

      if (clientY < middle) {
        targetIndex = i;
        break;
      }
    }

    const nextOrder = [...otherIds];
    nextOrder.splice(targetIndex, 0, draggedId);

    // Avoid React update if nothing actually changed.
    let changed = false;

    for (let i = 0; i < nextOrder.length; i++) {
      if (nextOrder[i] !== currentOrder[i]) {
        changed = true;
        break;
      }
    }

    if (!changed) return;

    dragState.previewOrder = nextOrder;

    setPreviewOrder(nextOrder);
  }

  function handlePointerDown(event, itemId) {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    event.preventDefault();

    const order = getCurrentOrder();

    dragStateRef.current = {
      itemId,
      previewOrder: order,
      pointerId: event.pointerId,
      handle: event.currentTarget,
    };

    setDraggedId(itemId);
    setPreviewOrder(order);

    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event) {
    const dragState = dragStateRef.current;

    if (!dragState) return;

    if (event.pointerId !== dragState.pointerId) {
      return;
    }

    event.preventDefault();

    getPreviewOrder(event.clientY);
  }

  async function finishDrag(event) {
    const dragState = dragStateRef.current;

    if (!dragState) return;

    if (
      event?.pointerId !== undefined &&
      event.pointerId !== dragState.pointerId
    ) {
      return;
    }

    const finalOrder = dragState.previewOrder;
    const originalOrder = getCurrentOrder();

    // Release pointer capture before clearing the state.
    try {
      if (
        dragState.handle &&
        dragState.handle.hasPointerCapture(dragState.pointerId)
      ) {
        dragState.handle.releasePointerCapture(dragState.pointerId);
      }
    } catch {
      // Pointer capture may already have been released.
    }

    dragStateRef.current = null;

    setDraggedId(null);
    setPreviewOrder(null);

    if (!finalOrder || finalOrder.length === 0) {
      return;
    }

    let changed = false;

    for (let i = 0; i < finalOrder.length; i++) {
      if (finalOrder[i] !== originalOrder[i]) {
        changed = true;
        break;
      }
    }

    if (!changed) return;

    await onReorder(finalOrder);
  }

  function handlePointerCancel(event) {
    const dragState = dragStateRef.current;

    if (!dragState) return;

    try {
      if (
        dragState.handle &&
        dragState.handle.hasPointerCapture(dragState.pointerId)
      ) {
        dragState.handle.releasePointerCapture(dragState.pointerId);
      }
    } catch {
      // Ignore release errors.
    }

    dragStateRef.current = null;

    setDraggedId(null);
    setPreviewOrder(null);
  }

  return (
    <div className="w-full">
      {displayItems.map((item) => {
        const id = getKey(item);
        const isDragging = draggedId === id;

        return (
          <div
            key={id}
            ref={(element) => {
              if (element) {
                itemRefs.current[id] = element;
              } else {
                delete itemRefs.current[id];
              }
            }}
            style={{
              marginBottom: `${(item.mb ?? 0) * 4}px`,
            }}
            className={`
              relative
              transition-transform duration-150
              ${
                isDragging
                  ? `
                    z-50
                    opacity-90
                    scale-[1.02]
                    shadow-2xl
                    shadow-purple-500/30
                    ring-1
                    ring-purple-400/40
                  `
                  : ""
              }
            `}
          >
            {/* DRAG HANDLE */}
            <div
              onPointerDown={(event) => handlePointerDown(event, id)}
              onPointerMove={handlePointerMove}
              onPointerUp={finishDrag}
              onPointerCancel={handlePointerCancel}
              className={`
                absolute
                top-5
                -translate-y-1/2
                z-20
                p-1
                rounded
                select-none
                touch-none
                ${
                  isDragging
                    ? `
                      text-purple-200
                      bg-purple-500/30
                      scale-110
                      cursor-grabbing
                    `
                    : `
                      text-purple-400
                      cursor-grab
                      hover:bg-white/5
                      hover:text-purple-200
                    `
                }
              `}
              title="Déplacer le block"
            >
              <GripVertical size={18} />
            </div>

            {/* CONTENT */}
            {renderItem(item)}
          </div>
        );
      })}
    </div>
  );
}
