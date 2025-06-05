"use client";

import { useRef, useEffect, useCallback } from "react";

type Node = {
  id: string;
  label: string;
  type: string;
  x?: number;
  y?: number;
};

type Edge = {
  source: string;
  target: string;
  label?: string;
};

type WorkflowGraphProps = {
  nodes: Node[];
  edges: Edge[];
  onNodeClick?: (nodeId: string) => void;
  width?: number;
  height?: number;
};

export default function WorkflowGraph({
  nodes,
  edges,
  onNodeClick,
  width = 800,
  height = 500
}: WorkflowGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  // Function to render the SVG graph
  const renderGraph = useCallback((nodes: Node[], edges: Edge[]) => {
    if (!svgRef.current) return;
    
    // Clear previous graph
    const svg = svgRef.current;
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }
    
    // Create defs for arrow markers
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    svg.appendChild(defs);
    
    const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
    marker.setAttribute("id", "arrowhead");
    marker.setAttribute("markerWidth", "6");
    marker.setAttribute("markerHeight", "4");
    marker.setAttribute("refX", "6");
    marker.setAttribute("refY", "2");
    marker.setAttribute("orient", "auto");
    
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M0,0 L0,4 L6,2 Z");
    path.setAttribute("fill", "#888");
    
    marker.appendChild(path);
    defs.appendChild(marker);
    
    // Draw edges first (so they appear behind nodes)
    edges.forEach(edge => {
      const sourceNode = nodes.find(n => n.id === edge.source);
      const targetNode = nodes.find(n => n.id === edge.target);
      
      if (!sourceNode?.x || !sourceNode?.y || !targetNode?.x || !targetNode?.y) return;
      
      // Draw edge line
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", sourceNode.x.toString());
      line.setAttribute("y1", sourceNode.y.toString());
      line.setAttribute("x2", targetNode.x.toString());
      line.setAttribute("y2", targetNode.y.toString());
      line.setAttribute("stroke", "#888");
      line.setAttribute("stroke-width", "2");
      line.setAttribute("marker-end", "url(#arrowhead)");
      
      svg.appendChild(line);
      
      // Add edge label if provided
      if (edge.label) {
        const midX = (sourceNode.x + targetNode.x) / 2;
        const midY = (sourceNode.y + targetNode.y) / 2;
        
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", midX.toString());
        text.setAttribute("y", midY.toString());
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("dy", "-5");
        text.setAttribute("fill", "#666");
        text.setAttribute("font-size", "12");
        text.textContent = edge.label;
        
        svg.appendChild(text);
      }
    });
    
    // Draw nodes
    nodes.forEach(node => {
      if (!node.x || !node.y) return;
      
      // Create node group
      const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
      group.setAttribute("transform", `translate(${node.x},${node.y})`);
      group.setAttribute("cursor", "pointer");
      
      if (onNodeClick) {
        group.onclick = () => onNodeClick(node.id);
      }
      
      // Define node background color based on type
      let bgColor = "#60a5fa"; // default blue
      if (node.type === "social") bgColor = "#8b5cf6"; // purple
      if (node.type === "content") bgColor = "#10b981"; // green
      if (node.type === "seo") bgColor = "#f59e0b"; // amber
      if (node.type === "analytics") bgColor = "#6366f1"; // indigo
      
      // Node circle
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("r", "30");
      circle.setAttribute("fill", bgColor);
      circle.setAttribute("stroke", "#fff");
      circle.setAttribute("stroke-width", "2");
      
      // Create robot icon
      const foreignObject = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
      foreignObject.setAttribute("width", "36");
      foreignObject.setAttribute("height", "36");
      foreignObject.setAttribute("x", "-18");
      foreignObject.setAttribute("y", "-18");
      
      // Create div to hold the react icon
      const iconDiv = document.createElement("div");
      iconDiv.style.width = "100%";
      iconDiv.style.height = "100%";
      iconDiv.style.display = "flex";
      iconDiv.style.alignItems = "center";
      iconDiv.style.justifyContent = "center";
      iconDiv.style.color = "#fff";
      iconDiv.innerHTML = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M227.7 65.2c-.1 2.8-.2 5.7 0 8.5 15.2 2.9 25.7 11.3 29 26.6 1.5 6.8 1.1 13.9-1.1 20.4-7.9 24.8-21.2 47-33.6 70.2-9.3 17.2-21.2 32.8-32.2 49-7.1 10.5-13.5 21.6-21.8 31.2-9-6.6-18.2-13-26.5-20.7-8.2-7.7-17.3-14.6-24.2-23.7-8.6-11.3-15.9-23.6-19.6-37.8-10-39 15.5-77.4 54.9-83.5 3.3-2 6.6-4.4 10.2-5.6-3-17.7-3.5-36.3-.9-54.3-2.4-2.4-5.9-2.9-9.2-3.4-27.3-3.4-56.2 1.4-79.6 16.4-71.8 45.8-82.5 146.6-33.3 215 13.7 19.5 32.6 35.2 53.5 46.5 20.8 11 44.4 16.3 68.1 16.9-4-30.2-4.7-61.5-.1-91.7-5.3-.3-10.5-.5-15.8-.6-28.9-.2-59.1-9.3-80.1-28.6-17.9-16.3-28.6-40.3-28.8-64.8-10.5 41.5 2.7 89.4 39.4 116.4 21.6 15.7 48.9 21.2 75.1 22.6 6.4-27.6 18.2-54.6 37.3-75.9 1.8-25.9 11.1-51.3 27.3-71.3-25.3.1-52.5-5.6-71.2-23.5-20.6-19.4-27.3-50-18.8-76.5-12.3 34.4-.6 75.2 28.9 98.4 21.6 16.8 49.2 22.6 75.8 23.2 8.4-7.3 17.6-13.8 27.5-19 17-9.4 35.8-15.4 53.1-24.1 20.7-10.4 39.1-25.6 53.2-44.7 2.6-3.5 5.4-7 6.5-11.3-29.7 1.1-60-2.2-88.1-13.5-15-6.1-28.8-15.1-38.6-28-9.2-12.3-14.7-27.4-14.5-42.5-5.3 13.7-6.2 29.9-1.3 44.1 5.5 16.1 17.6 29.5 32.4 37.4 14.3 7.8 30.1 11.7 46.2 14-11.7-27.8-10.9-60.2 3.1-86.8-3.7-1.7-4.7-6-6-9.6-5.2-13.5-10.5-27.2-19.2-38.9-14.8-20.5-39.3-33-64-32.7-2.1.2-4.1.7-6.2.9zm135 53.1c-4.8 27.8-.8 57.7 12.3 83.1 14.1 1.3 28.4.5 42.2-2.2 3.3-19.4 13.9-38.1 30.5-48.6-22.4-9.1-47.8-7-70-16.3-5.3-4.8-10.3-10.1-15.5V118c0-.6 0-1.2.1-1.8-.1.7-.1 1.4-.1 2.1zM462 139.3c-15.1 7.5-25.2 23.5-28.2 39.9-1.2 6.5-1.1 13.4-1.2 20.1 18.1-2.9 36.1-9.3 49.3-22-7-11.1-13.1-23-19.9-38zm-33.8 121c-12.9 1.3-26 .6-38.7 3.2-6.1 1.1-12.6 1.7-18.5 3.9-4.9 1.9-6.8 7.4-9.4 11.5-11.2 20.5-16.5 44.4-15.1 67.5 6.8 6.8 7.7 16.8 9.7 25.7 1.5 7.3 2 15.1 5.7 21.8 3.3 5.9 9.8 9.1 16.3 9.8 21.1-2.5 44.8-.4 61.2-16.1 12.8-12.3 17.9-30.3 17.7-47.7 0-24.5 5.6-49 19.1-69.4 5.3-8.3 12.6-15.2 21.4-19.4-22.6-3.5-46.5-.8-69.4 9.2z"></path></svg>`;
      
      foreignObject.appendChild(iconDiv);
      
      // Node label
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("y", "45");
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("fill", "#4b5563");
      text.setAttribute("font-size", "14");
      text.setAttribute("font-weight", "500");
      text.textContent = node.label;
      
      // Add elements to group
      group.appendChild(circle);
      group.appendChild(foreignObject);
      group.appendChild(text);
      
      // Add group to SVG
      svg.appendChild(group);
    });
  }, [onNodeClick]);

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    // Calculate positions if not provided
    const nodesCopy = [...nodes];
    if (!nodesCopy[0].x || !nodesCopy[0].y) {
      // Simple auto-layout for nodes
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) * 0.35;
      
      if (nodesCopy.length === 1) {
        // Single node in the center
        nodesCopy[0].x = centerX;
        nodesCopy[0].y = centerY;
      } else {
        // Circular layout for multiple nodes
        nodesCopy.forEach((node, index) => {
          const angle = (2 * Math.PI * index) / nodesCopy.length;
          node.x = centerX + radius * Math.cos(angle);
          node.y = centerY + radius * Math.sin(angle);
        });
      }
    }

    // Draw the graph
    renderGraph(nodesCopy, edges);
  }, [nodes, edges, width, height, onNodeClick, renderGraph]);

  return (
    <div className="overflow-auto border border-gray-200 rounded-lg bg-white">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="mx-auto"
      />
    </div>
  );
} 