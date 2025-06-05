/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";
// import {
//   templateService,
//   ChannelType,
//   TemplateStatus,
// } from "@/services/templateService";
// import { messagingProfileService } from "@/services/messagingProfileService";

interface EmailNodeFormProps {
  updateNodeData: (key: string, value: string) => void;
}

interface Template {
  id: string;
  name: string;
  subjectLine: string;
  content: string;
  messagingProfileId: string;
}

interface MessagingProfile {
  integration: {
    name: string;
  };
  senderEmail: string;
}

const EmailNodeForm = ({ updateNodeData }: EmailNodeFormProps) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [messagingProfile, setMessagingProfile] = useState<MessagingProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        // const fetchedTemplates = await templateService.getTemplates({
        //   channel: ChannelType.EMAIL,
        //   status: TemplateStatus.ACTIVE,
        // });
        setTemplates([]);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch email templates. Please try again.");
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  useEffect(() => {
    if (selectedTemplate && selectedTemplate.messagingProfileId) {
      const fetchMessagingProfile = async () => {
        try {
          // const profile = await messagingProfileService.getProfileById(
          //   selectedTemplate.messagingProfileId
          // );
          setMessagingProfile(null);
        } catch (err) {
          setError("Failed to fetch messaging profile. Please try again.");
        }
      };

      fetchMessagingProfile();
    }
  }, [selectedTemplate]);

  const handleTemplateChange = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
      updateNodeData("templateId", templateId);
      updateNodeData("subject", template.subjectLine);
      updateNodeData("templateName", template.name);
    }
  };

  if (loading) {
    return (
      <Card className="w-full h-full flex items-center justify-center">
        <CardContent>
          <div className="animate-spin rounded-full h-32 w-32 border-b-2"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full h-full bg-destructive/20 text-destructive">
        <CardContent className="flex flex-col items-center justify-center h-full">
          <AlertCircle className="h-16 w-16 mb-4" />
          <p className="text-lg text-center">{error}</p>
          <Button
            className="mt-4"
            variant="outline"
            onClick={() => setLoading(true)}
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (templates.length === 0) {
    return (
      <Card className="w-full h-full bg-warning/20 border">
        <CardContent className="flex flex-col items-center justify-center h-full">
          <AlertCircle className="h-16 w-16 mb-6" />
          <p className="text-lg text-center mb-8">
            No active email templates found. Please create an active email
            template to continue.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              /* Navigate to template creation page */
            }}
            className="border"
          >
            Create Email Template
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full shadow-lg border">
      <CardHeader>
        {/* <CardTitle className="text-3xl font-bold text-meadow-300 flex items-center">
          <Mail className="mr-2" /> Configure Email Node
        </CardTitle> */}
        <CardDescription>
          Set up your email configuration for this workflow node.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="template" className="w-full">
          <TabsList className="grid w-full grid-cols-2 ">
            <TabsTrigger
              value="template"
              className="data-[state=active]:bg-meadow-700"
            >
              Template
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-meadow-700"
            >
              Settings
            </TabsTrigger>
          </TabsList>
          <TabsContent value="template">
            <div className="space-y-6">
              <div>
                <Label
                  htmlFor="template"
                  className="text-meadow-300 mb-2 block text-lg"
                >
                  Select Template
                </Label>
                <Select
                  onValueChange={handleTemplateChange}
                  value={selectedTemplate?.id}
                >
                  <SelectTrigger
                    id="template"
                    className="w-full focus:ring-meadow-500"
                  >
                    <SelectValue placeholder="Choose a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem
                        key={template.id}
                        value={template.id}
                      >
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedTemplate && (
                <div className=" p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 text-meadow-300">
                    Template Preview
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label
                        htmlFor="subject"
                        className="text-meadow-300 mb-2 block"
                      >
                        Subject
                      </Label>
                      <Input
                        id="subject"
                        value={selectedTemplate.subjectLine}
                        readOnly
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="preview"
                        className="text-meadow-300 mb-2 block"
                      >
                        Content Preview
                      </Label>
                      <div>
                        {selectedTemplate.content.substring(0, 200)}...
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="settings">
            <div className="space-y-6">
              {messagingProfile ? (
                <div className="p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 text-meadow-300">
                    Messaging Profile
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label
                        htmlFor="integration"
                        className="text-meadow-300 mb-2 block"
                      >
                        Integration
                      </Label>
                      <Input
                        id="integration"
                        value={messagingProfile?.integration?.name}
                        readOnly
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="sender"
                        className="text-meadow-300 mb-2 block"
                      >
                        Sender Email
                      </Label>
                      <Input
                        id="sender"
                        value={messagingProfile.senderEmail}
                        readOnly
                        className="  focus:ring-meadow-500"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64  rounded-lg">
                  <p className="text-meadow-300 text-lg">
                    Select a template to view settings
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EmailNodeForm;
