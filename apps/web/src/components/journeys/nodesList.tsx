/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    Mail,
    Flag,
    Clock,
    MessageCircle,
    Bell,
    Shuffle,
    CircleCheck,
    Webhook,
    SplitIcon,
    ArrowRight,
    PhoneCallIcon,
} from "lucide-react";
import { SiAirtable, SiAnthropic, SiAsana, SiCalendly, SiClickup, SiDropbox, SiGmail, SiGooglecalendar, SiGooglemeet, SiGooglesheets, SiGoogletasks, SiHubspot, SiLinkedin, SiMake, SiMiro, SiN8N, SiNotion, SiOpenai, SiSalesforce, SiSlack, SiTrello, SiWhatsapp, SiZapier, SiZoom } from "react-icons/si";
import { FaCode, FaRegCircle } from "react-icons/fa";
import { BiLogoMicrosoftTeams } from "react-icons/bi";
import { TbArrowsRight, TbArrowsJoin2, TbBrandZapier } from "react-icons/tb";
import * as images from "@/components/journeys/icons";
import { RiRobot2Line } from "react-icons/ri";
import { LuFolderLock } from "react-icons/lu";
import { IoDocumentTextOutline } from "react-icons/io5";



type Integration = {
    type: string;
    label: string;
    icon: React.ElementType;
    image?: any;
    credentialTypes: string[];
    // Array of credential types needed for this integration
    credentialnputFields?: {
        type: string;
        details: Record<string, any>;
    }[];
}

export const integrations: Integration[] = [
    {
        type: "email", label: "Email", icon: Mail,
        credentialTypes: ["smtpEmail", "gmailOAuth2"],
        credentialnputFields: [
            {
                type: "smtpEmail",
                details: {
                    host: {
                        label: "Host",
                        type: "text",
                        placeholder: "smtp.example.com",
                    },
                    port: {
                        label: "Port",
                        type: "text",
                        placeholder: "587",
                    },
                    username: {
                        label: "Username",
                        type: "text",
                        placeholder: "",
                    },
                    password: {
                        label: "Password",
                        type: "password",
                        placeholder: "********",
                    },
                },
            },
            {
                type: "gmailOAuth2",
                details: {
                    clientId: {
                        label: "Client ID",
                        type: "text",
                        placeholder: "",
                    },
                    clientSecret: {
                        label: "Client Secret",
                        type: "password",
                        placeholder: "********",
                    },
                    refreshToken: {
                        label: "Refresh Token",
                        type: "text",
                        placeholder: "",
                    },
                },
            }
        ]
    },
   // { type: "sms", label: "SMS", icon: MessageCircle, credentialTypes: [] },
    {
        type: "call", label: "Call", icon: PhoneCallIcon, credentialTypes: ["vapiCredentials"],
        credentialnputFields: [
            {
                type: "vapiCredentials",
                details: {
                    username: {
                        label: "Username",
                        type: "text",
                        placeholder: "",
                    },
                    password: {
                        label: "Password",
                        type: "password",
                        placeholder: "********",
                    },
                },
            }
        ]
    },
    { type: "notification", label: "Push Notification", icon: Bell, credentialTypes: [] },
    {
        type: "linkedin", label: "Linkedin", icon: SiLinkedin, credentialTypes: ["linkedinOAuth2"],
        image: images.linkedin,
        credentialnputFields: [
            {
                type: "linkedinOAuth2",
                details: {
                    clientId: {
                        label: "Client ID",
                        type: "text",
                        placeholder: "",
                    },
                    clientSecret: {
                        label: "Client Secret",
                        type: "password",
                        placeholder: "********",
                    },
                    redirectUri: {
                        label: "Redirect URI",
                        type: "text",
                        placeholder: "",
                    },
                },
            }
        ]
    },
    { type: "googleSpreadSheet", label: "Google Spreadsheet", icon: SiGooglesheets, credentialTypes: ["googleSpreadSheet"], image: images.googleSheet },
    { type: "googleCalendar", label: "Google Calendar", icon: SiGooglecalendar, credentialTypes: ["googleCalendar"], image: images.googleCalrndar },
    { type: "googleMeet", label: "Google Meet", icon: SiGooglemeet, credentialTypes: ["googleMeet"], image: images.googleMeet },
    { type: "googleTasks", label: "Google Tasks", icon: SiGoogletasks, credentialTypes: ["googleTasks"], image: images.googleTasks },
    { type: "googleDrive", label: "Google Drive", icon: SiGooglesheets, credentialTypes: ["googleOAuth2"], image: images.googleDrive },
    { type: "gmail", label: "Gmail", icon: Mail, credentialTypes: ["googleOAuth2"], image: images.gmail },
    { type: "notification", label: "Push Notification", icon: Bell, credentialTypes: [] },
    { type: "msOutlook", label: "Ms Outlook", icon: FaRegCircle, credentialTypes: [], image: images.outlook },
    { type: "msTeams", label: "Ms Team", icon: BiLogoMicrosoftTeams, credentialTypes: [], image: images.msTeams },
    { type: "msOneDrive", label: "Ms OneDrive", icon: FaRegCircle, credentialTypes: [], image: images.msOndrive },
    { type: "n8n", label: "N8N", icon: SiN8N, credentialTypes: [], image: images.n8n },
    { type: "make", label: "Make", icon: SiMake, credentialTypes: [], image: images.make },
    { type: "hubspot", label: "Hubspot", icon: SiHubspot, credentialTypes: [], image: images.hubspot },
    { type: "salesforce", label: "Salesforce", icon: SiSalesforce, credentialTypes: [], image: images.salesforce },
    { type: "clay", label: "Clay", icon: FaRegCircle, credentialTypes: [], image: images.clay },
    { type: "airtable", label: "AirTable", icon: SiAirtable, credentialTypes: [], image: images.airtable },
    { type: "webhook", label: "Webhook", icon: Webhook, credentialTypes: ["webhookBasicAuth", "noAuth"] },
    { type: "zoom", label: "Zoom", icon: SiZoom, credentialTypes: ["zoomOAuth2"], image: images.zoom },
    { type: "slack", label: "Slack", icon: SiSlack, credentialTypes: ["slackOAuth2"], image: images.slack },
    { type: "whatsApp", label: "WhatsApp", icon: SiWhatsapp, credentialTypes: ["whatsAppApiKey"], image: images.whatsapp },
    { type: "gpt", label: "GPT", icon: SiOpenai, credentialTypes: ["openaiApiKey"], image: images.openai },
    { type: "claude", label: "Claude", icon: SiAnthropic, credentialTypes: ["anthropicApiKey"], image: images.claude },
    { type: 'Notion', label: 'Notion', icon: SiNotion, credentialTypes: ['notionOAuth2'], image: images.notion },
    { type: 'Trello', label: 'Trello', icon: SiTrello, credentialTypes: ['trelloOAuth2'], image: images.trello },
    { type: 'Asana', label: 'Asana', icon: SiAsana, credentialTypes: ['asanaOAuth2'], image: images.asana },
    { type: 'Pipedrive', label: 'Pipedrive', icon: FaRegCircle, credentialTypes: ['pipedriveApiKey', 'pipedriveOAuth2'], image: images.pipedrive },
    { type: 'Zapier', label: 'Zapier', icon: SiZapier, credentialTypes: ['zapierApiKey'] },
    { type: 'Code', label: 'Code', icon: FaCode, credentialTypes: [] },
    { type: 'Calendly', label: 'Calendly', icon: SiCalendly, credentialTypes: ['calendlyOAuth2'], image: images.calendly },
    { type: 'ClickUp', label: 'Click Up', icon: SiClickup, credentialTypes: ['clickUpApiKey'], image: images.clickup },
    { type: 'Customerio', label: 'Customer.io', icon: FaRegCircle, credentialTypes: ['customerioApiKey'], image: images.customerio },
    { type: 'Dropbox', label: 'Dropbox', icon: SiDropbox, credentialTypes: ['dropboxOAuth2'], image: images.dropbox },
    { type: 'MessageBird', label: 'MessageBird', icon: FaRegCircle, credentialTypes: ['messageBird'], image: images.messagebird },
    { type: 'SendGrid', label: 'SendGrid', icon: FaRegCircle, credentialTypes: ['sendGridApiKey'], image: images.sendgrid },
    { type: 'Miro', label: 'Miro', icon: SiMiro, credentialTypes: ['miroOAuth2'], image: images.miro },
    { type: 'Monday', label: 'Monday', icon: FaRegCircle, credentialTypes: ['mondayApiKey'], image: images.monday },
    { type: 'Segment', label: 'Slack', icon: FaRegCircle, credentialTypes: ['segmentApiKey'], image: images.segment },
    { type: 'Attio', label: 'Attio', icon: FaRegCircle, credentialTypes: ['attioApiKey'], image: images.attio },
    { type: 'Mailchimp', label: 'Mailchimp', icon: FaRegCircle, credentialTypes: ['mailchimpApiKey'], image: images.mailchimp },
    { type: 'Sendinblue', label: 'Sendinblue', icon: FaRegCircle, credentialTypes: ['sendinblueApiKey'], image: images.sendinblue },
    { type: 'ActiveCampaign', label: 'Active Campaign', icon: FaRegCircle, credentialTypes: ['activeCampaignApiKey'], image: images.activecampaign },
    { type: 'Klaviyo', label: 'Klaviyo', icon: FaRegCircle, credentialTypes: ['klaviyoApiKey'], image: images.klaviyo },
    { type: 'Zoho', label: 'Zoho', icon: FaRegCircle, credentialTypes: ['zohoApiKey'], image: images.zoho },
    { type: 'X', label: 'X', icon: FaRegCircle, credentialTypes: ['xApiKey'], image: images.x },
    { type: 'Huner', label: 'Hunter', icon: FaRegCircle, credentialTypes: ['hunterApiKey'], image: images.hunter },
    { type: 'Lemlist', label: 'Lemlist', icon: FaRegCircle, credentialTypes: ['lemlistApiKey'], image: images.lemlist },
    { type: 'Basecamp', label: 'Basecamp', icon: FaRegCircle, credentialTypes: ['basecampApiKey'], image: images.basecamp },
    { type: 'Box', label: 'Box', icon: FaRegCircle, credentialTypes: ['boxApiKey'], image: images.box },
    { type: 'Calcom', label: 'Calcom', icon: FaRegCircle, credentialTypes: ['calcomApiKey'], image: images.calcom },
    { type: 'Confluence', label: 'Confluence', icon: FaRegCircle, credentialTypes: ['confluenceApiKey'], image: images.confluence },
    { type: 'Docusign', label: 'Docusign', icon: FaRegCircle, credentialTypes: ['docusignApiKey'], image: images.docusign },
    { type: 'Gust', label: 'Gust', icon: FaRegCircle, credentialTypes: ['gustApiKey'], image: images.gust },
    { type: 'HuggingFace', label: 'Hugging Face', icon: FaRegCircle, credentialTypes: ['huggingFace'], image: images.huggingFace },
    { type: 'Pitchbook', label: 'Pitchbook', icon: FaRegCircle, credentialTypes: ['pitchbookApiKey'], image: images.pitchbook },
    { type: 'ProxyCrawl', label: 'ProxyCrawl', icon: FaRegCircle, credentialTypes: ['proxyCrawlApiKey'], image: images.proxyCurl },
    { type: 'Redend', label: 'Redend', icon: FaRegCircle, credentialTypes: ['redendApiKey'], image: images.redend },
    { type: 'Typeform', label: 'Typeform', icon: FaRegCircle, credentialTypes: ['typeformApiKey'], image: images.typeform },
    { type: 'Webflow', label: 'Webflow', icon: FaRegCircle, credentialTypes: ['webflowApiKey'], image: images.webflow },
    { type: 'Smartlead', label: 'Smartlead', icon: FaRegCircle, credentialTypes: ['smartleadApiKey'], image: images.smartlead },
]


type Node = {
    type: string;
    label: string;
    icon: React.ElementType;
    disabled: boolean;
    integration: string | null;
    image?: any;
}

type NodeList = {
    title: string;
    type: string;
    nodes: Node[];
}


export const nodesList: NodeList[] = [
    {
        title: "Action",
        type: "action",
        nodes: [
           // { type: "emailNode", label: "Email", icon: Mail, disabled: false, integration: "email" },
         //    { type: "smsNode", label: "SMS", icon: MessageCircle, disabled: false, integration: "sms" },
            { type: "callNode", label: "Call", icon: PhoneCallIcon, disabled: false, integration: "call" },
            { type: "pushNotificationNode", label: "Push Notification", icon: Bell, disabled: false, integration: "notification" },
            // { type: "taskNode", label: "Task", icon: CircleCheck, integration: "task", disabled: false },
            { type: "webhookNode", label: "Webhook", icon: Webhook, integration: "webhook", disabled: false },
            { type: "codeNode", label: "Code", icon: FaCode, integration: "code", disabled: false },
        ],
    },
    {
        title: "Integrations",
        type: "integrations",
        nodes: [
            { type: "linkedinNode", label: "Linkedin", icon: SiLinkedin, integration: "linkedin", disabled: false, image: images.linkedin },
            { type: "googleSpreadSheetNode", label: "Google Spreadsheet", icon: SiGooglesheets, integration: "googleSpreadSheet", disabled: false, image: images.googleSheet },
            { type: "googleTasksNode", label: "Google Tasks", icon: SiGoogletasks, integration: "googleTasks", disabled: false, image: images.googleTasks },
            { type: "googleCalendar", label: "Google Calendar", icon: SiGooglecalendar, integration: "googleCalendar", disabled: false, image: images.googleCalrndar },
            // { type: "gmailNode", label: "Gmail", icon: SiGmail, integration: "gmail", disabled: false, image: images.gmail },
            { type: "googleDriveNode", label: "Google Drive", icon: SiGooglesheets, integration: "googleDrive", disabled: false, image: images.googleDrive },
            { type: "msOutlookNode", label: "Ms Outlook", icon: FaRegCircle, integration: "msOutlook", disabled: false, image: images.outlook },
            { type: "msOneDriveNode", label: "Ms OneDrive", icon: FaRegCircle, integration: "msOneDrive", disabled: false, image: images.msOndrive },
            { type: "n8nNode", label: "N8N", icon: SiN8N, integration: "n8n", disabled: false, image: images.n8n },
            { type: "makeNode", label: "Make", icon: SiMake, integration: "make", disabled: false, image: images.make },
            { type: "hubspotNode", label: "Hubspot", icon: SiHubspot, integration: "hubspot", disabled: false, image: images.hubspot },
            { type: "salesforceNode", label: "Salesforce", icon: SiSalesforce, integration: "salesforce", disabled: false, image: images.salesforce },
            { type: "airtableNode", label: "AirTable", icon: SiAirtable, integration: "airtable", disabled: false, image: images.airtable },
            { type: "zapierNode", label: "Zapier", icon: SiZapier, integration: "zapier", disabled: false, image: images.zapier },
            { type: "notionNode", label: "Notion", icon: SiNotion, integration: "notion", disabled: false, image: images.notion },
            { type: "trelloNode", label: "Trello", icon: SiTrello, integration: "trello", disabled: false, image: images.trello },
            { type: "asanaNode", label: "Asana", icon: SiAsana, integration: "asana", disabled: false, image: images.asana },
            // { type: 'calendlyNode', label: 'Calendly', icon: SiCalendly, integration: 'calendly', disabled: false, image: images.calendly },
            { type: 'clickUpNode', label: 'Click Up', icon: SiClickup, integration: 'clickUp', disabled: false, image: images.clickup },
            { type: 'dropboxNode', label: 'Dropbox', icon: SiDropbox, integration: 'dropbox', disabled: false, image: images.dropbox },
            // { type: 'miroNode', label: 'Miro', icon: SiMiro, integration: 'miro', disabled: false, image: images.miro },
            // { type: "clayNode", label: "Clay", icon: FaRegCircle, integration: "clay", disabled: false, image: images.clay },
            { type: "pipedriveNode", label: "Pipedrive", icon: FaRegCircle, integration: "pipedrive", disabled: false, image: images.pipedrive },
            { type: 'customerioNode', label: 'Customer.io', icon: FaRegCircle, integration: 'customerio', disabled: false, image: images.customerio },
            { type: 'messageBirdNode', label: 'MessageBird', icon: FaRegCircle, integration: 'messageBird', disabled: false, image: images.messagebird },
            { type: 'sendGridNode', label: 'SendGrid', icon: FaRegCircle, integration: 'sendGrid', disabled: false, image: images.sendgrid },
            { type: 'mondayNode', label: 'Monday', icon: FaRegCircle, integration: 'monday', disabled: false, image: images.monday },
            { type: 'segmentNode', label: 'Segment', icon: FaRegCircle, integration: 'segment', disabled: false, image: images.segment },
            { type: 'attioNode', label: 'Attio', icon: FaRegCircle, integration: 'attio', disabled: false, image: images.attio },
            { type: 'mailchimpNode', label: 'Mailchimp', icon: FaRegCircle, integration: 'mailchimp', disabled: false, image: images.mailchimp },
            { type: 'sendinblueNode', label: 'Sendinblue', icon: FaRegCircle, integration: 'sendinblue', disabled: false, image: images.sendinblue },
            { type: 'activeCampaignNode', label: 'Active Campaign', icon: FaRegCircle, integration: 'activeCampaign', disabled: false, image: images.activecampaign },
            { type: 'klaviyoNode', label: 'Klaviyo', icon: FaRegCircle, integration: 'klaviyo', disabled: false, image: images.klaviyo },
            { type: 'smartleadNode', label: 'Smartlead', icon: FaRegCircle, integration: 'smartlead', disabled: false, image: images.smartlead },
            { type: 'webflowNode', label: 'Webflow', icon: FaRegCircle, integration: 'webflow', disabled: false, image: images.webflow },
            { type: 'zohoNode', label: 'Zoho', icon: FaRegCircle, integration: 'zoho', disabled: false, image: images.zoho },
            { type: 'xNode', label: 'X', icon: FaRegCircle, integration: 'x', disabled: false, image: images.x },
            // { type: 'docuesignNode', label: 'Docusign', icon: FaRegCircle, integration: 'docusign', disabled: false, image: images.docusign },
            // { type: 'CalcomNode', label: 'Calcom', icon: FaRegCircle, integration: 'calcom', disabled: false, image: images.calcom },
            // { type: 'ConfluenceNode', label: 'Confluence', icon: FaRegCircle, integration: 'confluence', disabled: false, image: images.confluence },
            //{ type: 'typeformNode', label: 'Typeform', icon: FaRegCircle, integration: 'typeform', disabled: false, image: images.typeform },
            { type: 'basecampNode', label: 'Basecamp', icon: FaRegCircle, integration: 'basecamp', disabled: false, image: images.basecamp },
        ],
    },
   /*  {
        title: "My Business",
        type: "myBusiness",
        nodes: [
            { type: "DocumentsNode", label: "Documents", icon: IoDocumentTextOutline, integration: "documents", disabled: false },
            { type: "DataroomNode", label: "Dataroom", icon: LuFolderLock, integration: "dataroom", disabled: false },
        ],
    }, */
    {
        title: "Communciation",
        type: "communication",
        nodes: [
            // { type: "zoomNode", label: "Zoom", icon: SiZoom, integration: "zoom", disabled: false, image: images.zoom },
            // { type: "googleMeet", label: "Google Meet", icon: SiGooglemeet, integration: "googleMeet", disabled: false, image: images.googleMeet },
            { type: "slackNode", label: "Slack", icon: SiSlack, integration: "slack", disabled: false, image: images.slack },
            { type: "msTeamsNode", label: "Ms Team", icon: BiLogoMicrosoftTeams, integration: "msTeams", disabled: false, image: images.msTeams },
            { type: "whatsApp", label: "WhatsApp", icon: SiWhatsapp, integration: "whatsApp", disabled: false, image: images.whatsapp },
            //{ type: 'googleChatNode', label: 'Google Chat', icon: FaRegCircle, integration: 'googleChat', disabled: false, image: images.googleChat },
        ],
    },
    {
        title: "AI",
        type: "ai",
        nodes: [
            { type: "brainNode", label: "LLM", icon: RiRobot2Line, integration: "brain", disabled: false },
            { type: "gptNode", label: "Open AI", icon: SiOpenai, integration: "gpt", disabled: false, image: images.openai },
            { type: "claudeNode", label: "Claude", icon: SiAnthropic, integration: "claude", disabled: false, image: images.claude },
        ],
    },
   /*  {
        title: "Data Enrichments",
        type: "data-enrichments",
        nodes: [
            { type: "hunterNode", label: "Hunter", icon: FaRegCircle, integration: "hunter", disabled: false, image: images.hunter },
            { type: "lemlistNode", label: "Lemlist", icon: FaRegCircle, integration: "lemlist", disabled: false, image: images.lemlist },
            { type: "proxyCurl", label: "Proxy Curl", icon: FaRegCircle, integration: "proxyCurl", disabled: false, image: images.proxyCurl },
        ],
    }, */
    {
        title: "Control",
        type: "control",
        nodes: [
            { type: "waitNode", label: "Wait", icon: Clock, integration: null, disabled: false },
            { type: "abTestNode", label: "A/B Test", icon: Shuffle, integration: null, disabled: false },
            { type: "conditionNode", label: "Condition", icon: SplitIcon, integration: null, disabled: false },
            { type: "splitNode", label: "Split", icon: SplitIcon, integration: null, disabled: false },
            { type: "jumpNode", label: "Jump To", icon: ArrowRight, integration: null, disabled: false },
            { type: "joinActionsNode", label: "Join", icon: TbArrowsJoin2, integration: null, disabled: false },
            { type: "MultiActionNode", label: "Multi Actions", icon: TbArrowsRight, integration: null, disabled: false },
        ],
    },
    {
        title: "Other",
        type: "other",
        nodes: [
            { type: "exitNode", label: "Exit", icon: Flag, integration: null, disabled: false }
        ],
    },
];

// { type: "linkedinNode", label: "Linkedin Invitation", icon: SiLinkedin, integration: "linkedin", disabled: false },
// { type: "linkedinProfileViewNode", label: "Linkedin Profile View", icon: SiLinkedin, integration: "linkedin", disabled: false },
// { type: "linkedinMessageNode", label: "Linkedin Message", icon: SiLinkedin, integration: "linkedin", disabled: false },
// { type: "linkedinAudioMessageNode", label: "Linkedin Audio Message", icon: SiLinkedin, integration: "linkedin", disabled: false },