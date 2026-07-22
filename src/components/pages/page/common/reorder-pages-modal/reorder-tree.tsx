import { IconButton } from "@chakra-ui/react";
import {
  closestCenter,
  defaultDropAnimationSideEffects,
  DndContext,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { LuCircleMinus, LuCirclePlus } from "react-icons/lu";

import usePages from "../sidebar/use-pages-sidebar";

type PageTreeItem = {
  id: string;
  title: string;
  children?: PageTreeItem[];
};

type FlatTreeItem = {
  id: string;
  title: string;
  depth: number;
  hasChildren: boolean;
};

type ComputedItem = FlatTreeItem & {
  isLast: boolean;
  activeSpines: boolean[];
  hidden: boolean;
};

type LineConfig = {
  x: number;
  top: number | string;
  bottom: number | string;
};

// --- 2. STYLING CONSTANTS ---
const INDENT = 44;
const LINE_COLOR = "#000000";
const BOX_BORDER_COLOR = "#cccccc";

function flattenTree(items: PageTreeItem[], depth = 0): FlatTreeItem[] {
  return items.reduce<FlatTreeItem[]>((acc, item) => {
    acc.push({
      id: item.id,
      title: item.title,
      depth,
      hasChildren: !!item.children?.length
    });
    if (item.children?.length) {
      acc.push(...flattenTree(item.children, depth + 1));
    }
    return acc;
  }, []);
}

function unflattenTree(flatItems: FlatTreeItem[]): PageTreeItem[] {
  const root: PageTreeItem[] = [];
  const stack: { item: PageTreeItem; depth: number }[] = [];

  flatItems.forEach((flat) => {
    const node: PageTreeItem = { id: flat.id, title: flat.title, children: [] };
    while (stack.length > 0 && stack[stack.length - 1].depth >= flat.depth) stack.pop();

    if (stack.length === 0) {
      root.push(node);
    } else {
      const parent = stack[stack.length - 1].item;
      if (!parent.children) parent.children = [];
      parent.children.push(node);
    }
    stack.push({ item: node, depth: flat.depth });
  });

  return root;
}

function getChildCount(items: FlatTreeItem[], index: number) {
  let count = 0;
  const parentDepth = items[index].depth;
  for (let i = index + 1; i < items.length; i++) {
    if (items[i].depth <= parentDepth) break;
    count++;
  }
  return count;
}

function TreeRowContent({
  item,
  isCollapsed,
  onCollapse,
  isOverlay,
  handleProps
}: {
  item: ComputedItem;
  isCollapsed: boolean;
  onCollapse?: () => void;
  isOverlay?: boolean;
  handleProps?: React.HTMLAttributes<HTMLButtonElement> & { [key: string]: any };
}) {
  const lineCenterX = 22;

  const renderVerticalLines = () => {
    if (isOverlay) return null;

    const lines: LineConfig[] = [];
    lines.push({ x: lineCenterX, top: 0, bottom: item.isLast ? "50%" : 0 });

    if (item.depth > 0) {
      const parentX = (item.depth - 1) * INDENT + lineCenterX;
      const isImmediateParentActive = item.activeSpines[item.depth - 1];

      lines.push({ x: parentX, top: 0, bottom: !isImmediateParentActive ? "50%" : 0 });

      for (let level = 2; level < item.depth; level++) {
        if (item.activeSpines[level - 1]) {
          lines.push({ x: (level - 1) * INDENT + lineCenterX, top: 0, bottom: 0 });
        }
      }
    }

    return lines.map((line, idx) => (
      <span
        key={`line-${idx}`}
        style={{
          position: "absolute",
          left: line.x,
          top: line.top,
          bottom: line.bottom,
          width: "1px",
          background: LINE_COLOR,
          zIndex: 1,
          pointerEvents: "none"
        }}
      />
    ));
  };

  return (
    <>
      {renderVerticalLines()}

      {!isOverlay && (
        <span
          style={{
            position: "absolute",
            left: item.depth === 0 ? lineCenterX : (item.depth - 1) * INDENT + lineCenterX,
            top: "50%",
            width: item.depth === 0 ? 22 : 66,
            height: "1px",
            background: LINE_COLOR,
            zIndex: 1,
            pointerEvents: "none"
          }}
        />
      )}

      {item.hasChildren && !isOverlay && (
        <IconButton
          aria-label={isCollapsed ? "Expand" : "Collapse"}
          onClick={(e) => {
            e.stopPropagation();
            onCollapse?.();
          }}
          size="lg"
          variant="plain"
          position="absolute"
          left={`${item.depth * INDENT + 12}px`}
          top="50%"
          transform="translateY(-50%)"
          zIndex={10}
          background="#ffffff"
          borderRadius="50%"
          minW="20px"
          h="20px"
          p={0}
          color="#555555"
          _hover={{ bg: "#f5f5f5" }}
        >
          {isCollapsed ? (
            <LuCirclePlus size={18} style={{ backgroundColor: "#ffffff", borderRadius: "50%" }} />
          ) : (
            <LuCircleMinus size={18} style={{ backgroundColor: "#ffffff", borderRadius: "50%" }} />
          )}
        </IconButton>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginLeft: `${item.depth * INDENT + 44}px`,
          backgroundColor: "#ffffff",
          border: `1px solid ${BOX_BORDER_COLOR}`,
          height: 38,
          boxSizing: "border-box",
          zIndex: 2,
          position: "relative",
          minWidth: "240px",
          marginTop: "6px",
          marginBottom: "6px",
          boxShadow: isOverlay ? "0px 8px 24px rgba(0,0,0,0.15)" : "none"
        }}
      >
        <button
          type="button"
          {...(handleProps ?? {})}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 36,
            height: "100%",
            backgroundColor: "#e8e8e8",
            borderTop: "none",
            borderLeft: "none",
            borderBottom: "none",
            borderRight: `1px solid ${BOX_BORDER_COLOR}`,
            cursor: isOverlay ? "grabbing" : "grab",
            touchAction: "none",
            padding: 0,
            outline: "none"
          }}
        >
          <svg width="14" height="10" viewBox="0 0 14 10" fill="#555555">
            <rect width="14" height="1.5" />
            <rect y="4" width="14" height="1.5" />
            <rect y="8" width="14" height="1.5" />
          </svg>
        </button>
        <div
          style={{
            paddingLeft: "16px",
            paddingRight: "20px",
            fontSize: "13px",
            fontWeight: 700,
            color: "#000000",
            whiteSpace: "nowrap"
          }}
        >
          {item.title}
        </div>
      </div>
    </>
  );
}

function DropIndicatorLine({ depth }: { depth: number }) {
  return (
    <div style={{ position: "relative", height: 0 }}>
      <div
        style={{
          position: "absolute",
          left: depth * INDENT + 44,
          right: 12,
          top: -4,
          height: 3,
          borderRadius: 2,
          background: "#3b82f6",
          boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.15)",
          zIndex: 20
        }}
      />
      <div
        style={{
          position: "absolute",
          left: depth * INDENT + 44 - 5,
          top: -6,
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: "#3b82f6",
          zIndex: 20
        }}
      />
    </div>
  );
}

function SortableTreeItemRow({
  item,
  onCollapse,
  collapsedMap
}: {
  item: ComputedItem;
  onCollapse: () => void;
  collapsedMap: Record<string, boolean>;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id
  });
  const isCollapsed = collapsedMap[item.id] || false;

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    width: "100%",
    position: "relative",
    display: "flex",
    alignItems: "center",
    paddingTop: 0,
    paddingBottom: 0
  };

  return (
    <div ref={setNodeRef} style={style}>
      <TreeRowContent
        item={item}
        isCollapsed={isCollapsed}
        onCollapse={onCollapse}
        handleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

export default function ReOrderTree() {
  const p = usePages();
  const [items, setItems] = useState<FlatTreeItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [currentOffset, setCurrentOffset] = useState<number>(0);
  const [collapsedMap, setCollapsedMap] = useState<Record<string, boolean>>({});

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  useEffect(() => {
    setItems(flattenTree((p.pages as PageTreeItem[]) || []));
  }, [p.pages]);

  const activeIndex = activeId ? items.findIndex((i) => i.id === activeId) : -1;
  const activeChildrenCount = activeIndex >= 0 ? getChildCount(items, activeIndex) : 0;

  const itemsWithoutChildren = useMemo(() => {
    if (activeIndex === -1) return items;
    return [
      ...items.slice(0, activeIndex + 1),
      ...items.slice(activeIndex + 1 + activeChildrenCount)
    ];
  }, [items, activeIndex, activeChildrenCount]);

  const projectedDepth = useMemo(() => {
    if (!activeId || !overId) return null;
    const overItemIndex = itemsWithoutChildren.findIndex(({ id }) => id === overId);
    const activeItemIndex = itemsWithoutChildren.findIndex(({ id }) => id === activeId);

    if (overItemIndex === -1 || activeItemIndex === -1) return null;

    const newItems = arrayMove(itemsWithoutChildren, activeItemIndex, overItemIndex);
    const previousItem = newItems[overItemIndex - 1];
    const nextItem = newItems[overItemIndex + 1];

    const dragDepth = Math.round(currentOffset / INDENT);
    const calculatedDepth = itemsWithoutChildren[activeItemIndex].depth + dragDepth;

    const maxDepth = previousItem ? previousItem.depth + 1 : 0;
    const minDepth = nextItem ? nextItem.depth : 0;

    if (calculatedDepth >= maxDepth) return maxDepth;
    if (calculatedDepth < minDepth) return minDepth;
    return calculatedDepth;
  }, [itemsWithoutChildren, activeId, overId, currentOffset]);

  const displayItems = useMemo(() => {
    if (!activeId || projectedDepth === null) return itemsWithoutChildren;
    return itemsWithoutChildren.map((item) =>
      item.id === activeId ? { ...item, depth: projectedDepth } : item
    );
  }, [itemsWithoutChildren, activeId, projectedDepth]);

  const computedItems = useMemo(() => {
    let hiddenCutoff: number | null = null;
    return displayItems.map((item, i) => {
      let isLast = true;
      for (let j = i + 1; j < displayItems.length; j++) {
        if (displayItems[j].depth < item.depth) break;
        if (displayItems[j].depth === item.depth) {
          isLast = false;
          break;
        }
      }

      const activeSpines = Array.from({ length: item.depth }).map((_, level) => {
        let active = false;
        for (let j = i + 1; j < displayItems.length; j++) {
          if (displayItems[j].depth < level + 1) break;
          if (displayItems[j].depth === level + 1) {
            active = true;
            break;
          }
        }
        return active;
      });

      if (hiddenCutoff !== null && item.depth >= hiddenCutoff) {
        return { ...item, isLast, activeSpines, hidden: true } as ComputedItem;
      }
      hiddenCutoff = null;
      if (collapsedMap[item.id]) hiddenCutoff = item.depth + 1;

      return { ...item, isLast, activeSpines, hidden: false } as ComputedItem;
    });
  }, [displayItems, collapsedMap]);

  const activeOverlayItem = useMemo<ComputedItem | null>(() => {
    if (!activeId || activeIndex === -1) return null;
    const raw = items[activeIndex];
    return { ...raw, isLast: false, activeSpines: [], hidden: false };
  }, [activeId, items, activeIndex]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setOverId(null);
    setCurrentOffset(0);

    if (active.id && over?.id && projectedDepth !== null) {
      const overIndex = itemsWithoutChildren.findIndex((i) => i.id === over.id);
      const activeIdxInNew = itemsWithoutChildren.findIndex((i) => i.id === active.id);

      if (overIndex === -1 || activeIdxInNew === -1) return;

      const reordered = arrayMove(itemsWithoutChildren, activeIdxInNew, overIndex);
      const finalActiveIndex = reordered.findIndex((i) => i.id === active.id);
      const depthDiff = projectedDepth - items[activeIndex].depth;

      reordered[finalActiveIndex] = { ...reordered[finalActiveIndex], depth: projectedDepth };

      const movedChildren = items
        .slice(activeIndex + 1, activeIndex + 1 + activeChildrenCount)
        .map((child) => ({
          ...child,
          depth: child.depth + depthDiff
        }));

      reordered.splice(finalActiveIndex + 1, 0, ...movedChildren);
      p.setPages(unflattenTree(reordered));
    }
  };

  const visibleItems = computedItems.filter((i) => !i.hidden);

  return (
    <div style={{ paddingBottom: "1rem", backgroundColor: "#ffffff", userSelect: "none" }}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={(e) => p.isEditing && setActiveId(e.active.id as string)}
        onDragMove={(e) => {
          setCurrentOffset(e.delta.x);
          setOverId((e.over?.id as string) || null);
        }}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={visibleItems.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            {visibleItems.map((item, index) => {
              const visibleActiveIndex = visibleItems.findIndex((i) => i.id === activeId);
              const isOverThisRow = !!activeId && overId === item.id && activeId !== item.id;
              const showIndicatorAbove = isOverThisRow && index < visibleActiveIndex;
              const showIndicatorBelow = isOverThisRow && index > visibleActiveIndex;
              const indicatorDepth = projectedDepth ?? item.depth;

              return (
                <React.Fragment key={item.id}>
                  {showIndicatorAbove && <DropIndicatorLine depth={indicatorDepth} />}
                  <SortableTreeItemRow
                    item={item}
                    onCollapse={() =>
                      setCollapsedMap((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
                    }
                    collapsedMap={collapsedMap}
                  />
                  {showIndicatorBelow && <DropIndicatorLine depth={indicatorDepth} />}
                </React.Fragment>
              );
            })}
          </div>
        </SortableContext>

        <DragOverlay
          dropAnimation={{
            sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: "0.4" } } })
          }}
        >
          {activeId && activeOverlayItem ? (
            <div style={{ position: "relative" }}>
              <TreeRowContent item={activeOverlayItem} isCollapsed={false} isOverlay />
              {activeChildrenCount > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: 6,
                    right: 8,
                    background: "#1d2939",
                    color: "white",
                    fontSize: "11px",
                    fontWeight: 700,
                    lineHeight: 1,
                    padding: "3px 6px",
                    borderRadius: 10,
                    zIndex: 30
                  }}
                >
                  +{activeChildrenCount}
                </div>
              )}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
