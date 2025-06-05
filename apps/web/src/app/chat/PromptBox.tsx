import React from "react";
import { Search, Lightbulb, Wrench, ChevronDown, Send, Mic, Paperclip, X, Upload, Cloud, Server, FileText, Code, HelpCircle, Edit, Heart, PenTool } from "lucide-react";

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

interface Model {
  name: string;
  description: string;
  isNew: boolean;
  isCurrent: boolean;
}

interface PromptBoxProps {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  featureButtons: FeatureButton[];
  models: Model[];
  selectedModel: string;
  setSelectedModel: (m: string) => void;
  showToolsDropdown: boolean;
  setShowToolsDropdown: (b: boolean) => void;
  showModelDropdown: boolean;
  setShowModelDropdown: (b: boolean) => void;
  showUploadDropdown: boolean;
  setShowUploadDropdown: (b: boolean) => void;
  uploadSources: UploadSource[];
  mcpServers: MCPServer[];
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileUpload: (files: FileList | null) => void;
  handleUploadSource: (action: string) => void;
  uploadedFiles: any[];
  removeFile: (id: number) => void;
  isDragOver: boolean;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  isCanvasMode?: boolean;
  openInNewPage?: boolean;
}

export function PromptBox({
  value,
  onChange,
  onSend,
  featureButtons,
  models,
  selectedModel,
  setSelectedModel,
  showToolsDropdown,
  setShowToolsDropdown,
  showModelDropdown,
  setShowModelDropdown,
  showUploadDropdown,
  setShowUploadDropdown,
  uploadSources,
  mcpServers,
  fileInputRef,
  handleFileUpload,
  handleUploadSource,
  uploadedFiles,
  removeFile,
  isDragOver,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  isCanvasMode = false,
  openInNewPage = false,
}: PromptBoxProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 relative max-w-5xl mx-auto">
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
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Message Hoook..."
          className="w-full p-4 pr-20 border-0 resize-none focus:outline-none text-gray-700 placeholder-gray-400"
          rows={3}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
        />
        {/* Input Controls */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            {!isCanvasMode && (
              <>
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
              </>
            )}
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
              onClick={onSend}
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
                const FileIcon = file.icon || FileText;
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
                        {file.size ? `${file.size} bytes` : 'Unknown size'} • {file.source}
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
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={e => handleFileUpload(e.target.files)}
        />
      </div>
    </div>
  );
} 