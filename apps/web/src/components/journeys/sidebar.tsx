/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect, DragEvent } from "react";
import "reactflow/dist/style.css";
import { motion, AnimatePresence } from "framer-motion";
import {
    Tooltip,
    TooltipProvider,
    TooltipTrigger,
    TooltipContent,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { nodesList } from "./nodesList";
import { ChevronDown, ChevronRight, PanelLeftCloseIcon, PanelRightCloseIcon, PanelRightOpenIcon } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";

interface SidebarProps {
    onDragStart: (event: React.DragEvent<Element>, nodeType: string) => void;
    isSidebarOpened: boolean;
    setIsSidebarOpened: (value: boolean) => void;
}

export const Sidebar = ({ onDragStart, isSidebarOpened, setIsSidebarOpened }: SidebarProps) => {
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredSections, setFilteredSections] = useState(nodesList);

    // State to track which accordion sections are open
    const [openSections, setOpenSections] = useState(
        nodesList.map((_, index) => index === 0) // Only open first section by default
    );

    // Filter sections and nodes based on search term
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredSections(nodesList);
            return;
        }

        const lowerSearchTerm = searchTerm.toLowerCase();

        const filtered = nodesList.map(section => {
            // Filter nodes within each section
            const filteredNodes = section.nodes.filter(node =>
                node.label.toLowerCase().includes(lowerSearchTerm)
            );

            // Return section with filtered nodes
            return {
                ...section,
                nodes: filteredNodes
            };
        }).filter(section => section.nodes.length > 0);

        setFilteredSections(filtered);

        // Auto-open sections with matches
        if (filtered.length > 0) {
            setOpenSections(filtered.map(() => true));
        }
    }, [searchTerm]);

    const toggleSection = (index: number) => {
        setOpenSections((prev) => {
            const newState = [...prev];
            newState[index] = !newState[index];
            return newState;
        });
    };

    const handleDragStart = (event: React.DragEvent<Element>, nodeType: string) => {
        if (nodeType === "abTestNode") {
            event.preventDefault();
            toast({
                variant: "destructive",
                title: "Feature not available",
                description: "A/B Test node is coming soon!",
            });
        } else {
            onDragStart(event, nodeType);
        }
    };

    return (
        <>
            {isSidebarOpened ? (
                <aside
                    className="absolute top-0 left-0 bottom-0 z-10 border-r-2 border-slate-200 bg-white"
                    style={{ width: "300px" }}
                >
                    <div className="relative h-full">
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold mb-4 text-meadow-500">Node Types</h2>
                                <Button
                                    variant="secondary"
                                    className="rounded-full"
                                    onClick={() => setIsSidebarOpened(false)}
                                >
                                    <PanelLeftCloseIcon size="24" />
                                </Button>
                            </div>
                            <div className="mb-4">
                                <Input
                                    type="text"
                                    placeholder="Search Nodes..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full border-meadow-300 focus:border-meadow-500 focus:ring-meadow-500"
                                />
                            </div>
                        </div>
                        <ScrollArea className="pr-4" style={{ maxHeight: "calc(100vh - 10rem)", padding: "0 1rem 1rem 1rem", overflowY: "auto" }}>
                            {filteredSections.length > 0 ? (
                                filteredSections.map((section, index) => (
                                    <div key={index} className="mb-4">
                                        <div
                                            className="flex items-center justify-between p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100 transition-colors"
                                            onClick={() => toggleSection(index)}
                                        >
                                            <h3 className="text-lg font-semibold text-meadow-400">
                                                {section.title}
                                            </h3>
                                            {openSections[index] ? (
                                                <ChevronDown className="h-5 w-5 text-meadow-400" />
                                            ) : (
                                                <ChevronRight className="h-5 w-5 text-meadow-400" />
                                            )}
                                        </div>

                                        <AnimatePresence>
                                            {openSections[index] && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="space-y-2 pt-2 pl-2">
                                                        {section.nodes.map((node) => (
                                                            <TooltipProvider key={node.type}>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <motion.div
                                                                            whileHover={{ scale: node.disabled ? 1 : 1.05 }}
                                                                            whileTap={{ scale: node.disabled ? 1 : 0.95 }}
                                                                            className={`flex items-center space-x-2 p-3 rounded transition-all duration-300 ${node.disabled
                                                                                ? "opacity-50 cursor-not-allowed"
                                                                                : "hover:bg-meadow-400 cursor-move"
                                                                                }`}
                                                                            onDragStart={(event: MouseEvent | TouchEvent | PointerEvent) =>
                                                                                handleDragStart(event as unknown as React.DragEvent<Element>, node.type)
                                                                            }
                                                                            draggable={!node.disabled}
                                                                        >
                                                                            {
                                                                                node.image ? (
                                                                                    <Image 
                                                                                        src={node.image.src} 
                                                                                        alt={node.label} 
                                                                                        width={32} 
                                                                                        height={32} 
                                                                                        className="w-8 h-8"
                                                                                    />
                                                                                ) : (
                                                                                    <node.icon size={20} />
                                                                                )
                                                                            }
                                                                            <span className="font-medium">{node.label}</span>
                                                                        </motion.div>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>
                                                                            {node.disabled
                                                                                ? "Coming soon"
                                                                                : `Drag to add ${node.label} node`}
                                                                        </p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))) : (
                                <div className="text-center py-8 text-gray-500">
                                    No matching integrations found
                                </div>
                            )}
                        </ScrollArea>
                    </div>
                </aside>
            ) : (
                <div className="absolute top-4 left-4 z-10">
                    <Button
                        variant="secondary"
                        className="rounded-full"
                        onClick={() => setIsSidebarOpened(true)}
                    >
                        <PanelRightCloseIcon size="24" />
                    </Button>
                </div>
            )}
        </>
    );
};