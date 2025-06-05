/* eslint-disable @typescript-eslint/no-explicit-any */
export const integrationCredentialMapping: Record<string, string[]> = {
    // Google services

    'googleDrive': ['googleOAuth2'],
    'gmail': ['googleOAuth2'],  // Assuming this is Gmail
    'googleCalendar': ['googleOAuth2'],
    'googleMeet': ['googleOAuth2'],
    'googleSpreadSheet': ['googleOAuth2'],
    'googleTasks': ['googleOAuth2'],

    // Social and communication
    'linkedin': ['linkedinOAuth2'],
    'slack': ['slackOAuth2'],
    'msTeams': ['microsoftOAuth2'],
    'whatsApp': ['whatsAppApiKey'],
    'zoom': ['zoomOAuth2'],

    // CRM and tools
    'hubspot': ['hubspotOAuth2', 'hubspotApiKey'],  // Supports both methods
    'salesforce': ['salesforceOAuth2'],
    'airtable': ['airtableApiKey'],
    'n8n': ['n8nApiKey'],
    'make': ['makeApiKey'],
    'zapier': ['zapierApiKey'],
    'webhook': ['webhookBasicAuth', 'noAuth'],  // May not need auth

    // AI services
    'gpt': ['openaiApiKey'],
    'claude': ['anthropicApiKey'],

    // Other integrations
    'notion': ['notionOAuth2'],
    'trello': ['trelloOAuth2'],
    'asana': ['asanaOAuth2'],
    'calendly': ['calendlyOAuth2'],
    'clickUp': ['clickUpApiKey'],
    'dropbox': ['dropboxOAuth2'],
    'miro': ['miroOAuth2'],
    'clay': ['clayApiKey'],
    'pipedrive': ['pipedriveApiKey', 'pipedriveOAuth2'],
    'customerio': ['customerioApiKey'],
    'messageBird': ['messageBirdApiKey'],
    'sendGrid': ['sendGridApiKey'],
    'monday': ['mondayApiKey'],
    'segment': ['segmentApiKey'],
    'attio': ['attioApiKey'],

    // Control nodes don't need credentials
    'null': [],

    // Email Nodes
    'email': ['smtpEmail', 'gmailOAuth2'],
    'gmailNode': ['gmailOAuth2'],
    'outlookNode': ['outlookOAuth2'],
    'yahooMailNode': ['yahooMailOAuth2'],
    'sendGridNode': ['sendGridApiKey'],
};

// Get credential types needed for a specific node type
export function getCredentialTypesForNode(nodeType: string, nodesList: any[]): string[] {
    // Find the node in the nodesList
    for (const category of nodesList) {
        const node = category.nodes.find((n: any) => n.type === nodeType);
        if (node) {
            const integration = node.integration;
            // Return credential types needed for this integration
            return integrationCredentialMapping[integration] || [];
        }
    }
    return [];
}

// Helper function to check if a node requires OAuth
export function nodeRequiresOAuth(nodeType: string, nodesList: any[]): boolean {
    const credentialTypes = getCredentialTypesForNode(nodeType, nodesList);
    return credentialTypes.some(type => type.endsWith('OAuth2'));
}