"use client";
import { useRouter } from "next/navigation";
import { FileText, PenTool, HelpCircle, Upload, Cloud, Server, Code, ChevronRight, MoveRight } from "lucide-react";
import { useState, useRef } from "react";
import { PromptBox } from "@/components/PromptBox";
import TemplateCards from "@/components/template-cards";
import { v4 } from "uuid";


export default function DashboardChatStarter() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showUploadDropdown, setShowUploadDropdown] = useState(false);
  const [selectedModel, setSelectedModel] = useState("2.1v Flash");
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null) as React.RefObject<HTMLInputElement>;

  // Example data (can be customized)
  const featureButtons = [
    { icon: PenTool, text: 'Help me write', color: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
    { icon: FileText, text: 'Summarize text', color: 'bg-pink-50 text-pink-600 border-pink-200' },
    { icon: HelpCircle, text: 'Problem solving', color: 'bg-violet-50 text-violet-600 border-violet-200' }
  ];
  const models = [
    { name: '2.1v Flash', description: 'Get everyday help', isNew: true, isCurrent: true },
    { name: '2.0v Flash Thinking Experimental', description: 'Best for multi-step reasoning', isNew: true, isCurrent: false }
  ];
  const uploadSources = [
    { icon: Upload, label: 'Upload from Computer', action: 'computer' },
    { icon: Cloud, label: 'Google Drive', action: 'google-drive' },
    { icon: Server, label: 'MCP Servers', action: 'mcp-servers' }
  ];
  const mcpServers = [
    { name: 'GitHub', icon: Code, status: 'connected' as const },
    { name: 'Notion', icon: FileText, status: 'available' as const }
  ];

  // Handlers
  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files).map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      source: 'computer',
      file: file
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };
  const handleUploadSource = (action: string) => {
    setShowUploadDropdown(false);
    if (action === 'computer') fileInputRef.current?.click();
    // Add other upload logic as needed
  };
  const removeFile = (fileId: number) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragOver(false); };
  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); setIsDragOver(false); handleFileUpload(e.dataTransfer.files); };

  const handlePromptSend = () => {
    if (!prompt.trim()) return;
    router.push(`/dashboard/chat/${v4()}`);
  };

  const handleStart = (query: string) => {
    router.push(`/dashboard/chat?template=${query}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12">

      <div className="main-area h-screen flex flex-col justify-center w-full max-w-5xl">
        <div className="max-w-2xl w-full mx-auto text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">What impact will you create today?</h1>
            <p className="text-lg text-gray-600">Kickstart your marketing workflow with an agent, a project, or a ready-made template.</p>
        </div>

         {/* Prompt Box */}
         <div className="w-full px-4 pb-8">
            <PromptBox
            value={prompt}
            onChange={setPrompt}
            onSend={handlePromptSend}
            featureButtons={featureButtons}
            models={models}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            showToolsDropdown={showToolsDropdown}
            setShowToolsDropdown={setShowToolsDropdown}
            showModelDropdown={showModelDropdown}
            setShowModelDropdown={setShowModelDropdown}
            showUploadDropdown={showUploadDropdown}
            setShowUploadDropdown={setShowUploadDropdown}
            uploadSources={uploadSources}
            mcpServers={mcpServers}
            fileInputRef={fileInputRef}
            handleFileUpload={handleFileUpload}
            handleUploadSource={handleUploadSource}
            uploadedFiles={uploadedFiles}
            removeFile={removeFile}
            isDragOver={isDragOver}
            handleDragOver={handleDragOver}
            handleDragLeave={handleDragLeave}
            handleDrop={handleDrop}
            isCanvasMode={false}
            />
        </div>
        
      </div>

      {/* Marketing Templates */}
      <div className="w-full max-w-5xl mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-700">Marketing Templates</h2>
          <button
            onClick={() => router.push('/dashboard/templates')}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
          >
            View More Templates
            <MoveRight className="h-5 w-5" />
          </button>
        </div>
        <TemplateCards handleStart={handleStart} />
      </div>

   
    </div>
  );
}
