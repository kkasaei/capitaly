/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useCallback, useEffect } from "react";
import ReactFlow, {
    ReactFlowProvider,
    addEdge,
    Background,
    useNodesState,
    useEdgesState,
    useReactFlow,
    BackgroundVariant,
    Controls,
    Position,
    Node,
    Connection,
    XYPosition,
} from "reactflow";
import type { MouseEvent as ReactFlowMouseEvent } from "react";
import "reactflow/dist/style.css";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { useJourneyContext } from "@/components/journeys/journeyContext";
import { useToast } from "@/components/ui/use-toast";
import { WorkflowHeader } from "@/components/journeys/workflow-header";
import { nodeTypes, NodeProperties } from "@/components/journeys/nodes";
import { Sidebar } from "@/components/journeys/sidebar";
import { CustomEdge } from '@/components/journeys/edges/CustomEdge';
import { api } from "@/lib/trpc/react";
import { JourneyProvider } from "@/components/journeys/journeyContext";

const FlowWithProvider = ({ campaignId }: { campaignId?: string }) => {
    const utils = api.useUtils();
    // Configurations
    const config = {
        // Auto-connect nodes when a new node is added
        shouldAutoConnect: false,
        shouldEnforceNodePositions: false,
    }

    const [isSidebarOpened, setIsSidebarOpened] = useState(true);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [selectedNode, setSelectedNode] = useState(null);
    const [journeyName, setJourneyName] = useState("New Workflow");
    const [journeyMode] = useState("Editing");

    const reactFlowInstance = useReactFlow();
    const { toast } = useToast();
    const MIN_NODE_SPACING = 250; // Minimum horizontal spacing between nodes

    const [isSaving, setIsSaving] = useState(false);
    const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
    const { newJourneyDetails, setNewJourneyDetails } = useJourneyContext();

    const [journeyDetails, setJourneyDetails] = useState(newJourneyDetails);
    const router = useRouter();

    useEffect(() => {
        if (newJourneyDetails) {
            setJourneyDetails(newJourneyDetails);
            setNewJourneyDetails(null); // Clear from context after transferring to local state
        } else if (!journeyDetails) {
            // If there are no details in context or local state, redirect to management page
            // router.push("/dashboard/journeys");
        }
    }, [newJourneyDetails, setNewJourneyDetails, journeyDetails, router]);

    const validateJourney = useCallback(() => {
        // Check if all nodes are connected
        const connectedNodeIds = new Set();
        edges.forEach((edge) => {
            connectedNodeIds.add(edge.source);
            connectedNodeIds.add(edge.target);
        });
        if (connectedNodeIds.size !== nodes.length) {
            toast({
                variant: "destructive",
                title: "Invalid Journey",
                description: "All nodes must be connected in the journey.",
            });
            return false;
        }

        return true;
    }, [edges, nodes.length, toast]);

    const updateNodePositions = useCallback((newNodes: Node[]) => {
        const sortedNodes = newNodes.sort((a: Node, b: Node) => {
            if (a.type === "triggerNode") return -1;
            if (b.type === "triggerNode") return 1;
            if (a.type === "exitNode") return 1;
            if (b.type === "exitNode") return -1;
            return 0;
        });

        const centerY = 250; // Center Y position for all nodes
        let currentX = 50;  // Starting X position

        return sortedNodes.map((node: Node) => {
            const updatedNode = {
                ...node,
                // if shouldEnforceNodePositions is true, set the position
                ...(config.shouldEnforceNodePositions && {
                    position: { x: currentX, y: centerY },
                }),
                // Add sourcePosition and targetPosition for left-to-right flow
                sourcePosition: Position.Right,
                targetPosition: Position.Left
            };

            // Increase the X position for the next node
            currentX += MIN_NODE_SPACING;

            return updatedNode;
        });
    }, [config.shouldEnforceNodePositions]);

    const updateEdges = useCallback((updatedNodes: Node[]) => {
        const newEdges = [];
        for (let i = 0; i < updatedNodes.length - 1; i++) {
            newEdges.push({
                id: `${updatedNodes[i].id}-${updatedNodes[i + 1].id}`,
                source: updatedNodes[i].id,
                target: updatedNodes[i + 1].id,
                type: "smoothstep",
            });
        }
        return newEdges;
    }, []);

    useEffect(() => {
        const initialNodes = [
            {
                id: "trigger",
                type: "triggerNode",
                position: { x: 50, y: 250 },  // Updated position
                data: { label: "Trigger" },
                sourcePosition: Position.Right,
                targetPosition: Position.Left
            },
            {
                id: "exit",
                type: "exitNode",
                position: { x: 350, y: 250 },  // Updated position
                data: { label: "Exit" },
                sourcePosition: Position.Right,
                targetPosition: Position.Left
            },
        ];

        const updatedNodes = updateNodePositions(initialNodes);
        const initialEdges = updateEdges(updatedNodes);

        setNodes(updatedNodes);
        setEdges(initialEdges);
    }, [setNodes, setEdges, updateNodePositions, updateEdges]);

    const onConnect = useCallback((params: Connection) => {
        setEdges((eds) => addEdge(params, eds));
    }, [setEdges]);

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    const createNewNode = (type: string, position: XYPosition, label?: string) => {
        return {
            id: `${type}-${Date.now()}`,
            type,
            position,
            data: { label: label || `${type.replace("Node", "")}` },
        };
    };

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            // If the drop target has the edgebutton-foreignobject class or is a child of it,
            // don't process the drop here (let the edge handler handle it)
            const target = event.target as HTMLElement;
            const isDropOnEdge = target.closest('.edgebutton-foreignobject');
            if (isDropOnEdge) {
                return;
            }

            const type = event.dataTransfer.getData("application/reactflow");

            if (type === "abTestNode") {
                toast({
                    variant: "destructive",
                    title: "Feature not available",
                    description: "A/B Test node is coming soon!",
                });
                return;
            }

            const position: any = reactFlowInstance.project({
                x: event.clientX,
                y: event.clientY,
            });
            const newNode = {
                ...createNewNode(type, position),
                sourcePosition: Position.Right,
                targetPosition: Position.Left
            };

            setNodes((nds) => {
                const updatedNodes = updateNodePositions([...nds, newNode]);
                config.shouldAutoConnect && setEdges(updateEdges(updatedNodes));
                return updateNodePositions(updatedNodes);
            });
        },
        [reactFlowInstance, setNodes, setEdges, updateNodePositions, updateEdges]
    );

    // Add this new effect to handle drops on edges
    useEffect(() => {
        const handleDropOnEdge = (event: CustomEvent) => {
            const { edgeId, sourceNodeId, targetNodeId, nodeType } = event.detail;

            const sourceNode = nodes.find(node => node.id === sourceNodeId);
            const targetNode = nodes.find(node => node.id === targetNodeId);

            if (!sourceNode || !targetNode) return;

            // Calculate new node position between source and target nodes
            const newNodePosition: any = {
                x: sourceNode.position.x + (targetNode.position.x - sourceNode.position.x) / 2,
                y: sourceNode.position.y // Keep Y position same as source node
            };

            // Create new node with correct source/target positions
            const newNode = {
                ...createNewNode(nodeType, newNodePosition),
                sourcePosition: Position.Right,
                targetPosition: Position.Left
            };

            // Remove the old edge
            setEdges((eds) => eds.filter((e) => e.id !== edgeId));

            // Add the new node and update all node positions
            setNodes((nds: any) => {
                const updatedNodes = [...nds, newNode];

                // Sort nodes to maintain proper order (left to right)
                const sortedNodes = updatedNodes.sort((a, b) => {
                    if (a.type === "triggerNode") return -1;
                    if (b.type === "triggerNode") return 1;
                    if (a.type === "exitNode") return 1;
                    if (b.type === "exitNode") return -1;
                    return a.position.x - b.position.x; // Sort by X position instead of Y
                });

                // Recalculate positions with equal horizontal spacing
                return sortedNodes.map((node, index) => {
                    if (index === 0) return node; // Keep trigger node position

                    return {
                        ...node,
                        position: {
                            x: sortedNodes[0].position.x + (index * MIN_NODE_SPACING), // Space nodes horizontally
                            y: sourceNode.position.y // Keep all nodes aligned on Y axis
                        },
                        sourcePosition: Position.Right,
                        targetPosition: Position.Left
                    };
                });
            });

            // Create new edges with the updated node
            setEdges((eds) => {
                const newEdges = [
                    {
                        id: `${sourceNodeId}-${newNode.id}`,
                        source: sourceNodeId,
                        target: newNode.id,
                        type: "smoothstep",
                    },
                    {
                        id: `${newNode.id}-${targetNodeId}`,
                        source: newNode.id,
                        target: targetNodeId,
                        type: "smoothstep",
                    },
                ];
                return [...eds, ...newEdges];
            });
        };

        window.addEventListener('DROP_ON_EDGE' as any, handleDropOnEdge);

        return () => {
            window.removeEventListener('DROP_ON_EDGE' as any, handleDropOnEdge);
        };
    }, [setNodes, setEdges, nodes, MIN_NODE_SPACING]);


    const onNodeDragStop = useCallback(() => {
        setNodes((nds) => {
            const updatedNodes = updateNodePositions(nds);
            // Disable if want to connect nodes manually
            config.shouldAutoConnect && setEdges(updateEdges(updatedNodes));
            return updatedNodes;
        });
    }, [setNodes, setEdges, updateNodePositions, updateEdges]);

    const onNodeClick = (event: ReactFlowMouseEvent, node: Node) => {
        console.log("Node clicked:", node);
        setSelectedNode(node as any);
    };

    const onDragStart = (event: React.DragEvent, nodeType: string) => {
        event.dataTransfer.setData("application/reactflow", nodeType);
        event.dataTransfer.effectAllowed = "move";
    };

    // Modify the edgeTypes definition to pass the props using a function
    const edgeTypes = {
        smoothstep: (props: any) => (
            <CustomEdge
                {...props}
                isSidebarOpened={isSidebarOpened}
                setIsSidebarOpened={setIsSidebarOpened}
            />
        ),
    };

    // Add this new event listener in a useEffect
    useEffect(() => {
        const handleDeleteEdge = (event: CustomEvent) => {
            const edgeId = event.detail.id;
            setEdges((edges) => edges.filter((edge) => edge.id !== edgeId));
        };

        window.addEventListener('DELETE_EDGE' as any, handleDeleteEdge);

        return () => {
            window.removeEventListener('DELETE_EDGE' as any, handleDeleteEdge);
        };
    }, [setEdges]);


    const {
        data: journeyData,
        isLoading: isJourneyLoading,
    } = api.journey.getById.useQuery({
        id: campaignId as string,
    }, {
        enabled: !!campaignId,
    }) as { data: any, isLoading: boolean };



    // Initial nodes setup with increased spacing
    useEffect(() => {
        const initialNodes = [
            {
                id: "trigger",
                type: "triggerNode",
                position: { x: 100, y: 250 },  // Left position
                data: { label: "Trigger" },
                sourcePosition: Position.Right,
                targetPosition: Position.Left
            },
            {
                id: "exit",
                type: "exitNode",
                position: { x: 500, y: 250 },  // More distance from trigger node
                data: { label: "Exit" },
                sourcePosition: Position.Right,
                targetPosition: Position.Left
            },
        ];

        // Apply the node positions directly without modification
        setNodes(initialNodes);

        // Create the edge connecting the nodes
        const initialEdges = [
            {
                id: "trigger-exit",
                source: "trigger",
                target: "exit",
                type: "smoothstep",
            }
        ];

        setEdges(initialEdges);
    }, [setNodes, setEdges]); // Remove updateNodePositions from dependencies



    // Modified API response handler with increased spacing
    useEffect(() => {
        if (journeyData) {
            const { name, definition } = journeyData as any;
            setJourneyName(name);

            // Make sure the nodes have valid position objects
            if (definition && definition.nodes && Array.isArray(definition.nodes)) {
                const centerY = 250; // Center Y position for all nodes
                let currentX = 100;   // Starting X position (moved from 50 to 100)
                const spacing = 400;  // Increased horizontal spacing between nodes (from 200)

                const validatedNodes = definition.nodes.map((node: Node) => {
                    // Check if the node has a valid position
                    if (!node.position || typeof node.position.x === 'undefined' || typeof node.position.y === 'undefined') {
                        // If position is missing or invalid, assign sequential position on x-axis
                        const newNode = {
                            ...node,
                            position: { x: currentX, y: centerY },
                            sourcePosition: Position.Right,
                            targetPosition: Position.Left
                        };

                        // Increase X for next node without a position
                        currentX += spacing;
                        return newNode;
                    }

                    // If position is valid, ensure other required properties are present
                    return {
                        ...node,
                        sourcePosition: Position.Right,
                        targetPosition: Position.Left
                    };
                });

                // Set nodes directly without using updateNodePositions
                setNodes(validatedNodes);
            } else {
                // If no nodes are defined, set default initial nodes with increased spacing
                const initialNodes = [
                    {
                        id: "trigger",
                        type: "triggerNode",
                        position: { x: 100, y: 250 },
                        data: { label: "Trigger" },
                        sourcePosition: Position.Right,
                        targetPosition: Position.Left
                    },
                    {
                        id: "exit",
                        type: "exitNode",
                        position: { x: 500, y: 250 },
                        data: { label: "Exit" },
                        sourcePosition: Position.Right,
                        targetPosition: Position.Left
                    },
                ];

                setNodes(initialNodes);
            }

            // Handle edges
            if (definition && definition.edges && Array.isArray(definition.edges)) {
                setEdges(definition.edges);
            } else {
                const initialEdges = [
                    {
                        id: "trigger-exit",
                        source: "trigger",
                        target: "exit",
                        type: "smoothstep",
                    }
                ];
                setEdges(initialEdges);
            }
        }
    }, [journeyData, setNodes, setEdges]); // Remove updateNodePositions from dependencies


    if (isJourneyLoading && campaignId) {
        return <div>Loading...</div>; // Show while redirecting
    }


    return (
        <div className="h-screen bg-white flex flex-col">
            <WorkflowHeader
                journeyMode={journeyMode}
                journeyName={journeyName}
                setJourneyName={setJourneyName}
                setShowSaveConfirmation={setShowSaveConfirmation}
                isSaving={isSaving}

            />

            <div className="flex-grow relative">
                <Sidebar
                    onDragStart={onDragStart}
                    isSidebarOpened={isSidebarOpened}
                    setIsSidebarOpened={setIsSidebarOpened}
                />
                <div className="absolute top-28 right-5 p-4">
                    <Controls />
                </div>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onNodeClick={onNodeClick}
                    onNodeDragStop={onNodeDragStop}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    fitView
                    minZoom={0.5}
                    maxZoom={2}
                    defaultViewport={{ x: 0, y: 0, zoom: 1 }}
                >
                    <Background
                        id="1"
                        gap={20}
                        variant={BackgroundVariant.Dots}
                    />

                </ReactFlow>
                {selectedNode && (
                    <NodeProperties
                        node={selectedNode}
                        setNodes={setNodes}
                        onClose={() => setSelectedNode(null)}
                    />
                )}
            </div>
            <AlertDialog
                open={showSaveConfirmation}
                onOpenChange={setShowSaveConfirmation}
            >
                <AlertDialogContent className="border">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-bold">
                            Save Workflow
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to save this workflow? Once saved, it will be
                            created and live in your account.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => router.push("/dashboard/agents")}
                        >
                            Save
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

const JourneyBuilder = ({
    campaignId,
}: {
    campaignId?: string;
}) => {
    return (
        <JourneyProvider>
            <ReactFlowProvider>
                <FlowWithProvider campaignId={campaignId} />
            </ReactFlowProvider>
        </JourneyProvider>
    )
}

export default JourneyBuilder;