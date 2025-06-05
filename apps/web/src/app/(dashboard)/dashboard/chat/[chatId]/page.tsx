'use client';
import React from 'react';
import { ArrowLeft, MoreVertical, Share2, Trash2, Edit2, Clock, User, Upload, Cloud, Code, FileText, PenTool, Minimize, Image, Video, Volume2, Edit, Heart, HelpCircle, Maximize } from 'lucide-react';
import { PromptBox } from '@/app/chat/PromptBox';

interface FileData {
  id: number;
  name: string;
  size: number;
  type: string;
  source: string;
  file?: File;
}

interface Message {
  id: number;
  type: 'user' | 'assistant';
  content: string;
  files?: FileData[];
  timestamp: Date;
}

interface PageProps {
  params: Promise<{
    chatId: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function ChatDetails({ params, searchParams }: PageProps) {
  const [chatId, setChatId] = React.useState<string>('');
  const [message, setMessage] = React.useState('');
  const [showToolsDropdown, setShowToolsDropdown] = React.useState(false);
  const [showModelDropdown, setShowModelDropdown] = React.useState(false);
  const [showUploadDropdown, setShowUploadDropdown] = React.useState(false);
  const [selectedModel, setSelectedModel] = React.useState('2.1v Flash');
  const [uploadedFiles, setUploadedFiles] = React.useState<FileData[]>([]);
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [isCanvasMode, setIsCanvasMode] = React.useState(false);
  const [isCanvasMinimized, setIsCanvasMinimized] = React.useState(false);
  const [leftPanelWidth, setLeftPanelWidth] = React.useState(400);
  const [isResizing, setIsResizing] = React.useState(false);
  const [isTyping, setIsTyping] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null) as React.RefObject<HTMLInputElement>;
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    params.then((resolvedParams) => {
      setChatId(resolvedParams.chatId);
    });
  }, [params]);

  // You can also use searchParams if needed
  React.useEffect(() => {
    searchParams.then((resolvedSearchParams) => {
      // Handle search params here if needed
      console.log('Search params:', resolvedSearchParams);
    });
  }, [searchParams]);

  // Dummy chat data
  const chatTitle = "New Chat";
  
  const messages: Message[] = [
    {
      id: 1,
      type: 'user',
      content: "I'd like to set up some integrations for my website.",
      timestamp: new Date('2024-03-15T10:00:00')
    },
    {
      id: 2,
      type: 'assistant',
      content: "I'll help you set up your integrations. Let's start with Webflow. Would you like to connect your Webflow account first?",
      timestamp: new Date('2024-03-15T10:01:00')
    },
    {
      id: 3,
      type: 'user',
      content: "Yes, let's set up Webflow first.",
      timestamp: new Date('2024-03-15T10:02:00')
    },
    {
      id: 4,
      type: 'assistant',
      content: "Great! After we set up Webflow, we should also configure Google Search Console to help with your site's visibility and performance. Would you like to proceed with both integrations?",
      timestamp: new Date('2024-03-15T10:03:00')
    }
  ];

  const models = [
    {
      name: '2.1v Flash',
      description: 'Get everyday help',
      isNew: true,
      isCurrent: true
    },
    {
      name: '2.0v Flash Thinking Experimental',
      description: 'Best for multi-step reasoning',
      isNew: true,
      isCurrent: false
    }
  ];

  const featureButtons = [
    { icon: Image, text: 'Image Generator', color: 'bg-blue-50 text-blue-600 border-blue-200' },
    { icon: Video, text: 'Video Generator', color: 'bg-purple-50 text-purple-600 border-purple-200' },
    { icon: Volume2, text: 'Audio Generator', color: 'bg-orange-50 text-orange-600 border-orange-200' },
    { icon: Edit, text: 'Photo Editor', color: 'bg-yellow-50 text-yellow-600 border-yellow-200' },
    { icon: Heart, text: 'Education Feedback', color: 'bg-green-50 text-green-600 border-green-200' },
    { icon: FileText, text: 'Get Advice', color: 'bg-red-50 text-red-600 border-red-200' },
    { icon: Code, text: 'Code Generator', color: 'bg-teal-50 text-teal-600 border-teal-200' },
    { icon: PenTool, text: 'Help me write', color: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
    { icon: FileText, text: 'Summarize text', color: 'bg-pink-50 text-pink-600 border-pink-200' },
    { icon: HelpCircle, text: 'Problem solving', color: 'bg-violet-50 text-violet-600 border-violet-200' }
  ];

  const uploadSources = [
    { icon: Upload, label: 'Upload from Computer', action: 'computer' },
    { icon: Cloud, label: 'Google Drive', action: 'google-drive' }
  ];

  const mcpServers = [
    { name: 'GitHub', icon: Code, status: 'connected' as const },
    { name: 'Notion', icon: FileText, status: 'available' as const }
  ];

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    const newFiles: FileData[] = Array.from(files).map(file => ({
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
    if (action === 'computer') {
      fileInputRef.current?.click();
    }
  };

  const removeFile = (fileId: number) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const handleSend = () => {
    if (message.trim()) {
      // Handle sending message
      setMessage('');
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
      }, 2000);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const toggleCanvasMode = () => {
    setIsCanvasMode(!isCanvasMode);
    if (isCanvasMode) {
      setIsCanvasMinimized(false);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isResizing) {
      const newWidth = e.clientX;
      if (newWidth > 300 && newWidth < window.innerWidth - 300) {
        setLeftPanelWidth(newWidth);
      }
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  React.useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Panel */}
      <div 
        className="flex flex-col h-full bg-white border-r border-gray-200"
        style={{ width: isCanvasMode ? `${leftPanelWidth}px` : '100%' }}
      >
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">{chatTitle}</h1>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={toggleCanvasMode}
                className={`p-2 rounded-full ${isCanvasMode ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100 text-gray-600'}`}
              >
                <Maximize className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-2xl p-4 ${
                  msg.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-900 shadow-sm'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <span className="text-xs mt-2 block opacity-70">
                  {msg.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-900 shadow-sm rounded-2xl p-4">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Prompt Box */}
        <div className="p-4 bg-white">
          <PromptBox
            value={message}
            onChange={setMessage}
            onSend={handleSend}
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
            isCanvasMode={isCanvasMode}
          />
        </div>
      </div>

      {/* Canvas Panel */}
      {isCanvasMode && (
        <>
          {/* Resizer */}
          <div
            className="w-1 bg-gray-200 cursor-col-resize hover:bg-blue-500"
            onMouseDown={handleMouseDown}
          />
          <div className="flex-1 flex flex-col bg-white">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Canvas</h2>
              <button
                onClick={() => setIsCanvasMinimized(!isCanvasMinimized)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <Minimize className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className={`flex-1 ${isCanvasMinimized ? 'hidden' : 'block'}`}>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Webflow Integration Box */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Webflow Integration</h3>
                        <p className="text-sm text-gray-500">Connect your Webflow site</p>
                      </div>
                    </div>
                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                      Connect Webflow
                    </button>
                  </div>

                  {/* Google Analytics Integration Box */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="bg-green-50 p-3 rounded-lg">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Google Analytics</h3>
                        <p className="text-sm text-gray-500">Track your site performance</p>
                      </div>
                    </div>
                    <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                      Connect Analytics
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}