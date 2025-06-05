/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck
"use client";
import React, { useState, useCallback, useEffect } from "react";
import ReactFlow, {
    ReactFlowProvider,
    addEdge,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    Handle,
    Position,
    useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import { motion } from "framer-motion";
import {
    Tooltip,
    TooltipProvider,
    TooltipTrigger,
    TooltipContent,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Play,
    Info,
    Mail,
    User,
    MessageSquare,
    GitBranch,
    CheckCircle,
    XCircle,
    Flag,
    Save,
    Clock,
    Zap,
    MessageCircle,
    Bell,
    Shuffle,
    UsersIcon,
    CalendarIcon,
    InfoIcon,
    Link2Icon,
    Captions,
    CircleCheck,
    Webhook,
    Slack,
    SplitIcon,
    ArrowRight,
    PhoneCallIcon,
} from "lucide-react";
import { SiAirtable, SiAnthropic, SiGooglecalendar, SiGooglemeet, SiGooglesheets, SiHubspot, SiLinkedin, SiMake, SiN8N, SiOpenai, SiSalesforce, SiSlack, SiTelegram, SiWhatsapp, SiZoom } from "react-icons/si";
import { FaRegCircle } from "react-icons/fa";
import { BiLogoMicrosoftTeams } from "react-icons/bi";
import { TbArrowsRight, TbArrowsJoin2 } from "react-icons/tb";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { eventsService } from "@/services/eventsService";
import segmentationService, { Segment } from "@/services/segmentationService";
import {
    CreateJourneyDTO,
    journeyManagementService,
} from "@/components/journeys/journeyService";
import EmailNodeForm from "@/components/journeys/builder/components/emailNode";
// import { SpeakerLoudIcon } from "@radix-ui/react-icons";
import WaitNodeForm from "@/components/journeys/builder/components/waitNode";
import { WorkflowHeader } from "@/components/journeys/workflow-header";
import { LinkedInLogoIcon } from "@radix-ui/react-icons";
import { nodesList } from "./nodesList";

const baseHandleClasses = "!w-2 !h-4 !rounded-sm !border-0 transition-colors duration-200";
const handleClasss = `${baseHandleClasses} !bg-gray-600 hover:!bg-blue-500`;


const InfoTooltip = ({ content }) => (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <InfoIcon className="h-4 w-4 ml-2 cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="  p-2 max-w-xs">
                <p>{content}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
);

const TriggerNodeForm = ({ node, updateNodeData }) => {
    const [triggerType, setTriggerType] = useState(
        node.data.triggerType || "event"
    );
    const [segmentAction, setSegmentAction] = useState(
        node.data.segmentAction || "joins"
    );
    const [events, setEvents] = useState<string[]>([]);
    const [segments, setSegments] = useState<Segment[]>([]);
    // const [isSaving, setIsSaving] = useState(false);
    // const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

    const { toast } = useToast();
    useEffect(() => {
        // Fetch events and segments when the component mounts
        const fetchData = async () => {
            try {
                // const [eventNames, segmentList] = await Promise.all([
                //   eventsService.getUniqueEventNames(),
                //   segmentationService.listSegments(),
                // ]);
                setEvents([]);
                setSegments([]);
            } catch (error) {
                console.error("Error fetching data:", error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to fetch events and segments.",
                });
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        updateNodeData("triggerType", triggerType);
    }, [triggerType]);

    useEffect(() => {
        updateNodeData("segmentAction", segmentAction);
    }, [segmentAction]);

    const handleUpdateNodeData = (key, value) => {
        updateNodeData(key, value);
    };

    const handleSegmentChange = (segmentId: string) => {
        const selectedSegment = segments.find((seg) => seg.id === segmentId);
        console.log("Selected Segment:", selectedSegment);
        updateNodeData("segment", segmentId);
        updateNodeData("segmentName", selectedSegment ? selectedSegment.name : "");
    };

    return (
        <Card className="w-full shadow-lg border">
            <CardHeader>
                <CardTitle className="text-2xl font-bold ">
                    Configure Trigger
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm mb-4">
                    Select the type of trigger and configure its details to start your
                    journey.
                </p>
                <Tabs
                    value={triggerType}
                    onValueChange={setTriggerType}
                    className="w-full"
                >
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger
                            value="event"
                            className="data-[state=active]:bg-meadow-700"
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            Event
                        </TabsTrigger>
                        <TabsTrigger
                            value="segment"
                            className="data-[state=active]:bg-meadow-700"
                        >
                            <UsersIcon className="mr-2 h-4 w-4" />
                            Segment
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="event" className="mt-4">
                        <div className="space-y-4">
                            <div>
                                <Label
                                    htmlFor="event"
                                    className=" mb-2 block flex items-center"
                                >
                                    Select Event
                                    <InfoTooltip content="Choose the event that will trigger this journey." />
                                </Label>
                                <Select
                                    onValueChange={(value) =>
                                        handleUpdateNodeData("event", value)
                                    }
                                    value={node.data.event}
                                >
                                    <SelectTrigger
                                        id="event"
                                        className="w-full focus:ring-meadow-500 text-white"
                                    >
                                        <SelectValue placeholder="Choose an event" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {events.map((event) => (
                                            <SelectItem
                                                key={event}
                                                value={event}
                                                className="text-white"
                                            >
                                                {event}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label
                                    htmlFor="eventProperty"
                                    className=" mb-2 block flex items-center"
                                >
                                    Event Property (optional)
                                    <InfoTooltip content="Specify a property of the event to further refine your trigger condition." />
                                </Label>
                                <Input
                                    id="eventProperty"
                                    placeholder="e.g., total_value"
                                    value={node.data.eventProperty || ""}
                                    onChange={(e) =>
                                        handleUpdateNodeData("eventProperty", e.target.value)
                                    }
                                    className="focus:ring-meadow-500 text-white placeholder-meadow-600"
                                />
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="segment" className="mt-4">
                        <div className="space-y-4">
                            <div>
                                <Label
                                    htmlFor="segment"
                                    className=" mb-2 block flex items-center"
                                >
                                    Select Segment
                                    <InfoTooltip content="Choose the user segment that this trigger will apply to." />
                                </Label>
                                <Select
                                    onValueChange={handleSegmentChange}
                                    value={node.data.segment}
                                >
                                    <SelectTrigger
                                        id="segment"
                                        className="w-full focus:ring-meadow-500"
                                    >
                                        <SelectValue placeholder="Choose a segment" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {segments.map((segment) => (
                                            <SelectItem
                                                key={segment.id}
                                                value={segment.id}
                                                className="text-white"
                                            >
                                                {segment.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label className=" mb-2 block flex items-center">
                                    Trigger When
                                    <InfoTooltip content="Specify whether the journey should start when a user joins or leaves the selected segment." />
                                </Label>
                                <div className="flex space-x-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => setSegmentAction("joins")}
                                        className={`flex-1 ${segmentAction === "joins"
                                            ? "bg-meadow-700 text-black border-meadow-500"
                                            : "hover:bg-meadow-800 hover:text-black"
                                            }`}
                                    >
                                        Joins Segment
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setSegmentAction("leaves")}
                                        className={`flex-1 ${segmentAction === "leaves"
                                            ? "bg-meadow-700 text-black border-meadow-500"
                                            : "hover:bg-meadow-800 hover:text-black"
                                            }`}
                                    >
                                        Leaves Segment
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};

const NodeWrapper = ({ children, icon: Icon, label, type }) => {
    return (
        <div
            className={`bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-200 hover:ring-2 hover:ring-primary`}
            style={{ minWidth: "200px" }}
        >
            <div className="bg-indigo-500">
                <div className="flex items-center space-x-2 p-2 text-white">
                    <Icon size={20} />
                    <h3 className="font-semibold truncate">{label}</h3>
                </div>
            </div>
            <div className="p-4">{children}</div>
        </div>
    );
};

const TriggerNode = ({ data }) => {


    return (
        <NodeWrapper icon={Play} label={data.label} type="trigger">
            <div className="text-sm font-medium mb-2">
                {data.triggerType === "segment"
                    ? `Segment: ${data.segmentName || "Not Set"} (${data.segmentAction || "Not Set"})`
                    : `Event: ${data.event || "Not Set"}`}
            </div>
            <div className="flex items-center justify-between text-xs">
                <div className="flex items-center">
                    <Info size={12} className="mr-1" />
                    <span>Type: {data.triggerType}</span>
                </div>
            </div>
            <Handle
                type="source"
                position={Position.Right}
                className={handleClasss}
            />
        </NodeWrapper>
    );
};

export const EmailNode = ({ data }) => {
    return (
        <NodeWrapper icon={Mail} label={data.label} type="email">
            <div className="space-y-2">
                <div className="flex items-center  text-sm">
                    <Link2Icon size={14} className="mr-2" />
                    <span className="truncate">
                        {data.templateName || "Set Template..."}
                    </span>
                </div>
                <div className="flex items-center text-sm">
                    <Captions size={14} className="mr-2" />
                    <span className="truncate">{data.subject || "Email Subject..."}</span>
                </div>
                <div className="flex items-center text-xs">
                    <Zap size={12} className="mr-1" />
                    <span>{data.automationType || "Automated"}</span>
                </div>
            </div>
            <Handle
                type="target"
                position={Position.Left}
                className={handleClasss}
            />
            <Handle
                type="source"
                position={Position.Right}
                className={handleClasss}
            />
        </NodeWrapper>
    );
};

export const SMSNode = ({ data }) => {
    return (
        <NodeWrapper icon={MessageCircle} label={data.label} type="sms">
            <div className="space-y-2">
                <div className="flex items-center text-sm">
                    <MessageSquare size={14} className="mr-2" />
                    <span className="truncate">{data.message || "Set message..."}</span>
                </div>
                <div className="flex items-center text-sm">
                    <User size={14} className="mr-2" />
                    <span className="truncate">
                        {data.recipient || "Set recipient..."}
                    </span>
                </div>
            </div>
            <Handle
                type="target"
                position={Position.Left}
                className={handleClasss}
            />
            <Handle
                type="source"
                position={Position.Right}
                className={handleClasss}
            />
        </NodeWrapper>
    );
};

export const PushNotificationNode = ({ data }) => {
    return (
        <NodeWrapper icon={Bell} label={data.label} type="pushNotification">
            <div className="space-y-2">
                <div className="flex items-center text-sm">
                    <MessageSquare size={14} className="mr-2" />
                    <span className="truncate">{data.title || "Set title..."}</span>
                </div>
                <div className="flex items-center text-sm">
                    <Info size={14} className="mr-2" />
                    <span className="truncate">{data.body || "Set body..."}</span>
                </div>
            </div>
            <Handle
                type="target"
                position={Position.Left}
                className={handleClasss}
            />
            <Handle
                type="source"
                position={Position.Right}
                className={handleClasss}
            />
        </NodeWrapper>
    );
};


export const SplitNode = ({ data }) => {
    const baseHandleClasses = "!w-4 !h-2 !rounded-sm !border-0 transition-colors duration-200";
    const inputHandleClasses = `${baseHandleClasses} !bg-gray-600 hover:!bg-blue-500`;
    const yesHandleClasses = `${baseHandleClasses} !bg-green-500 hover:!bg-green-700`;
    const noHandleClasses = `${baseHandleClasses} !bg-red-500 hover:!bg-red-700`;

    return (
        <NodeWrapper icon={GitBranch} label={data.label} type="split">
            <div className="text-sm mb-3">
                {data.condition || "Set condition..."}
            </div>
            <div className="flex flex-col gap-4">
                {/* Yes option group */}
                <div className="flex items-center justify-end text-xs relative" style={{ height: '30px' }}>
                    <div className="flex items-center">
                        <CheckCircle size={12} className="mr-1" />
                        <span>Option A: {data.yesLabel || "Continue"}</span>
                    </div>
                    <Handle
                        type="source"
                        position={Position.Right}
                        id="yes"
                        className={yesHandleClasses}
                        style={{ 
                            position: 'absolute',
                            right: '-30px', // Adjust this value as needed
                            top: '50%',
                            transform: 'translateY(-50%)'
                        }}
                    />
                </div>

                {/* No option group */}
                <div className="flex items-center justify-end text-xs relative" style={{ height: '30px' }}>
                    <div className="flex items-center">
                        <CheckCircle size={12} className="mr-1" />
                        <span>Option B: {data.noLabel || "Exit"}</span>
                    </div>
                    <Handle
                        type="source"
                        position={Position.Right}
                        id="no"
                        className={noHandleClasses}
                        style={{ 
                            position: 'absolute',
                            right: '-30px', // Adjust this value as needed
                            top: '50%',
                            transform: 'translateY(-50%)'
                        }}
                    />
                </div>
            </div>
            {/* Input handle at the left */}
            <Handle
                type="target"
                position={Position.Left}
                className={inputHandleClasses}
                style={{
                    position: 'absolute',
                    left: '-12px', // Adjust this value as needed
                    top: '50%',
                    transform: 'translateY(-50%)'
                }}
            />
        </NodeWrapper>
    );
};
export const ConditionNode = ({ data }) => {
    // Common handle styles with Tailwind
    const baseHandleClasses = "!w-4 !h-2 !rounded-sm !border-0 transition-colors duration-200";
    const inputHandleClasses = `${baseHandleClasses} !bg-gray-600 hover:!bg-blue-500`;
    const yesHandleClasses = `${baseHandleClasses} !bg-green-500 hover:!bg-green-700`;
    const noHandleClasses = `${baseHandleClasses} !bg-red-500 hover:!bg-red-700`;

    return (
        <NodeWrapper icon={GitBranch} label={data.label} type="split">
            <div className="text-sm mb-3">
                {data.condition || "Set condition..."}
            </div>
            <div className="flex justify-between">
                <div className="flex items-center text-green-600 text-xs">
                    <CheckCircle size={12} className="mr-1" />
                    <span>Yes: {data.yesLabel || "Continue"}</span>
                </div>
                <div className="flex items-center text-red-600 text-xs">
                    <XCircle size={12} className="mr-1" />
                    <span>No: {data.noLabel || "Exit"}</span>
                </div>
            </div>
            {/* Input handle at the top */}
            <Handle
                type="target"
                position={Position.Left}
                className={inputHandleClasses}
                style={{ top: -4 }}
            />
            {/* "Yes" output handle - positioned at the bottom left */}
            <Handle
                type="source"
                position={Position.Right}
                id="yes"
                className={yesHandleClasses}
                style={{ left: '25%', bottom: -4 }}
            />
            {/* "No" output handle - positioned at the bottom right */}
            <Handle
                type="source"
                position={Position.Right}
                id="no"
                className={noHandleClasses}
                style={{ left: '75%', bottom: -4 }}
            />
        </NodeWrapper>
    );
};

export const ABTestNode = ({ data }) => {
    return (
        <NodeWrapper icon={Shuffle} label={data.label} type="abTest">
            <div className=" text-sm mb-3">
                A/B Test: {data.testName || "Set test name..."}
            </div>
            <div className="flex justify-between">
                <div className="flex items-center text-green-600 text-xs">
                    <CheckCircle size={12} className="mr-1" />
                    <span>A: {data.variantA || "Variant A"}</span>
                </div>
                <div className="flex items-center text-xs">
                    <CheckCircle size={12} className="mr-1" />
                    <span>B: {data.variantB || "Variant B"}</span>
                </div>
            </div>
            <Handle
                type="target"
                position={Position.Left}
                className={handleClasss}
            />
            <Handle
                type="source"
                position={Position.Right}
                id="a"
                className={handleClasss}
            />
            <Handle
                type="source"
                position={Position.Right}
                id="b"
                className={handleClasss}
            />
        </NodeWrapper>
    );
};

export const ExitNode = ({ data }) => {
    return (
        <NodeWrapper icon={Flag} label={data.label} type="exit">
            <div className="text-sm font-medium mb-2">
                {data.description || "Journey End"}
            </div>
            <Handle
                type="target"
                position={Position.Left}
                className={handleClasss}
            />
        </NodeWrapper>
    );
};

export const WaitNode = ({ data }) => {
    const getWaitDescription = () => {
        if (data.waitType === "duration") {
            return `Wait for ${data.duration} ${data.timeUnit}`;
        } else if (data.waitType === "specificDate") {
            return `Wait until ${new Date(data.specificDate).toLocaleString()}`;
        }
        return "Set wait condition...";
    };

    return (
        <NodeWrapper icon={Clock} label={data.label} type="wait">
            <div className=" text-sm font-medium mb-2">
                {getWaitDescription()}
            </div>
            <Handle
                type="target"
                position={Position.Left}
                className={handleClasss}
            />
            <Handle
                type="source"
                position={Position.Right}
                className={handleClasss}
            />
        </NodeWrapper>
    );
};

export const ActionNode = ({ data }) => {
    return (
        <NodeWrapper icon={Zap} label={data.label} type="action">
            <div className="text-sm font-medium mb-2">
                {data.actionType || "Set action type..."}
            </div>
            <div className="flex items-center text-xs">
                <Info size={12} className="mr-1" />
                <span>{data.description || "No description"}</span>
            </div>
            <Handle
                type="target"
                position={Position.Left}
                className={handleClasss}
            />
            <Handle
                type="source"
                position={Position.Right}
                className={handleClasss}
            />
        </NodeWrapper>
    );
};

export const GenericNode = ({ data }) => {
    const Icon = data.icon || Zap; // Fallback to Zap if no icon provided

    return (
        <NodeWrapper icon={Icon} label={data.label} type="action">
            <div className="text-sm font-medium mb-2">
                {data.actionType || "Set action type..."}
            </div>
            <div className="flex items-center text-xs">
                <Info size={12} className="mr-1" />
                <span>{data.description || "No description"}</span>
            </div>
            <Handle
                type="target"
                position={Position.Left}
                className={handleClasss}
            />
            <Handle
                type="source"
                position={Position.Right}
                className={handleClasss}
            />
        </NodeWrapper>
    );
};

export const CallNode = ({ data }) => {
    return (
        <NodeWrapper icon={PhoneCallIcon} label={data.label} type="call">
            <div className="text-sm font-medium mb-2">
                {data.phoneNumber || "Set phone number..."}
            </div>
            <div className="flex items-center text-xs">
                <Info size={12} className="mr-1" />
                <span>{data.description || "No description"}</span>
            </div>
            <Handle
                type="target"
                position={Position.Left}
                className={handleClasss}
            />
            <Handle
                type="source"
                position={Position.Right}
                className={handleClasss}
            />
        </NodeWrapper>
    );
}


const generateNodeTypes = (nodesList) => {
    const types = {
        triggerNode: TriggerNode,
        pushNotificationNode: PushNotificationNode,
        splitNode: SplitNode,
        abTestNode: ABTestNode,
        exitNode: ExitNode,
        waitNode: WaitNode,
        actionNode: ActionNode,
        conditionNode: ConditionNode,
    };

    // Iterate through nodesList and add GenericNode with metadata
    nodesList.forEach(category => {
        category.nodes.forEach(node => {
            if (!types[node.type]) {
                types[node.type] = (props) => GenericNode({
                    ...props,
                    data: {
                        ...props.data,
                        label: node.label,
                        icon: node.icon,
                        disabled: node.disabled,
                    }
                });
            }
        });
    });

    return types;
};

// Update the nodeTypes export to use the helper function
export const nodeTypes = generateNodeTypes(nodesList);

export const NodeProperties = ({ node, setNodes, onClose }) => {
    const updateNodeData = (key, value) => {
        console.log("Updating node data:", node);
        setNodes((nds) =>
            nds.map((n) => {
                if (n.id === node.id) {
                    const updatedNode = { ...n, data: { ...n.data, [key]: value } };
                    console.log("Updated node:", updatedNode);
                    return updatedNode;
                }

                return n;
            })
        );
    };

    const renderNodeSpecificProperties = () => {
        switch (node.type) {
            case "emailNode":
                return <EmailNodeForm node={node} updateNodeData={updateNodeData} />;
            case "smsNode":
                return (
                    <>
                        <div>
                            <Label htmlFor="message" className="text-meadow-500">
                                Message
                            </Label>
                            <Textarea
                                id="message"
                                value={node.data.message || ""}
                                onChange={(e) => updateNodeData("message", e.target.value)}
                                className=" text-white border-meadow-500/50"
                                rows={3}
                            />
                        </div>
                        <div>
                            <Label htmlFor="recipient" className="text-meadow-500">
                                Recipient
                            </Label>
                            <Input
                                id="recipient"
                                value={node.data.recipient || ""}
                                onChange={(e) => updateNodeData("recipient", e.target.value)}
                                className=" text-white border-meadow-500/50"
                            />
                        </div>
                    </>
                );
            case "pushNotificationNode":
                return (
                    <>
                        <div>
                            <Label htmlFor="title" className="text-meadow-500">
                                Title
                            </Label>
                            <Input
                                id="title"
                                value={node.data.title || ""}
                                onChange={(e) => updateNodeData("title", e.target.value)}
                                className=" text-white border-meadow-500/50"
                            />
                        </div>
                        <div>
                            <Label htmlFor="body" className="text-meadow-500">
                                Body
                            </Label>
                            <Textarea
                                id="body"
                                value={node.data.body || ""}
                                onChange={(e) => updateNodeData("body", e.target.value)}
                                className=" text-white border-meadow-500/50"
                                rows={3}
                            />
                        </div>
                    </>
                );
            case "abTestNode":
                return (
                    <>
                        <div>
                            <Label htmlFor="testName" className="text-meadow-500">
                                Test Name
                            </Label>
                            <Input
                                id="testName"
                                value={node.data.testName || ""}
                                onChange={(e) => updateNodeData("testName", e.target.value)}
                                className=" text-white border-meadow-500/50"
                            />
                        </div>
                        <div>
                            <Label htmlFor="variantA" className="text-meadow-500">
                                Variant A
                            </Label>
                            <Input
                                id="variantA"
                                value={node.data.variantA || ""}
                                onChange={(e) => updateNodeData("variantA", e.target.value)}
                                className=" text-white border-meadow-500/50"
                            />
                        </div>
                        <div>
                            <Label htmlFor="variantB" className="text-meadow-500">
                                Variant B
                            </Label>
                            <Input
                                id="variantB"
                                value={node.data.variantB || ""}
                                onChange={(e) => updateNodeData("variantB", e.target.value)}
                                className=" text-white border-meadow-500/50"
                            />
                        </div>
                    </>
                );
            case "triggerNode":
                return <TriggerNodeForm node={node} updateNodeData={updateNodeData} />;
            case "waitNode":
                return <WaitNodeForm node={node} updateNodeData={updateNodeData} />;
            default:
                return null;
        }
    };

    return (
        <Sheet open={true} onOpenChange={onClose}>
            <SheetContent className="w-full sm:max-w-[400px] border-l border-meadow-500/20">
                <SheetHeader>
                    <SheetTitle className="text-2xl font-bold text-meadow-500">
                        Edit {node.type.replace("Node", "")}
                    </SheetTitle>
                    <SheetDescription className="">
                        Customize the properties of this node.
                    </SheetDescription>
                </SheetHeader>
                <ScrollArea className="mt-6 h-[calc(100vh-180px)]">
                    <div className="space-y-6 pr-4">
                        {/* <div>
              <Label htmlFor="label" className="text-meadow-500">
                Label
              </Label>
              <Input
                id="label"
                value={node.data.label || ""}
                onChange={(e) => updateNodeData("label", e.target.value)}
                className=" text-white border-meadow-500/50"
              />
            </div> */}
                        {renderNodeSpecificProperties()}
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
};