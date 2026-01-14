import { useAutomationNode } from '@atlanhq/automation-iframe-sdk/react'
import type { AIPromptInputs, AIConfig } from './types'
import PromptEditor from './components/PromptEditor'
import ModelSelector from './components/ModelSelector'
import AdvancedSettings from './components/AdvancedSettings'
import AttributeSelector from './components/AttributeSelector'
import './App.css'

function App() {
    const { inputs, onChange, isReady, theme } =
        useAutomationNode<AIPromptInputs>()

    if (!isReady) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Initializing AI Prompt Widget...</p>
            </div>
        )
    }

    // Ensure ai_config exists with default values
    const aiConfig: AIConfig = inputs.ai_config || {
        model_name: '',
        provider: '',
        base_url: 'https://api.openai.com',
        api_key: '',
        temperature: 0.7,
        max_tokens: 200,
    }

    // Handler functions for each field
    const handlePromptChange = (value: string) => {
        onChange('formatted_prompt', value)
    }

    const handleAttributesChange = (attributes: string[]) => {
        onChange('input_attributes', attributes)
    }

    const handleOutputNameChange = (name: string) => {
        onChange('output_attribute_name', name)
    }

    const handleModelChange = (modelName: string, provider: string) => {
        onChange('ai_config', {
            ...aiConfig,
            model_name: modelName,
            provider: provider,
        })
    }

    const handleAIConfigChange = (updates: Partial<AIConfig>) => {
        onChange('ai_config', { ...aiConfig, ...updates })
    }

    return (
        <div className={`app-container ${theme?.mode === 'dark' ? 'dark' : ''}`}>
            <div className="header">
                <h1>AI Prompt Configuration</h1>
                <p className="subtitle">
                    Configure your AI prompt with custom attributes and settings
                </p>
            </div>

            <div className="form-container">
                {/* Prompt Editor */}
                <PromptEditor
                    value={inputs.formatted_prompt || ''}
                    onChange={handlePromptChange}
                    availableAttributes={inputs.input_attributes || []}
                />

                {/* Attribute Selector */}
                <AttributeSelector
                    inputAttributes={inputs.input_attributes || []}
                    outputAttributeName={inputs.output_attribute_name || ''}
                    onInputAttributesChange={handleAttributesChange}
                    onOutputNameChange={handleOutputNameChange}
                />

                {/* Model Selector */}
                <ModelSelector
                    value={aiConfig.model_name}
                    onChange={handleModelChange}
                />

                {/* Advanced Settings */}
                <AdvancedSettings
                    config={aiConfig}
                    onChange={handleAIConfigChange}
                />
            </div>

            <div className="footer">
                <p className="footer-text">
                    AI Prompt Widget - Configure prompts for the AI Prompt Activity
                </p>
            </div>
        </div>
    )
}

export default App
