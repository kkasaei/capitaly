import { BaseEdge, EdgeProps, getBezierPath } from 'reactflow';
import { useState, useEffect } from 'react';
import { Trash2, Plus } from 'lucide-react';

interface CustomEdgeProps extends EdgeProps {
  isSidebarOpened: boolean;
  setIsSidebarOpened: (isOpen: boolean) => void;
}

export const CustomEdge = ({
  setIsSidebarOpened,
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  source,
  target,
}: CustomEdgeProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Listen for global drag events
  useEffect(() => {
    const handleDragStart = () => setIsDragging(true);
    const handleDragEnd = () => {
      setIsDragging(false);
      setIsDragOver(false);
    };

    window.addEventListener('dragstart', handleDragStart);
    window.addEventListener('dragend', handleDragEnd);

    return () => {
      window.removeEventListener('dragstart', handleDragStart);
      window.removeEventListener('dragend', handleDragEnd);
    };
  }, []);

  const onEdgeClick = (evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.stopPropagation();
    const deleteEdgeEvent = new CustomEvent('DELETE_EDGE', { detail: { id } });
    window.dispatchEvent(deleteEdgeEvent);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const nodeType = event.dataTransfer.getData('application/reactflow');

    const dropEvent = new CustomEvent('DROP_ON_EDGE', {
      detail: {
        edgeId: id,
        sourceNodeId: source,
        targetNodeId: target,
        nodeType,
        position: {
          x: labelX,
          y: labelY,
        },
      },
    });
    window.dispatchEvent(dropEvent);
    setIsDragOver(false);
  };

  const handlePlusClick = (event: React.MouseEvent) => {
    // Prevent the click from triggering other events
    event.stopPropagation();
    // Toggle sidebar
    setIsSidebarOpened(true);
  };

  return (
    <g
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="react-flow__edge"
    >
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          strokeWidth: isDragOver ? 3 : 1,
          stroke: isDragOver ? '#3b82f6' : style.stroke,
        }}
      />

      {/* Show controls when either hovering or dragging */}
      {(isHovered || isDragging) && (
        <foreignObject
          width={isDragging ? 40 : 56} // Wider when showing both buttons
          height={24}
          x={labelX - (isDragging ? 20 : 28)} // Center based on width
          y={labelY - 12}
          className="edgebutton-foreignobject"
          requiredExtensions="http://www.w3.org/1999/xhtml"
        >
          <div className="flex gap-1">
            {/* Only show delete button when hovering and not dragging */}
            {isHovered && !isDragging && (
              <button
                className="p-1 rounded-full bg-white border border-gray-200 hover:bg-red-50 hover:border-red-200 transition-colors"
                onClick={onEdgeClick}
              >
                <Trash2 className="w-3 h-3 text-gray-500 hover:text-red-500" />
              </button>
            )}

            {/* Always show drop zone when dragging, otherwise show plus button */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`p-1 rounded-full transition-all ${isDragging
                ? `w-8 h-8 flex items-center justify-center ${isDragOver
                  ? 'bg-blue-100 border-2 border-blue-400'
                  : 'bg-blue-50 border border-blue-200'
                }`
                : 'bg-white border border-gray-200 hover:bg-blue-50 hover:border-blue-200'
                }`}
            >
              <Plus
                className={`w-3 h-3 cursor-pointer ${isDragOver ? 'text-blue-500' : 'text-gray-500'}`}
                onClick={handlePlusClick}
              />
            </div>
          </div>
        </foreignObject>
      )}
    </g>
  );
}; 