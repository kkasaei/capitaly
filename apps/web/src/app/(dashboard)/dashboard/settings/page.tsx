"use client";

import { useState } from "react";
import { FaKey, FaBell, FaUser, FaLock, FaPlug, FaSync, FaSave } from "react-icons/fa";
import Image from "next/image";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 md:px-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Settings Navigation */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <nav className="p-4 space-y-1">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeTab === "profile"
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <FaUser className="mr-3 h-4 w-4" />
                Profile Settings
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeTab === "security"
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <FaLock className="mr-3 h-4 w-4" />
                Security
              </button>
              <button
                onClick={() => setActiveTab("api")}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeTab === "api"
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <FaKey className="mr-3 h-4 w-4" />
                API Keys
              </button>
              <button
                onClick={() => setActiveTab("integrations")}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeTab === "integrations"
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <FaPlug className="mr-3 h-4 w-4" />
                Integrations
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeTab === "notifications"
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <FaBell className="mr-3 h-4 w-4" />
                Notifications
              </button>
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          <div className="bg-white shadow rounded-lg">
            {activeTab === "profile" && <ProfileSettings />}
            {activeTab === "security" && <SecuritySettings />}
            {activeTab === "api" && <ApiKeySettings />}
            {activeTab === "integrations" && <IntegrationSettings />}
            {activeTab === "notifications" && <NotificationSettings />}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileSettings() {
  return (
    <div className="p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Profile Settings</h2>
      <form className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            defaultValue="John Doe"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            id="email"
            defaultValue="john@example.com"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700">
            Company
          </label>
          <input
            type="text"
            name="company"
            id="company"
            defaultValue="Acme Inc."
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
            Timezone
          </label>
          <select
            id="timezone"
            name="timezone"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            defaultValue="America/New_York"
          >
            <option value="America/New_York">Eastern Time (US & Canada)</option>
            <option value="America/Chicago">Central Time (US & Canada)</option>
            <option value="America/Denver">Mountain Time (US & Canada)</option>
            <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
            <option value="Europe/London">London</option>
            <option value="Asia/Tokyo">Tokyo</option>
          </select>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FaSave className="mr-2 h-4 w-4" />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

function SecuritySettings() {
  return (
    <div className="p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h2>
      <form className="space-y-6">
        <div>
          <label htmlFor="current_password" className="block text-sm font-medium text-gray-700">
            Current Password
          </label>
          <input
            type="password"
            name="current_password"
            id="current_password"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="new_password" className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            type="password"
            name="new_password"
            id="new_password"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700">
            Confirm New Password
          </label>
          <input
            type="password"
            name="confirm_password"
            id="confirm_password"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="rounded-md bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaLock className="h-5 w-5 text-yellow-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Two-Factor Authentication</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>Two-factor authentication is currently disabled. Enable it for added security.</p>
              </div>
              <div className="mt-3">
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  Enable 2FA
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FaSave className="mr-2 h-4 w-4" />
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
}

function ApiKeySettings() {
  const [apiKeys, setApiKeys] = useState([
    { name: "Website Integration", key: "sk_test_abcdefg123456789", created: "May 12, 2023" },
    { name: "Mobile App", key: "sk_test_hijklmn987654321", created: "Jun 3, 2023" }
  ]);

  // New API key state and handler
  const [newKeyName, setNewKeyName] = useState("");
  const [newApiKey, setNewApiKey] = useState("");

  // List of predefined API key options
  const apiKeyOptions = [
    { id: "openai", name: "OpenAI API Key (OPENAI_API_KEY)", description: "Required for OpenAI models like GPT-3.5, GPT-4, etc." },
    { id: "anthropic", name: "Anthropic API Key (ANTHROPIC_API_KEY)", description: "Required for Anthropic models like Claude" },
    { id: "serper", name: "Serper API Key", description: "For web search capabilities" },
    { id: "serpapi", name: "SerpAPI Key", description: "Alternative for web search capabilities" },
    { id: "custom", name: "Custom API Key", description: "Add any other API key" }
  ];

  const handleAddApiKey = () => {
    if (!newKeyName || !newApiKey) return;

    const now = new Date();
    const created = now.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });

    // Add the new API key to the list
    setApiKeys([
      ...apiKeys,
      { name: newKeyName, key: newApiKey, created }
    ]);

    // Reset the form
    setNewKeyName("");
    setNewApiKey("");
  };

  const handleDeleteApiKey = (index: number) => {
    const updatedApiKeys = [...apiKeys];
    updatedApiKeys.splice(index, 1);
    setApiKeys(updatedApiKeys);
  };

  const handleKeySelection = (selectedKeyId: string) => {
    const selectedKey = apiKeyOptions.find(option => option.id === selectedKeyId);
    if (selectedKey && selectedKey.id !== "custom") {
      setNewKeyName(selectedKey.name);
    } else {
      setNewKeyName("");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">API Keys</h2>

      <div className="mb-6">
        <p className="text-sm text-gray-600">
          Your API keys grant access to various services. Keep them secure and never share them publicly.
        </p>
      </div>

      {/* Add new API key form */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-md font-medium text-gray-900 mb-3">Add New API Key</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="key-type" className="block text-sm font-medium text-gray-700">
              Key Type
            </label>
            <select
              id="key-type"
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              onChange={(e) => handleKeySelection(e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>Select an API key type</option>
              {apiKeyOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>

          {newKeyName === "" && (
            <div>
              <label htmlFor="key-name" className="block text-sm font-medium text-gray-700">
                Key Name
              </label>
              <input
                type="text"
                id="key-name"
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Give this API key a name"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
              />
            </div>
          )}

          <div>
            <label htmlFor="api-key" className="block text-sm font-medium text-gray-700">
              API Key
            </label>
            <input
              type="password"
              id="api-key"
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your API key"
              value={newApiKey}
              onChange={(e) => setNewApiKey(e.target.value)}
            />
          </div>

          <div>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={handleAddApiKey}
            >
              <FaKey className="mr-2 h-4 w-4" />
              Add API Key
            </button>
          </div>
        </div>
      </div>

      {/* List of existing API keys */}
      <div className="space-y-4">
        {apiKeys.map((apiKey, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-md">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">{apiKey.name}</h3>
                <p className="text-xs text-gray-500 mt-1">Created on {apiKey.created}</p>
              </div>
              <div>
                <button
                  onClick={() => handleDeleteApiKey(index)}
                  className="text-sm text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="mt-2 flex items-center">
              <input
                type="text"
                readOnly
                value={apiKey.key.substring(0, 8) + "..."}
                className="flex-1 bg-gray-100 border border-gray-300 text-gray-800 text-sm rounded-md py-1 px-2"
              />
              <button
                onClick={() => navigator.clipboard.writeText(apiKey.key)}
                className="ml-2 text-sm text-indigo-600 hover:text-indigo-900"
              >
                Copy
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <p className="text-xs text-gray-500">
          Note: API keys are stored securely and only used for the intended integrations. For security reasons, we only display the first few characters of each key.
        </p>
      </div>
    </div>
  );
}

function IntegrationSettings() {
  const integrations = [
    { name: "Google Analytics", connected: true, icon: "https://www.gstatic.com/analytics-suite/header/suite/v2/ic_analytics.svg" },
    { name: "Webflow", connected: true, icon: "https://assets-global.website-files.com/5d3e265ac89f6a3e64292efc/5d5595354de4fbdd8c554dba_default_webclip.png" }
  ];

  return (
    <div className="p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Connected Services</h2>

      <div className="space-y-4">
        {integrations.map((integration, index) => (
          <div key={index} className="border border-gray-200 rounded-md p-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative h-8 w-8 mr-3">
                <Image
                  src={integration.icon}
                  alt={integration.name}
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">{integration.name}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {integration.connected ? "Connected" : "Not connected"}
                </p>
              </div>
            </div>
            <button
              className={`px-3 py-1 text-sm font-medium rounded-md ${integration.connected
                  ? "text-red-700 bg-red-100 hover:bg-red-200"
                  : "text-green-700 bg-green-100 hover:bg-green-200"
                }`}
            >
              {integration.connected ? "Disconnect" : "Connect"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotificationSettings() {
  return (
    <div className="p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Email Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="agent_completion"
                  name="agent_completion"
                  type="checkbox"
                  defaultChecked
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="agent_completion" className="font-medium text-gray-700">Agent run completion</label>
                <p className="text-gray-500">Receive notifications when an agent completes its run</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="workflow_completion"
                  name="workflow_completion"
                  type="checkbox"
                  defaultChecked
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="workflow_completion" className="font-medium text-gray-700">Workflow completion</label>
                <p className="text-gray-500">Receive notifications when a workflow completes</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="human_feedback_required"
                  name="human_feedback_required"
                  type="checkbox"
                  defaultChecked
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="human_feedback_required" className="font-medium text-gray-700">Human feedback required</label>
                <p className="text-gray-500">Receive notifications when human feedback is required for a run</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="system_updates"
                  name="system_updates"
                  type="checkbox"
                  defaultChecked
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="system_updates" className="font-medium text-gray-700">System updates</label>
                <p className="text-gray-500">Receive notifications about system updates and maintenance</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Notification Delivery</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaSync className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Real-time In-App Notifications</p>
                  <p className="text-xs text-gray-500">Get notifications in real time within the application</p>
                </div>
              </div>
              <div className="flex items-center">
                <button
                  type="button"
                  className="bg-gray-200 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  role="switch"
                  aria-checked="true"
                >
                  <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"></span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaBell className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Browser Push Notifications</p>
                  <p className="text-xs text-gray-500">Receive notifications even when you&apos;re not using the app</p>
                </div>
              </div>
              <div className="flex items-center">
                <button
                  type="button"
                  className="bg-gray-200 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  role="switch"
                  aria-checked="false"
                >
                  <span className="translate-x-0 pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <FaSave className="mr-2 h-4 w-4" />
          Save Preferences
        </button>
      </div>
    </div>
  );
} 