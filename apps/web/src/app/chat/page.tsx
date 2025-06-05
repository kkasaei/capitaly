'use client';
import React, { useState, useRef } from 'react';
import { Search, Lightbulb, Image, Video, Volume2, Edit, Heart, Code, PenTool, FileText, HelpCircle, Share, RotateCcw, ChevronDown, Mic, Paperclip, Send, Wrench, Upload, X, File, Folder, Cloud, Server, Plus, Minimize } from 'lucide-react';

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

interface Model {
  name: string;
  description: string;
  isNew: boolean;
  isCurrent: boolean;
}

interface FeatureButton {
  icon: React.ElementType;
  text: string;
  color: string;
}

interface UploadSource {
  icon: React.ElementType;
  label: string;
  action: string;
}

interface MCPServer {
  name: string;
  icon: React.ElementType;
  status: 'connected' | 'available';
}

export default function HoookInterface() {
  const [message, setMessage] = useState('');
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showUploadDropdown, setShowUploadDropdown] = useState(false);
  const [selectedModel, setSelectedModel] = useState('2.1v Flash');
  const [uploadedFiles, setUploadedFiles] = useState<FileData[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [isInChat, setIsInChat] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isCanvasMode, setIsCanvasMode] = useState(false);
  const [isCanvasMinimized, setIsCanvasMinimized] = useState(false);
  const [leftPanelWidth, setLeftPanelWidth] = useState(400);
  const [isResizing, setIsResizing] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropzoneRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [chatTitle, setChatTitle] = useState('Chat');

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
    },
    {
      name: '1.9.1 Thinking Experimental with apps',
      description: 'Reasoning across YouTube, Maps & Search',
      isNew: true,
      isCurrent: false
    },
    {
      name: '1.9 Flash',
      description: 'Previous Model',
      isNew: false,
      isCurrent: false
    },
    {
      name: '1.5 Flash',
      description: 'Start Journey With AI',
      isNew: false,
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
    { icon: Cloud, label: 'Google Drive', action: 'google-drive' },
    { icon: Server, label: 'MCP Servers', action: 'mcp-servers' }
  ];

  const mcpServers = [
    { name: 'GitHub', icon: Code, status: 'connected' },
    { name: 'Notion', icon: FileText, status: 'available' },
    { name: 'Slack', icon: HelpCircle, status: 'connected' },
    { name: 'Linear', icon: Edit, status: 'available' }
  ];

  // File upload handlers
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
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  const removeFile = (fileId: number) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type?.startsWith('image/')) return Image;
    if (type?.startsWith('video/')) return Video;
    if (type?.startsWith('audio/')) return Volume2;
    return File;
  };

  const handleUploadSource = (action: string) => {
    setShowUploadDropdown(false);
    
    switch (action) {
      case 'computer':
        fileInputRef.current?.click();
        break;
      case 'google-drive':
        const driveFile: FileData = {
          id: Date.now(),
          name: 'Marketing Strategy.pdf',
          size: 2048000,
          type: 'application/pdf',
          source: 'google-drive'
        };
        setUploadedFiles(prev => [...prev, driveFile]);
        break;
      case 'mcp-servers':
        console.log('Opening MCP servers...');
        break;
    }
  };

  const handleSendMessage = () => {
    if (!message.trim() && uploadedFiles.length === 0) return;
    
    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: message,
      files: [...uploadedFiles],
      timestamp: new Date()
    };
    
    setChatHistory(prev => [...prev, userMessage]);
    setMessage('');
    setUploadedFiles([]);
    setIsInChat(true);
    
    // Auto-open canvas for certain keywords
    if (userMessage.content.toLowerCase().includes('canvas') || 
        userMessage.content.toLowerCase().includes('design') ||
        userMessage.content.toLowerCase().includes('create') ||
        userMessage.content.toLowerCase().includes('generate')) {
      setTimeout(() => setIsCanvasMode(true), 1000);
    }
    
    setIsTyping(true);
    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now() + 1,
        type: 'assistant',
        content: generateAIResponse(userMessage.content),
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const generateAIResponse = (userInput: string) => {
    if (userInput.toLowerCase().includes('marketing')) {
      return "I'd be happy to help you with marketing! Marketing hooks are all about capturing attention and creating emotional connections with your audience. What specific aspect of marketing would you like to focus on - social media campaigns, email subject lines, ad copy, or something else?";
    } else if (userInput.toLowerCase().includes('hook')) {
      return "Great question about hooks! A compelling hook should grab attention within the first few seconds. Here are some proven hook frameworks:\n\n1. **Problem/Solution**: Start with a pain point\n2. **Curiosity Gap**: Tease valuable information\n3. **Controversy**: Challenge common beliefs\n4. **Story**: Share a relatable narrative\n\nWhat type of content are you creating hooks for?";
    } else if (userInput.toLowerCase().includes('canvas') || 
               userInput.toLowerCase().includes('design') ||
               userInput.toLowerCase().includes('create') ||
               userInput.toLowerCase().includes('generate')) {
      return `I've opened the canvas for you! You can now see your content taking shape on the right side. I'm creating something amazing based on your request. The canvas is fully resizable - just drag the divider to adjust your workspace.\n\nLet me work on generating the content for you...`;
    } else {
      return `Thanks for your message! I'm Hoook, your marketing assistant specializing in creating compelling hooks and persuasive content. I can help you with:\n\n• **Headlines & Subject Lines**\n• **Social Media Hooks**\n• **Ad Copy & CTAs**\n• **Content Strategy**\n• **A/B Testing Ideas**\n\nHow can I help you capture your audience's attention today?`;
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const startNewChat = () => {
    setIsInChat(false);
    setIsCanvasMode(false);
    setIsCanvasMinimized(false);
    setChatHistory([]);
    setMessage('');
    setUploadedFiles([]);
  };

  const toggleCanvasMode = () => {
    setIsCanvasMode(!isCanvasMode);
  };

  const handleMouseDown = (e: { preventDefault: () => void; }) => {
    setIsResizing(true);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;
    
    const newWidth = e.clientX;
    if (newWidth >= 300 && newWidth <= window.innerWidth - 300) {
      setLeftPanelWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div 
          className={`bg-white border-r border-gray-200 transition-all duration-300 relative ${
            isSidebarExpanded ? 'w-64' : 'w-16'
          }`}
        >
          {/* Sidebar Toggle Button */}
          <button
            onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
            className="absolute -right-3 top-6 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors z-10"
          >
            <ChevronDown className={`w-4 h-4 text-gray-600 transform transition-transform duration-300 ${isSidebarExpanded ? 'rotate-90' : '-rotate-90'}`} />
          </button>

          <div className="p-4 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
              {isSidebarExpanded && (
                <span className="font-medium text-gray-700">Hoook</span>
              )}
            </div>
            
            <nav className="space-y-1">
              <button 
                onClick={startNewChat}
                className={`w-full group relative rounded-lg hover:bg-gray-100 transition-colors ${
                  !isSidebarExpanded ? 'flex justify-center items-center w-16 h-10' : 'flex items-center space-x-3 p-2'
                } ${isInChat ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
              >
                <svg className={`w-5 h-5 ${!isSidebarExpanded ? 'w-5 h-5 text-gray-600' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {isSidebarExpanded && <span>New Chat</span>}
                {!isSidebarExpanded && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    New Chat
                  </div>
                )}
              </button>
              
              <button className={`w-full group relative rounded-lg hover:bg-gray-100 transition-colors text-gray-600 ${
                !isSidebarExpanded ? 'flex justify-center items-center w-16 h-10' : 'flex items-center space-x-3 p-2'
              }`}>
                <svg className={`w-5 h-5 ${!isSidebarExpanded ? 'w-5 h-5 text-gray-600' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {isSidebarExpanded && <span>Saved</span>}
                {!isSidebarExpanded && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    Saved
                  </div>
                )}
              </button>
              
              <button className={`w-full group relative rounded-lg hover:bg-gray-100 transition-colors text-gray-600 ${
                !isSidebarExpanded ? 'flex justify-center items-center w-16 h-10' : 'flex items-center space-x-3 p-2'
              }`}>
                <svg className={`w-5 h-5 ${!isSidebarExpanded ? 'w-5 h-5 text-gray-600' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {isSidebarExpanded && <span>Settings</span>}
                {!isSidebarExpanded && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    Settings
                  </div>
                )}
              </button>
            </nav>
            
            {isSidebarExpanded && (
              <div className="pt-4 border-t border-gray-200">
                <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Recent Chats</h3>
                <div className="mt-2 space-y-1">
                  <button className={`w-full flex items-center space-x-3 ${!isSidebarExpanded ? '' : 'p-2'} rounded-lg hover:bg-gray-100 transition-colors text-gray-600 group relative`}>
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm truncate">Marketing Strategy</span>
                    {!isSidebarExpanded && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                        Marketing Strategy
                      </div>
                    )}
                  </button>
                  <button className={`w-full flex items-center space-x-3 ${!isSidebarExpanded ? '' : 'p-2'} rounded-lg hover:bg-gray-100 transition-colors text-gray-600 group relative`}>
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-sm truncate">Content Calendar</span>
                    {!isSidebarExpanded && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                        Content Calendar
                      </div>
                    )}
                  </button>
                  <button className={`w-full flex items-center space-x-3 ${!isSidebarExpanded ? '' : 'p-2'} rounded-lg hover:bg-gray-100 transition-colors text-gray-600 group relative`}>
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-sm truncate">Social Media Plan</span>
                    {!isSidebarExpanded && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                        Social Media Plan
                      </div>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {!isInChat ? (
          // Landing Page View
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
            <div className="max-w-4xl w-full">
              {/* AI Avatar and Greeting */}
              <div className="text-center mb-12">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                  </div>
                </div>
                <h1 className="text-4xl font-bold text-gray-800 mb-4">Hello, I'm Hoook</h1>
                <p className="text-xl text-gray-600">How can I make things easier for you?</p>
              </div>

              {/* Message Input */}
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                {isDragOver && (
                  <div className="absolute inset-0 bg-blue-50 border-2 border-dashed border-blue-300 rounded-2xl flex items-center justify-center z-10">
                    <div className="text-center">
                      <Upload className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                      <p className="text-blue-600 font-medium">Drop files here to upload</p>
                    </div>
                  </div>
                )}
                
                <div 
                  ref={dropzoneRef}
                  className="relative"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Message Hoook..."
                    className="w-full p-4 pr-20 border-0 resize-none focus:outline-none text-gray-700 placeholder-gray-400"
                    rows={3}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  
                  {/* Input Controls */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-2">
                      <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
                        <Search className="w-4 h-4" />
                        <span>Search</span>
                      </button>
                      <button className="flex items-center space-x-2 px-4 py-2 bg-orange-100 text-orange-600 rounded-full hover:bg-orange-200 transition-colors">
                        <Lightbulb className="w-4 h-4" />
                        <span>Brainstorm</span>
                      </button>
                      <div className="relative">
                        <button 
                          onClick={() => setShowToolsDropdown(!showToolsDropdown)}
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                        >
                          <Wrench className="w-4 h-4" />
                          <span>Tools</span>
                          <ChevronDown className="w-3 h-3" />
                        </button>
                        
                        {showToolsDropdown && (
                          <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-10 p-2">
                            <div className="grid grid-cols-2 gap-2">
                              {featureButtons.map((feature, index) => (
                                <button
                                  key={index}
                                  className={`flex items-center space-x-2 p-3 rounded-lg border transition-all hover:scale-105 text-left ${feature.color}`}
                                  onClick={() => setShowToolsDropdown(false)}
                                >
                                  <feature.icon className="w-4 h-4" />
                                  <span className="text-xs font-medium">{feature.text}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="relative">
                        <button 
                          onClick={() => setShowModelDropdown(!showModelDropdown)}
                          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                        >
                          <span className="text-sm">{selectedModel}</span>
                          <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${showModelDropdown ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {showModelDropdown && (
                          <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 z-20 p-4">
                            <div className="space-y-3">
                              {models.map((model, index) => (
                                <button
                                  key={index}
                                  onClick={() => {
                                    setSelectedModel(model.name);
                                    setShowModelDropdown(false);
                                  }}
                                  className={`w-full text-left p-3 rounded-xl transition-all hover:bg-gray-50 ${
                                    model.isCurrent ? 'bg-blue-50 border border-blue-200' : 'border border-transparent'
                                  }`}
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-2">
                                        <h3 className="font-semibold text-gray-800 text-sm">{model.name}</h3>
                                        {model.isNew && (
                                          <span className="px-2 py-1 bg-purple-100 text-purple-600 text-xs font-medium rounded-full">
                                            New
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-gray-600 text-sm mt-1">{model.description}</p>
                                    </div>
                                  </div>
                                </button>
                              ))}
                              
                              <div className="pt-3 border-t border-gray-200">
                                <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-700 transition-colors">
                                  Advanced Hoook
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Mic className="w-5 h-5 text-gray-600" />
                      </button>
                      
                      <div className="relative">
                        <button 
                          onClick={() => setShowUploadDropdown(!showUploadDropdown)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Paperclip className="w-5 h-5 text-gray-600" />
                        </button>
                        
                        {showUploadDropdown && (
                          <div className="absolute bottom-full right-0 mb-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-20 p-2">
                            <div className="space-y-1">
                              {uploadSources.map((source, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleUploadSource(source.action)}
                                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                                >
                                  <source.icon className="w-5 h-5 text-gray-600" />
                                  <span className="text-sm font-medium text-gray-700">{source.label}</span>
                                </button>
                              ))}
                              
                              <div className="border-t border-gray-200 pt-2 mt-2">
                                <div className="px-3 py-2">
                                  <p className="text-xs font-medium text-gray-500 mb-2">MCP Servers</p>
                                  <div className="space-y-1">
                                    {mcpServers.map((server, index) => (
                                      <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                          <server.icon className="w-4 h-4 text-gray-500" />
                                          <span className="text-xs text-gray-700">{server.name}</span>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-full ${
                                          server.status === 'connected' 
                                            ? 'bg-green-100 text-green-600' 
                                            : 'bg-gray-100 text-gray-500'
                                        }`}>
                                          {server.status}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <button 
                        onClick={handleSendMessage}
                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Uploaded Files List */}
                  {uploadedFiles.length > 0 && (
                    <div className="pt-4">
                      <div className="flex flex-wrap gap-2">
                        {uploadedFiles.map((file) => {
                          const FileIcon = getFileIcon(file.type);
                          return (
                            <div
                              key={file.id}
                              className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2 group hover:bg-gray-100 transition-colors"
                            >
                              <FileIcon className="w-4 h-4 text-gray-500" />
                              <div className="text-sm">
                                <div className="font-medium text-gray-700 truncate max-w-40">
                                  {file.name}
                                </div>
                                <div className="text-gray-500 text-xs">
                                  {file.size ? formatFileSize(file.size) : 'Unknown size'} • {file.source}
                                </div>
                              </div>
                              <button
                                onClick={() => removeFile(file.id)}
                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-all"
                              >
                                <X className="w-3 h-3 text-gray-500" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files)}
                />
              </div>
            </div>
          </div>
        ) : isCanvasMode ? (
          // Canvas Mode - Split View
          <div className="flex-1 flex h-screen">
            {/* Left Panel - Chat */}
            <div 
              className="flex flex-col bg-white border-r border-gray-200 transition-all duration-300"
              style={{ width: `${leftPanelWidth}px`, minWidth: '300px' }}
            >
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={chatTitle}
                    onChange={(e) => setChatTitle(e.target.value)}
                    className="text-lg font-semibold text-gray-800 bg-transparent border-none focus:outline-none focus:ring-0 p-0 w-auto min-w-[100px]"
                  />
                </div>
                <div className="flex items-center space-x-2">
                <button 
                  onClick={startNewChat}
                  className="p-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => {
                    setIsCanvasMinimized(!isCanvasMinimized);
                    setIsCanvasMode(false);
                  }}
                  className="p-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  <Minimize className="w-4 h-4" />
                </button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatHistory.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs ${msg.type === 'user' ? 'order-2' : 'order-1'}`}>
                      <div className={`flex items-start space-x-2 ${msg.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                          msg.type === 'user' ? 'bg-gray-600' : 'bg-blue-600'
                        }`}>
                          {msg.type === 'user' ? (
                            <span className="text-white text-xs font-medium">U</span>
                          ) : (
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                          )}
                        </div>
                        
                        <div className={`rounded-xl px-3 py-2 text-sm ${
                          msg.type === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'
                        }`}>
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                          
                          {msg.files && msg.files.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {msg.files.map((file: { type: any; id: React.Key | null | undefined; name: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }) => {
                                const FileIcon = getFileIcon(file.type);
                                return (
                                  <div key={file.id} className={`flex items-center space-x-1 p-1 rounded text-xs ${
                                    msg.type === 'user' ? 'bg-blue-500' : 'bg-gray-200'
                                  }`}>
                                    <FileIcon className="w-3 h-3" />
                                    <span className="truncate">{file.name}</span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className={`text-xs text-gray-500 mt-1 ${msg.type === 'user' ? 'text-right pr-8' : 'text-left pl-8'}`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-2">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                      <div className="bg-gray-100 rounded-xl px-3 py-2">
                        <div className="flex space-x-1">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Compact Chat Input */}
              <div className="p-3 border-t border-gray-200">
                <div className="bg-gray-50 rounded-xl p-3">
                  {isDragOver && (
                    <div className="absolute inset-0 bg-blue-50 border-2 border-dashed border-blue-300 rounded-xl flex items-center justify-center z-10">
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-blue-500 mx-auto mb-1" />
                        <p className="text-blue-600 text-sm font-medium">Drop files here</p>
                      </div>
                    </div>
                  )}
                  
                  <div 
                    className="relative"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="w-full p-2 border-0 resize-none focus:outline-none text-gray-700 placeholder-gray-400 bg-transparent text-sm"
                      rows={1}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />

                    {/* Compact Controls */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-1">
                        <button className="flex items-center space-x-1 px-2 py-1 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 transition-colors text-xs">
                          <Search className="w-3 h-3" />
                          <span>Search</span>
                        </button>
                        <button className="flex items-center space-x-1 px-2 py-1 bg-orange-200 text-orange-600 rounded-full hover:bg-orange-300 transition-colors text-xs">
                          <Lightbulb className="w-3 h-3" />
                          <span>Ideas</span>
                        </button>
                        <div className="relative">
                          <button 
                            onClick={() => setShowToolsDropdown(!showToolsDropdown)}
                            className="flex items-center space-x-1 px-2 py-1 bg-blue-200 text-blue-600 rounded-full hover:bg-blue-300 transition-colors text-xs"
                          >
                            <Wrench className="w-3 h-3" />
                            <span>Tools</span>
                          </button>
                          
                          {showToolsDropdown && (
                            <div className="absolute bottom-full left-0 mb-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-10 p-2">
                              <div className="grid grid-cols-2 gap-1">
                                {featureButtons.map((feature, index) => (
                                  <button
                                    key={index}
                                    className={`flex items-center space-x-1 p-2 rounded-lg border transition-all hover:scale-105 text-left text-xs ${feature.color}`}
                                    onClick={() => setShowToolsDropdown(false)}
                                  >
                                    <feature.icon className="w-3 h-3" />
                                    <span className="text-xs">{feature.text}</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <button className="p-1.5 hover:bg-gray-200 rounded">
                          <Mic className="w-3.5 h-3.5 text-gray-600" />
                        </button>
                        
                        <div className="relative">
                          <button 
                            onClick={() => setShowUploadDropdown(!showUploadDropdown)}
                            className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                          >
                            <Paperclip className="w-3.5 h-3.5 text-gray-600" />
                          </button>
                          
                          {showUploadDropdown && (
                            <div className="absolute bottom-full right-0 mb-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20 p-2">
                              <div className="space-y-1">
                                {uploadSources.map((source, index) => (
                                  <button
                                    key={index}
                                    onClick={() => handleUploadSource(source.action)}
                                    className="w-full flex items-center space-x-2 p-2 rounded hover:bg-gray-50 transition-colors text-left text-sm"
                                  >
                                    <source.icon className="w-4 h-4 text-gray-600" />
                                    <span className="text-sm font-medium text-gray-700">{source.label}</span>
                                  </button>
                                ))}
                                
                                <div className="border-t border-gray-200 pt-2 mt-2">
                                  <div className="px-2 py-1">
                                    <p className="text-xs font-medium text-gray-500 mb-1">MCP Servers</p>
                                    <div className="space-y-1">
                                      {mcpServers.map((server, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                          <div className="flex items-center space-x-1">
                                            <server.icon className="w-3 h-3 text-gray-500" />
                                            <span className="text-xs text-gray-700">{server.name}</span>
                                          </div>
                                          <span className={`text-xs px-1 py-0.5 rounded-full ${
                                            server.status === 'connected' 
                                              ? 'bg-green-100 text-green-600' 
                                              : 'bg-gray-100 text-gray-500'
                                          }`}>
                                            {server.status}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <button 
                          onClick={handleSendMessage}
                          className="p-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Uploaded Files List - Compact */}
                    {uploadedFiles.length > 0 && (
                      <div className="pt-2">
                        <div className="flex flex-wrap gap-1">
                          {uploadedFiles.map((file) => {
                            const FileIcon = getFileIcon(file.type);
                            return (
                              <div
                                key={file.id}
                                className="flex items-center space-x-1 bg-gray-200 rounded px-2 py-1 group hover:bg-gray-300 transition-colors"
                              >
                                <FileIcon className="w-3 h-3 text-gray-500" />
                                <span className="text-xs font-medium text-gray-700 truncate max-w-20">
                                  {file.name}
                                </span>
                                <button
                                  onClick={() => removeFile(file.id)}
                                  className="opacity-0 group-hover:opacity-100 hover:bg-gray-400 rounded transition-all"
                                >
                                  <X className="w-2.5 h-2.5 text-gray-500" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFileUpload(e.target.files)}
                  />
                </div>
              </div>
            </div>

            {/* Resizer */}
            <div
              className="w-1 bg-gray-300 hover:bg-gray-400 cursor-col-resize transition-colors"
              onMouseDown={handleMouseDown}
            />

            {/* Right Panel - Canvas */}
            <div className={`flex-1 bg-gray-100 flex items-center justify-center animate-in slide-in-from-right duration-500 relative ${isCanvasMinimized ? 'w-16' : ''}`}>
              {isCanvasMinimized ? (
                <button
                  onClick={() => setIsCanvasMinimized(false)}
                  className="absolute top-4 right-4 p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                >
                  <ChevronDown className="w-4 h-4 text-gray-600 transform rotate-90" />
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setIsCanvasMinimized(true)}
                    className="absolute top-4 right-4 p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                  >
                    <ChevronDown className="w-4 h-4 text-gray-600 transform -rotate-90" />
                  </button>
                  <div className="text-center p-8">
                    <div className="w-24 h-24 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Edit className="w-12 h-12 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Canvas Mode</h2>
                    <p className="text-gray-600 max-w-md">
                      Your creative workspace is ready! Content will appear here as I generate it based on your requests. 
                      You can resize this canvas by dragging the divider.
                    </p>
                    <div className="mt-8 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      </div>
                      <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                      </div>
                      <p className="text-sm text-gray-500 mt-4">Generating your content...</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          // Regular Chat View
          <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-6 py-4">
            {/* Chat Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={chatTitle}
                  onChange={(e) => setChatTitle(e.target.value)}
                  className="text-lg font-semibold text-gray-800 bg-transparent border-none focus:outline-none focus:ring-0 p-0 w-auto min-w-[100px]"
                />
              </div>
              <button 
                onClick={startNewChat}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              >
                New Chat
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto space-y-6 mb-6">
              {chatHistory.map((msg) => (
                <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-3xl ${msg.type === 'user' ? 'order-2' : 'order-1'}`}>
                    <div className={`flex items-start space-x-3 ${msg.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        msg.type === 'user' ? 'bg-gray-600' : 'bg-blue-600'
                      }`}>
                        {msg.type === 'user' ? (
                          <span className="text-white text-sm font-medium">U</span>
                        ) : (
                          <div className="w-4 h-4 bg-white rounded-full"></div>
                        )}
                      </div>
                      
                      <div className={`rounded-2xl px-4 py-3 ${
                        msg.type === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'
                      }`}>
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                        
                        {msg.files && msg.files.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {msg.files.map((file: { type: any; id: React.Key | null | undefined; name: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }) => {
                              const FileIcon = getFileIcon(file.type);
                              return (
                                <div key={file.id} className={`flex items-center space-x-2 p-2 rounded-lg ${
                                  msg.type === 'user' ? 'bg-blue-500' : 'bg-gray-200'
                                }`}>
                                  <FileIcon className="w-4 h-4" />
                                  <span className="text-sm">{file.name}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className={`text-xs text-gray-500 mt-1 ${msg.type === 'user' ? 'text-right pr-11' : 'text-left pl-11'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                    <div className="bg-gray-100 rounded-2xl px-4 py-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Full Chat Input */}
            <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-200">
              {isDragOver && (
                <div className="absolute inset-0 bg-blue-50 border-2 border-dashed border-blue-300 rounded-2xl flex items-center justify-center z-10">
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                    <p className="text-blue-600 font-medium">Drop files here to upload</p>
                  </div>
                </div>
              )}
              
              <div 
                className="relative"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="flex items-end space-x-3">
                  <div className="flex-1">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="w-full p-3 border-0 resize-none focus:outline-none text-gray-700 placeholder-gray-400 max-h-32"
                      rows={1}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Full Chat Input Controls */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center space-x-2">
                    <button className="flex items-center space-x-2 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors text-sm">
                      <Search className="w-3.5 h-3.5" />
                      <span>Search</span>
                    </button>
                    <button className="flex items-center space-x-2 px-3 py-1.5 bg-orange-100 text-orange-600 rounded-full hover:bg-orange-200 transition-colors text-sm">
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>Brainstorm</span>
                    </button>
                    <div className="relative">
                      <button 
                        onClick={() => setShowToolsDropdown(!showToolsDropdown)}
                        className="flex items-center space-x-2 px-3 py-1.5 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors text-sm"
                      >
                        <Wrench className="w-3.5 h-3.5" />
                        <span>Tools</span>
                        <ChevronDown className="w-2.5 h-2.5" />
                      </button>
                      
                      {showToolsDropdown && (
                        <div className="absolute bottom-full left-0 mb-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-10 p-2">
                          <div className="grid grid-cols-2 gap-2">
                            {featureButtons.map((feature, index) => (
                              <button
                                key={index}
                                className={`flex items-center space-x-2 p-3 rounded-lg border transition-all hover:scale-105 text-left ${feature.color}`}
                                onClick={() => setShowToolsDropdown(false)}
                              >
                                <feature.icon className="w-4 h-4" />
                                <span className="text-xs font-medium">{feature.text}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Mic className="w-4 h-4 text-gray-600" />
                    </button>
                    
                    <div className="relative">
                      <button 
                        onClick={() => setShowUploadDropdown(!showUploadDropdown)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Paperclip className="w-4 h-4 text-gray-600" />
                      </button>
                      
                      {showUploadDropdown && (
                        <div className="absolute bottom-full right-0 mb-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-20 p-2">
                          <div className="space-y-1">
                            {uploadSources.map((source, index) => (
                              <button
                                key={index}
                                onClick={() => handleUploadSource(source.action)}
                                className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                              >
                                <source.icon className="w-5 h-5 text-gray-600" />
                                <span className="text-sm font-medium text-gray-700">{source.label}</span>
                              </button>
                            ))}
                            
                            <div className="border-t border-gray-200 pt-2 mt-2">
                              <div className="px-3 py-2">
                                <p className="text-xs font-medium text-gray-500 mb-2">MCP Servers</p>
                                <div className="space-y-1">
                                  {mcpServers.map((server, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                      <div className="flex items-center space-x-1">
                                        <server.icon className="w-4 h-4 text-gray-500" />
                                        <span className="text-xs text-gray-700">{server.name}</span>
                                      </div>
                                      <span className={`text-xs px-2 py-1 rounded-full ${
                                        server.status === 'connected' 
                                          ? 'bg-green-100 text-green-600' 
                                          : 'bg-gray-100 text-gray-500'
                                      }`}>
                                        {server.status}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <button 
                      onClick={handleSendMessage}
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Uploaded Files List in Regular Chat */}
                {uploadedFiles.length > 0 && (
                  <div className="pt-3">
                    <div className="flex flex-wrap gap-2">
                      {uploadedFiles.map((file) => {
                        const FileIcon = getFileIcon(file.type);
                        return (
                          <div
                            key={file.id}
                            className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2 group hover:bg-gray-100 transition-colors"
                          >
                            <FileIcon className="w-3.5 h-3.5 text-gray-500" />
                            <div className="text-sm">
                              <div className="font-medium text-gray-700 truncate max-w-32">
                                {file.name}
                              </div>
                              <div className="text-gray-500 text-xs">
                                {file.size ? formatFileSize(file.size) : 'Unknown size'} • {file.source}
                              </div>
                            </div>
                            <button
                              onClick={() => removeFile(file.id)}
                              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-all"
                            >
                              <X className="w-3 h-3 text-gray-500" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files)}
              />
            </div>
          </div>
        )}
      </main>

      {/* Click outside to close dropdowns */}
      {showToolsDropdown && (
        <div 
          className="fixed inset-0 z-5"
          onClick={() => setShowToolsDropdown(false)}
        />
      )}
      
      {showUploadDropdown && (
        <div 
          className="fixed inset-0 z-15"
          onClick={() => setShowUploadDropdown(false)}
        />
      )}
      
      {showModelDropdown && (
        <div 
          className="fixed inset-0 z-10"
          onClick={() => setShowModelDropdown(false)}
        />
      )}
    </div>
  );
}