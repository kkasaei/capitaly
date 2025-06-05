/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Play,
    Pause,
    BarChart2,
    Eye,
    CheckCircle,
    AlertTriangle,
    Zap,
    UserCircle,
    KeyIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { useJourneyContext } from "@/components/journeys/journeyContext";
import {
    journeyManagementService,
    JourneyMetrics,
    JourneyActivity,
    Journey,
    JourneyStatus,
    TriggerInfo,
    JourneyWithMetrics,
} from "@/components/journeys/journeyService";
import { motion } from "framer-motion";
import { integrations } from "@/components/journeys/nodesList";
import { api } from "@/lib/trpc/react";
import { toast } from "sonner";

export default function JourneyListPage() {

    const utils = api.useUtils();

    const [activeTab, setActiveTab] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedJourney, setSelectedJourney] = useState<JourneyWithMetrics | null>(null);
    const [isAnalyticsPanelOpen, setIsAnalyticsPanelOpen] = useState(false);
    const [isCredentialsDialogOpen, setIsCredentialsOpen] = useState(false);
    const [newJourneyName, setNewJourneyName] = useState("");
    const [newJourneyRepeatOption, setNewJourneyRepeatOption] = useState("once");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [journeyToDelete, setJourneyToDelete] =
        useState<JourneyWithMetrics | null>(null);
    const [statusChangeDialogOpen, setStatusChangeDialogOpen] = useState(false);
    const [journeyToChangeStatus, setJourneyToChangeStatus] =
        useState<JourneyWithMetrics | null>(null);
    const [journeys, setJourneys] = useState<JourneyWithMetrics[]>([]);
    const [journeyMetrics, setJourneyMetrics] = useState<JourneyMetrics | null>(
        null
    );
    const [recentActivities, setRecentActivities] = useState<JourneyActivity[]>(
        []
    );
    const router = useRouter();
    const { setNewJourneyDetails } = useJourneyContext();

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);


    const {
        data: fetchedJourneys,
    } = api.journey.getAll.useQuery({
        search: searchQuery,
        limit: 10,
    });

    const {
        mutate: deleteJourney,
    } = api.journey.delete.useMutation({
        onSuccess: () => {
            // Fetch data again
            utils.journey.getAll.invalidate();
            toast.success("Journey deleted successfully");
        },
    });


    useEffect(() => {
        if (fetchedJourneys) {
            setJourneys(fetchedJourneys as any || []);
        }
    }, [fetchedJourneys]);

    // useEffect(() => {
    //     fetchJourneys();
    // }, [activeTab]);

    // const fetchJourneys = async () => {
    //     try {
    //         const status =
    //             activeTab !== "all"
    //                 ? (activeTab.toUpperCase() as JourneyStatus)
    //                 : undefined;
    //         const fetchedJourneys = await journeyManagementService.listJourneys(
    //             status
    //         );

    //         setJourneys(fetchedJourneys);
    //     } catch (error) {
    //         console.error("Error fetching journeys:", error);
    //     }
    // };

    const extractTriggerInfo = (journey: Journey): TriggerInfo => {
        const triggerNode = journey.definition.nodes.find(
            (node) => node.type === "triggerNode"
        );
        if (triggerNode && triggerNode.data.triggerType) {
            return {
                type: triggerNode.data.triggerType as "event" | "segment" | null,
                name:
                    triggerNode.data.triggerType === "segment"
                        ? (triggerNode.data.segmentAction as string) || "Segment"
                        : "Event Triggered",
            };
        }
        return { type: null, name: null };
    };

    const fetchJourneyMetrics = async (journeyId: string) => {
        try {
            const metrics =
                await journeyManagementService.getJourneyMetrics(journeyId);
            setJourneyMetrics(metrics);
        } catch (error) {
            console.error("Error fetching journey metrics:", error);
        }
    };

    const fetchRecentActivities = async (journeyId: string) => {
        try {
            const activities =
                await journeyManagementService.getRecentJourneyActivity(journeyId, 5);
            setRecentActivities(activities);
        } catch (error) {
            console.error("Error fetching recent activities:", error);
        }
    };

    const createJourney = async () => {
        try {
            // const newJourney = await journeyManagementService.createJourney({
            //   name: newJourneyName,
            //   runMultipleTimes: newJourneyRepeatOption === "multiple",
            //   definition: { nodes: [], edges: [] }, // Initialize with empty definition
            // });
            setNewJourneyDetails({
                name: newJourneyName,
                repeatOption: newJourneyRepeatOption,
            });
            console.log("Creating journey172...");
            router.push(`/builder`);
        } catch (error) {
            console.error("Error creating journey:", error);
        }
    };

    const handleDeleteConfirm = async () => {
        if (journeyToDelete) {
            try {
                // await journeyManagementService.updateJourney(journeyToDelete.id, {
                //     status: "ARCHIVED" as any,
                // });
                // setJourneys(
                //     journeys.filter((journey) => journey.id !== journeyToDelete.id)
                // );
                deleteJourney({
                    id: journeyToDelete.id,
                });

                setDeleteDialogOpen(false);
                setJourneyToDelete(null);
            } catch (error) {
                console.error("Error deleting journey:", error);
            }
        }
    };

    const handleStatusChangeConfirm = async () => {
        if (journeyToChangeStatus) {
            const newStatus: JourneyStatus =
                journeyToChangeStatus.status === JourneyStatus.ACTIVE
                    ? JourneyStatus.PAUSED
                    : ("ACTIVE" as JourneyStatus);
            try {
                await journeyManagementService.updateJourney(journeyToChangeStatus.id, {
                    status: newStatus,
                });
                setJourneys(
                    journeys.map((journey) =>
                        journey.id === journeyToChangeStatus.id
                            ? { ...journey, status: newStatus }
                            : journey
                    )
                );
                setStatusChangeDialogOpen(false);
                setJourneyToChangeStatus(null);
            } catch (error) {
                console.error("Error changing journey status:", error);
            }
        }
    };

    const filteredJourneys = journeys.filter(
        (journey) =>
            journey.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (activeTab === "all" || journey.status.toLowerCase() === activeTab)
    );

    const handleCreateJourneyClick = async () => {
        const isSubscribed = true;
        if (isSubscribed) {
            setIsCreateDialogOpen(true);
        }
    };

    const StatusBadge = ({ status }: { status: JourneyStatus }) => {
        const statusConfig: Record<JourneyStatus, { color: string; icon: React.ElementType }> = {
            ACTIVE: { color: "bg-green-500", icon: CheckCircle },
            PAUSED: { color: "bg-yellow-500", icon: Pause },
            DRAFT: { color: "", icon: Edit2 },
            ARCHIVED: { color: "bg-gray-500", icon: Trash2 },
        };
        const { color, icon: Icon } = statusConfig[status] || {};

        return (
            <Badge variant="outline" className={`${color} `}>
                <Icon size={12} className="mr-1" />
                <span className="capitalize">{status.toLowerCase()}</span>
            </Badge>
        );
    };

    const TriggerBadge: React.FC<{ trigger: TriggerInfo }> = ({ trigger }) => {
        if (!trigger.type) return null;

        const triggerConfig: Record<
            string,
            { icon: React.ElementType; label: string }
        > = {
            event: { icon: Zap, label: "Event" },
            segment: { icon: UserCircle, label: "Segment" },
        };
        const { icon: Icon, label } = triggerConfig[trigger.type] || {};

        return (
            <Badge variant="outline" className="bg-meadow-500 ">
                {Icon && <Icon size={12} className="mr-1" />}
                <span>
                    {label}: {trigger.name}
                </span>
            </Badge>
        );
    };

    const JourneyList = () => (
        <Card className=" border-meadow-500/20">
            <Table>
                <TableHeader>
                    <TableRow className="border-meadow-500/20 hover:">
                        <TableHead >Name</TableHead>
                        <TableHead >Status</TableHead>
                        <TableHead >Trigger</TableHead>
                        <TableHead >Steps</TableHead>
                        {/* <TableHead >Audience</TableHead> */}
                        <TableHead >Run Count</TableHead>
                        <TableHead >Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredJourneys.map((journey) => (
                        <TableRow
                            key={journey.id}
                            className="border-meadow-500/20 hover:"
                        >
                            <TableCell className="font-medium ">
                                {journey.name}
                            </TableCell>
                            <TableCell>
                                <StatusBadge status={journey.status} />
                            </TableCell>
                            <TableCell>
                                <TriggerBadge trigger={extractTriggerInfo(journey)} />
                            </TableCell>
                            <TableCell className="">
                                {journey.definition.nodes.length}
                            </TableCell>
                            <TableCell className="">
                                {journey.metrics?.totalUsers.toLocaleString()}
                            </TableCell>
                            <TableCell>
                                <div className="w-full  rounded-full h-2.5">
                                    <div
                                        className="bg-meadow-500 h-2.5 rounded-full"
                                        style={{
                                            width: `${journey.metrics?.completionRate || 0}%`,
                                        }}
                                    ></div>
                                </div>
                                <span className="text-sm text-meadow-500 mt-1">
                                    {journey.metrics?.completionRate || 0}%
                                </span>
                            </TableCell>
                            <TableCell>
                                <div className="flex space-x-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setSelectedJourney(journey);
                                            fetchJourneyMetrics(journey.id);
                                            fetchRecentActivities(journey.id);
                                        }}
                                        className="text-meadow-500 hover: hover:"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            router.push(`/builder/${journey.id}`)
                                        }
                                        className="text-meadow-500 hover: hover:"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setJourneyToDelete(journey);
                                            setDeleteDialogOpen(true);
                                        }}
                                        className="text-meadow-500 hover: hover:"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setJourneyToChangeStatus(journey);
                                            setStatusChangeDialogOpen(true);
                                        }}
                                        className="text-meadow-500 hover: hover:"
                                    >
                                        {journey.status === "ACTIVE" ? (
                                            <Pause className="h-4 w-4" />
                                        ) : (
                                            <Play className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );

    const JourneyDetails = ({ journey }: { journey: JourneyWithMetrics }) => (
        <Sheet
            open={!!selectedJourney}
            onOpenChange={() => setSelectedJourney(null)}
        >
            <SheetContent
                side="right"
                className="w-full sm:max-w-[600px]  border-l border-meadow-500/20"
            >
                <SheetHeader>
                    <SheetTitle className="text-2xl font-bold text-meadow-500">
                        {journey.name}
                    </SheetTitle>
                    <SheetDescription className="">
                        Journey details and analytics
                    </SheetDescription>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-100px)] mt-6 pr-4">
                    <div className="space-y-6 pb-8">
                        <div className="grid grid-cols-3 gap-4">
                            <Card className=" border-meadow-500/20">
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium text-meadow-500">
                                        Status
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <StatusBadge status={journey.status} />
                                </CardContent>
                            </Card>
                            <Card className=" border-meadow-500/20">
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium text-meadow-500">
                                        Trigger
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <TriggerBadge trigger={extractTriggerInfo(journey)} />
                                </CardContent>
                            </Card>
                            <Card className=" border-meadow-500/20">
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium text-meadow-500">
                                        Steps
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-lg font-semibold ">
                                        {journey.definition.nodes.length}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        <Card className=" border-meadow-500/20">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold text-meadow-500">
                                    Performance Overview
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-sm text-meadow-500">Audience Size</p>
                                        <p className="text-2xl font-bold ">
                                            {journeyMetrics?.totalUsers.toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-meadow-500">Completion Rate</p>
                                        <p className="text-2xl font-bold ">
                                            {journeyMetrics?.completionRate}%
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-meadow-500">
                                            Avg. Time to Complete
                                        </p>
                                        <p className="text-2xl font-bold ">
                                            {journeyMetrics?.averageCompletionTime.toFixed(1)} days
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className=" border-meadow-500/20">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold text-meadow-500">
                                    Journey Steps
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {journey.definition.nodes.map((node: any, index: number) => (
                                        <div key={node.id} className="flex items-center space-x-4">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-meadow-500 flex items-center justify-center  font-bold">
                                                {index + 1}
                                            </div>
                                            <div className="flex-grow">
                                                <p className="font-medium ">
                                                    {node.data.name || `Step ${index + 1}`}
                                                </p>
                                                <p className="text-sm text-meadow-500">{node.type}</p>
                                            </div>
                                            <div className="text-sm text-meadow-500">
                                                Conversion:{" "}
                                                {(
                                                    (journeyMetrics?.stepMetrics?.[node.id]?.completed || 0) /
                                                    (journeyMetrics?.stepMetrics?.[node.id]?.total || 1) *
                                                    100 || 0
                                                ).toFixed(2)}
                                                %
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className=" border-meadow-500/20">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold text-meadow-500">
                                    Recent Activity
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentActivities.map((activity) => (
                                        <div
                                            key={activity.id}
                                            className="flex items-center space-x-4"
                                        >
                                            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-meadow-500"></div>
                                            <div>
                                                <p className="font-medium ">
                                                    {activity.type}: {activity.nodeName}
                                                </p>
                                                <p className="text-sm text-meadow-500">
                                                    User ID: {activity.userId}
                                                </p>
                                            </div>
                                            <div className="ml-auto text-sm text-meadow-500">
                                                {new Date(activity.timestamp).toLocaleString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );

    const AnalyticsPanel = () => (
        <Sheet open={isAnalyticsPanelOpen} onOpenChange={setIsAnalyticsPanelOpen}>
            <SheetContent
                side="right"
                className="w-full sm:max-w-[900px]  border-l border-meadow-500/20"
            >
                <SheetHeader>
                    <SheetTitle className="text-2xl font-bold text-meadow-500">
                        Camapaign Analytics Dashboard
                    </SheetTitle>
                    <SheetDescription className="">
                        Comprehensive overview of all your camapaign performances
                    </SheetDescription>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-100px)] mt-6 pr-4">
                    <div className="space-y-8 pb-8">
                        <Card className=" border-meadow-500/20">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold text-meadow-500">
                                    Overall Performance
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className=" p-4 rounded-lg">
                                        <p className="text-sm text-meadow-500">
                                            Total Active Camapaigns
                                        </p>
                                        <p className="text-3xl font-bold ">
                                            {journeys.filter((j) => j.status === "ACTIVE").length}
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-lg">
                                        <p className="text-sm text-meadow-500">
                                            Avg. Completion Rate
                                        </p>
                                        <p className="text-3xl font-bold ">
                                            {(
                                                journeys.reduce(
                                                    (sum: number, j: JourneyWithMetrics) => sum + (j.metrics?.completionRate || 0),
                                                    0
                                                ) / journeys.length
                                            ).toFixed(1)}
                                            %
                                        </p>
                                    </div>
                                    <div className=" p-4 rounded-lg">
                                        <p className="text-sm text-meadow-500">
                                            Total Users in Camapaigns
                                        </p>
                                        <p className="text-3xl font-bold ">
                                            {journeys
                                                .reduce(
                                                    (sum, j) => sum + (j.metrics?.totalUsers || 0),
                                                    0
                                                )
                                                .toLocaleString()}
                                        </p>
                                    </div>
                                    <div className=" p-4 rounded-lg">
                                        <p className="text-sm text-meadow-500">
                                            Camapaigns Created (Last 30 days)
                                        </p>
                                        <p className="text-3xl font-bold ">
                                            {
                                                journeys.filter(
                                                    (j) =>
                                                        new Date(j.createdAt) >
                                                        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                                                ).length
                                            }
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className=" border-meadow-500/20">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold text-meadow-500">
                                    Top Performing Campaigns
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {journeys
                                        .sort(
                                            (a, b) =>
                                                (b.metrics?.completionRate || 0) -
                                                (a.metrics?.completionRate || 0)
                                        )
                                        .slice(0, 3)
                                        .map((journey) => (
                                            <div
                                                key={journey.id}
                                                className="flex items-center justify-between  p-4 rounded-lg"
                                            >
                                                <div>
                                                    <p className="font-medium ">
                                                        {journey.name}
                                                    </p>
                                                    <TriggerBadge trigger={extractTriggerInfo(journey)} />
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium ">
                                                        {journey.metrics?.completionRate || 0}%
                                                    </p>
                                                    <p className="text-sm text-meadow-500">
                                                        Completion Rate
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className=" border-meadow-500/20">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold text-meadow-500">
                                    Recent Activities
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentActivities.map((activity) => (
                                        <div
                                            key={activity.id}
                                            className="flex items-center space-x-4  p-3 rounded-lg"
                                        >
                                            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-meadow-500"></div>
                                            <div className="flex-grow">
                                                <p className="">
                                                    {activity.type}:{" "}
                                                    <span className="font-medium">
                                                        {activity.nodeName}
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="text-sm text-meadow-500">
                                                {new Date(activity.timestamp).toLocaleString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );

    type IntegrationStatus = 'connected' | 'needs_setup' | 'failed' | 'disconnected';

    const CredntialsPanel = () => {
        const [credentialsTab, setCredentialsTab] = useState("available");
        const [credentialsSearch, setCredentialsSearch] = useState("");
        const [showPanel, setShowPanel] = useState(false);

        // Extract tools from integrations
        const allTools = React.useMemo(() => {
            return integrations.map(integration => {
                return {
                    type: integration.type,
                    label: integration.label,
                    icon: integration.icon,
                    image: integration.image,
                    status: (Math.random() > 0.7 ? "connected" :
                        Math.random() > 0.5 ? "needs_setup" :
                            Math.random() > 0.3 ? "failed" : "disconnected") as IntegrationStatus,
                    category: "Integration"
                };
            });
        }, []);

        // Filter tools based on search and tab
        const filteredTools = React.useMemo(() => {
            return allTools.filter(tool => {
                const matchesSearch = tool.label.toLowerCase().includes(credentialsSearch.toLowerCase()) ||
                    tool.category.toLowerCase().includes(credentialsSearch.toLowerCase());

                if (!matchesSearch) return false;

                if (credentialsTab === "available") return true;
                if (credentialsTab === "active") return tool.status === "connected";
                if (credentialsTab === "issues") return ["needs_setup", "failed", "disconnected"].includes(tool.status);

                return true;
            });
        }, [allTools, credentialsSearch, credentialsTab]);

        const getStatusBadge = (status: IntegrationStatus) => {
            const statusConfig: Record<IntegrationStatus, { color: string; label: string }> = {
                connected: { color: "bg-green-500", label: "Connected" },
                needs_setup: { color: "bg-yellow-500", label: "Needs Setup" },
                failed: { color: "bg-red-500", label: "Failed" },
                disconnected: { color: "bg-slate-500", label: "Disconnected" }
            };

            const { color, label } = statusConfig[status] || { color: "", label: "" };

            return (
                <Badge variant="outline" className={`${color} text-white`}>
                    {label}
                </Badge>
            );
        };

        const getButtonText = () => {
            if (credentialsTab === "available") return "Connect";
            if (credentialsTab === "active") return "Manage";
            if (credentialsTab === "issues") return "Reconnect";
            return "Connect";
        };

        return (
            <>
                <Sheet open={isCredentialsDialogOpen} onOpenChange={setIsCredentialsOpen}>
                    <SheetContent
                        side="right"
                        className="w-full sm:max-w-[500px] border-l border-meadow-500/20"
                    >
                        <SheetHeader>
                            <SheetTitle className="text-2xl font-bold text-meadow-500">
                                Credentials Dashboard
                            </SheetTitle>
                            <SheetDescription className="">
                                Manage your third-party integrations and API keys
                            </SheetDescription>
                        </SheetHeader>
                        <div className="mt-6 space-y-4">
                            <div className="flex flex-col justify-between items-center gap-4">
                                <Tabs
                                    value={credentialsTab}
                                    onValueChange={setCredentialsTab}
                                    className="w-full"
                                >
                                    <TabsList className="w-full">
                                        <TabsTrigger
                                            value="available"
                                            className="text-meadow-500 data-[state=active]:bg-meadow-500 data-[state=active]:text-black"
                                        >
                                            All Available
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="active"
                                            className="text-meadow-500 data-[state=active]:bg-meadow-500 data-[state=active]:text-black"
                                        >
                                            Active Connections
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="issues"
                                            className="text-meadow-500 data-[state=active]:bg-meadow-500 data-[state=active]:text-black"
                                        >
                                            Setup Required
                                        </TabsTrigger>
                                    </TabsList>
                                </Tabs>
                                <div className="relative w-full">
                                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-meadow-500" />
                                    <Input
                                        type="text"
                                        placeholder="Search integrations..."
                                        value={credentialsSearch}
                                        onChange={(e) => setCredentialsSearch(e.target.value)}
                                        className="min-w-full border-meadow-500 focus:ring-meadow-500 rounded-full"
                                    />
                                </div>
                            </div>

                            <ScrollArea className="h-[calc(100vh-200px)]">
                                <div className="space-y-4 pb-8">
                                    {filteredTools.length > 0 ? (
                                        filteredTools.map((tool, index) => {
                                            const Icon = tool.icon;
                                            return (
                                                <Card key={index} className="border-meadow-500/20">
                                                    <CardContent className="p-4">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center space-x-4">
                                                                {
                                                                    tool.image ? (
                                                                        <img src={tool.image.src} alt={tool.label} className="w-10 h-10" />
                                                                    ) : (
                                                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-meadow-50 flex items-center justify-center">
                                                                            <Icon className="h-6 w-6 text-meadow-500" />
                                                                        </div>
                                                                    )
                                                                }
                                                                <div>
                                                                    <h3 className="font-medium text-lg">{tool.label}</h3>
                                                                    <p className="text-sm text-meadow-500">{tool.category}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center space-x-4">
                                                                {credentialsTab !== "available" && getStatusBadge(tool.status)}
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="border-meadow-500 text-meadow-500"
                                                                    onClick={() => setShowPanel(!showPanel)}
                                                                >
                                                                    {getButtonText()}
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            );
                                        })
                                    ) : (
                                        <Card className="p-6 text-center border-meadow-500/20">
                                            <AlertTriangle className="h-12 w-12 text-meadow-500 mx-auto mb-4" />
                                            <h2 className="text-xl font-semibold mb-2 text-meadow-500">
                                                No integrations found
                                            </h2>
                                            <p className="">
                                                {credentialsSearch
                                                    ? "No integrations match your search. Try adjusting your search terms."
                                                    : "No integrations available in this category."}
                                            </p>
                                        </Card>
                                    )}
                                </div>
                            </ScrollArea>

                            <div className="pt-4 border-t border-meadow-500/20">
                                <Button className="w-full rounded-full">
                                    <Plus className="mr-2 h-4 w-4" /> Add New Credential
                                </Button>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>

                <Dialog
                    open={showPanel}
                    onOpenChange={setShowPanel}
                >
                    <DialogContent className="sm:max-w-[425px]   border-meadow-500">
                        <DialogHeader>
                            <DialogTitle >
                                Manage Integration
                            </DialogTitle>
                            <DialogDescription className="">
                                Manage your third-party integrations and API keys
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" >
                                    Integration Name
                                </Label>
                                <Input
                                    id="name"
                                    placeholder="Enter Integration name"
                                    className="  border-meadow-500 focus:ring-meadow-500 rounded-full"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="key" >
                                    API Key
                                </Label>
                                <Input
                                    id="key"
                                    placeholder="Enter API key"
                                    className="  border-meadow-500 focus:ring-meadow-500 rounded-full"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                className="rounded-full"
                                onClick={() => setShowPanel(false)}
                            >
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <main className="mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                            Campaigns
                        </h1>
                        <p className="mt-2 text-lg text-slate-600">
                            Manage your investor engagement campaigns
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex items-center gap-4"
                    >


                        <div className="flex space-x-2">
                            <Button
                                variant="outline"
                                className="rounded-full"
                                onClick={() => setIsCredentialsOpen(true)}
                            >
                                <KeyIcon className="mr-2 h-4 w-4" /> Credentials
                            </Button>
                            <Button
                                variant="outline"
                                className="rounded-full"
                                onClick={() => setIsAnalyticsPanelOpen(true)}
                            >
                                <BarChart2 className="mr-2 h-4 w-4" /> Analytics
                            </Button>
                            <Button
                                className="rounded-full"
                                onClick={handleCreateJourneyClick}
                            >
                                <Plus className="mr-2 h-4 w-4" /> Create Campaign
                            </Button>
                            <Dialog
                                open={isCreateDialogOpen}
                                onOpenChange={setIsCreateDialogOpen}
                            >
                                <DialogContent className="sm:max-w-[425px]   border-meadow-500">
                                    <DialogHeader>
                                        <DialogTitle >
                                            Create New Campaign
                                        </DialogTitle>
                                        <DialogDescription className="">
                                            Set up a new investor Campaign to engage your audience.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name" >
                                                Campaign Name
                                            </Label>
                                            <Input
                                                id="name"
                                                placeholder="Enter Campaign name"
                                                value={newJourneyName}
                                                onChange={(e) => setNewJourneyName(e.target.value)}
                                                className="  border-meadow-500 focus:ring-meadow-500 rounded-full"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>
                                                Campaign Repeat Option
                                            </Label>
                                            <div className="flex items-center space-x-3  p-3 rounded-md">
                                                <Switch
                                                    id="repeat-option"
                                                    checked={newJourneyRepeatOption === "multiple"}
                                                    onCheckedChange={(checked) =>
                                                        setNewJourneyRepeatOption(
                                                            checked ? "multiple" : "once"
                                                        )
                                                    }
                                                    className=""
                                                />
                                                <Label
                                                    htmlFor="repeat-option"
                                                    className=" cursor-pointer select-none flex-grow"
                                                >
                                                    {newJourneyRepeatOption === "once"
                                                        ? "Run once per record"
                                                        : "Can run multiple times per record"}
                                                </Label>
                                            </div>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            className="rounded-full"
                                            onClick={createJourney}
                                        >
                                            Create Workflow
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </motion.div>
                </div>



                {/* Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="mb-6 flex justify-between items-center">
                            <Tabs
                                value={activeTab}
                                onValueChange={setActiveTab}
                                className="w-full"
                            >
                                <TabsList className="">
                                    <TabsTrigger
                                        value="all"
                                        className="text-meadow-500 data-[state=active]:bg-meadow-500 data-[state=active]:"
                                    >
                                        All Journeys
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="active"
                                        className="text-meadow-500 data-[state=active]:bg-meadow-500 data-[state=active]:"
                                    >
                                        Active
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="paused"
                                        className="text-meadow-500 data-[state=active]:bg-meadow-500 data-[state=active]:"
                                    >
                                        Paused
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="draft"
                                        className="text-meadow-500 data-[state=active]:bg-meadow-500 data-[state=active]:"
                                    >
                                        Drafts
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                            <div className="flex space-x-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-meadow-500" />
                                    <Input
                                        type="text"
                                        placeholder="Search sampaigns..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 pr-4 py-2 w-64   border-meadow-500 focus:ring-meadow-500"
                                    />
                                </div>
                                <Select>
                                    <SelectTrigger className="w-[180px]   border-meadow-500">
                                        <SelectValue placeholder="Filter by" />
                                    </SelectTrigger>
                                    <SelectContent className="  border-meadow-500">
                                        <SelectItem value="all">All Triggers</SelectItem>
                                        <SelectItem value="event">Events</SelectItem>
                                        <SelectItem value="segment">Segments</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <JourneyList />
                        {selectedJourney && <JourneyDetails journey={selectedJourney} />}
                        <AnalyticsPanel />
                        <CredntialsPanel />

                        {/* Delete Confirmation Dialog */}
                        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                            <DialogContent className="sm:max-w-[425px]   border-meadow-500">
                                <DialogHeader>
                                    <DialogTitle >
                                        Confirm Deletion
                                    </DialogTitle>
                                    <DialogDescription className="">
                                        Are you sure you want to delete the journey "
                                        {journeyToDelete?.name}"? This action cannot be undone.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Button
                                        onClick={() => setDeleteDialogOpen(false)}
                                        className="  hover:"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleDeleteConfirm}
                                        className="bg-red-500  hover:bg-red-600"
                                    >
                                        Delete
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        {/* Status Change Confirmation Dialog */}
                        <Dialog
                            open={statusChangeDialogOpen}
                            onOpenChange={setStatusChangeDialogOpen}
                        >
                            <DialogContent className="sm:max-w-[425px]   border-meadow-500">
                                <DialogHeader>
                                    <DialogTitle >
                                        Confirm Status Change
                                    </DialogTitle>
                                    <DialogDescription className="">
                                        Are you sure you want to{" "}
                                        {journeyToChangeStatus?.status === "ACTIVE"
                                            ? "pause"
                                            : "activate"}{" "}
                                        the journey "{journeyToChangeStatus?.name}"?
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Button
                                        onClick={() => setStatusChangeDialogOpen(false)}
                                        className="  hover:"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleStatusChangeConfirm}
                                        className="bg-meadow-500  "
                                    >
                                        Confirm
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        {filteredJourneys.length === 0 && (
                            <Card className="p-6 text-center mt-6  border-meadow-500">
                                <AlertTriangle className="h-12 w-12 text-meadow-500 mx-auto mb-4" />
                                <h2 className="text-xl font-semibold mb-2 text-meadow-500">
                                    No campaigns found
                                </h2>
                                <p className="">
                                    {searchQuery
                                        ? "No campaigns match your search. Try adjusting your search terms."
                                        : "You haven't created any campaigns yet. Click 'Create Campaign' to get started."}
                                </p>
                            </Card>
                        )}
                    </main>

                </motion.div>
            </main>
        </div>
    );
}