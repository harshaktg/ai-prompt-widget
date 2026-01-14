# AI Prompt Widget

A standalone React app for configuring AI prompts in the Atlan Automation Engine. This widget provides a user-friendly interface for building AI prompts with custom attributes, model selection, and advanced settings.

## Features

- **Prompt Editor**: Rich textarea with variable insertion for building prompts
- **Attribute Management**: Add/remove input attributes and define output attribute names
- **Model Selection**: Dropdown for popular AI models (GPT-4, Claude, etc.)
- **Advanced Settings**: Configure base URL, API key, temperature, and max tokens
- **Theme Sync**: Automatic light/dark mode matching the host application
- **iframe Integration**: Seamless embedding in Automation Engine via iframe SDK

## Getting Started

### Development

```bash
# Install dependencies
npm install

# Start dev server (runs on http://localhost:3002)
npm run dev
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Architecture

This widget is built with:
- **React 19** with TypeScript
- **Vite** for fast development and building
- **@atlanhq/automation-iframe-sdk** for iframe communication

### Component Structure

```
src/
├── App.tsx                    # Main app component with SDK integration
├── App.css                    # Styles with theme support
├── types.ts                   # TypeScript interfaces
└── components/
    ├── PromptEditor.tsx       # Prompt editing with variable insertion
    ├── ModelSelector.tsx      # AI model dropdown
    ├── AdvancedSettings.tsx   # Collapsible advanced configuration
    └── AttributeSelector.tsx  # Input/output attribute management
```

## Integration with Automation Engine

This widget is designed to be embedded in the Automation Engine's PropertyPanel via iframe.

### How it Works

1. **Activity Registration**: The `ai_prompt_activity.py` includes `ui_app_url="http://localhost:3002"` in the decorator
2. **User Selects Node**: When a user selects the AI Prompt activity node in the workflow builder
3. **iframe Loads**: The CustomAppRenderer creates an iframe and loads this widget
4. **SDK Initializes**: The widget uses `useAutomationNode` hook to:
   - Send READY message to host
   - Receive initial inputs via INIT message
   - Send CHANGE messages when user updates fields
   - Receive PROPS_UPDATE messages for external changes
5. **State Sync**: All changes are automatically synced with the workflow state via the SDK

## Input/Output Schema

The widget manages the following inputs (matching `ai_prompt_activity` schema):

```typescript
{
  formatted_prompt: string;              // AI prompt with {variable} placeholders
  input_attributes: string[];            // List of attribute names
  output_attribute_name: string;         // Name for the AI response field
  ai_config: {
    model_name: string;                  // e.g., "gpt-4o"
    provider: string;                    // e.g., "openai"
    base_url: string;                    // API endpoint
    api_key: string;                     // API authentication key
    temperature?: number;                // 0-2, controls randomness
    max_tokens?: number;                 // Max response length
  }
}
```

## Development Workflow

### Terminal 1: Run Widget
```bash
cd /Users/harshavardhan.n/Workspace/Atlan/ai-prompt-widget
npm run dev
```

### Terminal 2: Run Automation Engine
```bash
cd /Users/harshavardhan.n/Workspace/Atlan/atlan-automation-engine-app
# Start automation engine
# Widget will load when AI Prompt activity is selected
```

## Testing

1. Start the widget: `npm run dev`
2. Start the automation engine
3. Create a workflow with the AI Prompt activity
4. Drag the activity onto the canvas
5. Select the node
6. Verify:
   - [ ] Widget loads in the PropertyPanel
   - [ ] Initial inputs populate correctly
   - [ ] Changes update workflow state in real-time
   - [ ] Variable insertion works in prompt editor
   - [ ] Model selector updates the config
   - [ ] Advanced settings expand/collapse
   - [ ] Attributes can be added/removed
   - [ ] Theme matches the host application
   - [ ] No console errors

## Deployment

### Option 1: Vercel
```bash
npm run build
# Deploy dist/ folder to Vercel
# Update activity: ui_app_url="https://ai-prompt-widget.vercel.app"
```

### Option 2: Netlify
```bash
npm run build
# Deploy dist/ folder to Netlify
# Update activity: ui_app_url="https://ai-prompt-widget.netlify.app"
```

### Option 3: S3 + CloudFront
```bash
npm run build
# Upload dist/ folder to S3
# Set up CloudFront distribution
# Update activity: ui_app_url="https://d123456.cloudfront.net"
```

## Troubleshooting

### Widget Not Loading
- Check that the widget is running on port 3002
- Verify `ui_app_url` in `ai_prompt_activity.py` matches
- Check browser console for errors

### Changes Not Syncing
- Ensure SDK is initialized (check console for "READY" message)
- Verify origin matches between widget URL and host
- Check CustomAppRenderer is receiving messages

### Theme Not Syncing
- SDK automatically applies theme from host
- Check browser console for theme updates
- Verify CSS variables are defined in App.css

## SDK Usage

This widget uses the automation iframe SDK for all communication:

```typescript
import { useAutomationNode } from '@atlanhq/automation-iframe-sdk/react'

const { inputs, onChange, isReady, theme } = useAutomationNode<AIPromptInputs>()

// onChange automatically sends messages to host
onChange('formatted_prompt', 'new value')

// inputs automatically update when host sends PROPS_UPDATE
console.log(inputs.formatted_prompt)
```

## License

ISC © Atlan Technologies Pvt. Ltd.

## Related Documentation

- [iframe Architecture](../atlan-automation-engine-app/automation_engine/docs/iframe-architecture/README.md)
- [Integration Guide](../atlan-automation-engine-app/automation_engine/docs/iframe-architecture/INTEGRATION.md)
- [Message Protocol](../atlan-automation-engine-app/automation_engine/docs/iframe-architecture/MESSAGE_PROTOCOL.md)
- [SDK Documentation](../blaze/packages/automation-iframe-sdk/README.md)
