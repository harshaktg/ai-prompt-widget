import { useAutomationWidget } from '@atlanhq/automation-iframe-sdk/widget/react'
import { useDebounce } from './hooks/useDebounce'
import { useEffect, useCallback, useMemo } from 'react'
import type { AIPromptInputs, AIConfig } from './types'
import PromptEditor from './components/PromptEditor'
import ModelSelector from './components/ModelSelector'
import AdvancedSettings from './components/AdvancedSettings'
import AttributeSelector from './components/AttributeSelector'
import { DevModeBanner } from './components/DevModeBanner'
import './App.css'

// Mock data for standalone development
const mockInputs: AIPromptInputs = {
    formatted_prompt: 'Write a creative description for {{asset_name}} of type {{asset_type}}',
    input_attributes: ['asset_name', 'asset_type', 'description'],
    output_attribute_name: 'ai_description',
    ai_config: {
        model_name: 'gpt-4',
        provider: 'openai',
        base_url: 'https://api.openai.com',
        api_key: '',
        temperature: 0.7,
        max_tokens: 200,
    },
}

function App() {
    const { inputs, onChange, isReady, theme, mode } =
        useAutomationWidget<AIPromptInputs>({
            mockInputs,
            devModeTimeout: 1000,
            debug: import.meta.env.DEV,
        })

    // Ensure ai_config exists with default values
    const aiConfig: AIConfig = useMemo(() => {
        return inputs?.ai_config || {
            model_name: '',
            provider: '',
            base_url: 'https://api.openai.com',
            api_key: '',
            temperature: 0.7,
            max_tokens: 200,
        }
    }, [inputs])

    // Debounced onChange for long text fields
    const onChangeCallback = useCallback((field: string, value: any) => {
        onChange(field, value)
    }, [onChange])

    const debouncedOnChange = useDebounce(onChangeCallback, 500)

    // Handler functions

    // DEBOUNCED: Long text input
    const handlePromptChange = useCallback((value: string) => {
        debouncedOnChange('formatted_prompt', value)
    }, [debouncedOnChange])

    // IMMEDIATE: Simple array changes
    const handleAttributesChange = useCallback((attributes: string[]) => {
        onChange('input_attributes', attributes)
    }, [onChange])

    // IMMEDIATE: Short text field
    const handleOutputNameChange = useCallback((name: string) => {
        onChange('output_attribute_name', name)
    }, [onChange])

    // IMMEDIATE: Dropdown selection
    const handleModelChange = useCallback((modelName: string, provider: string) => {
        onChange('ai_config', {
            ...aiConfig,
            model_name: modelName,
            provider: provider,
        })
    }, [onChange, aiConfig])

    // DEBOUNCED: Sliders and numeric inputs
    const handleAIConfigChange = useCallback((updates: Partial<AIConfig>) => {
        debouncedOnChange('ai_config', { ...aiConfig, ...updates })
    }, [debouncedOnChange, aiConfig])

    // Flush pending changes on unmount
    useEffect(() => {
        return () => {
            debouncedOnChange.flush()
        }
    }, [debouncedOnChange])

    // Loading state
    if (!isReady || !inputs) {
        return (
            <div
                className="loading-container"
                role="status"
                aria-live="polite"
                aria-busy="true"
            >
                <div className="loading-spinner" aria-hidden="true"></div>
                <p>Connecting to Automation Engine...</p>
            </div>
        )
    }

    const safeInputs = inputs || ({} as AIPromptInputs)

    return (
        <div
            className={`app-container ${theme?.mode === 'dark' ? 'dark' : ''}`}
            role="main"
            aria-label="AI Prompt Configuration Widget"
        >
            {mode === 'standalone' && <DevModeBanner />}

            <header className="header">
                <h1 id="widget-title">AI Prompt Configuration</h1>
                <p className="subtitle">
                    Configure your AI prompt with custom attributes and settings
                    {mode === 'standalone' && (
                        <span style={{
                            marginLeft: '8px',
                            fontSize: '11px',
                            padding: '2px 8px',
                            background: '#e0e7ff',
                            color: '#4338ca',
                            borderRadius: '4px',
                            fontWeight: 600
                        }}>
                            DEV MODE
                        </span>
                    )}
                </p>
            </header>

            <form
                className="form-container"
                aria-labelledby="widget-title"
                onSubmit={(e) => e.preventDefault()}
            >
                <PromptEditor
                    value={safeInputs.formatted_prompt || ''}
                    onChange={handlePromptChange}
                    availableAttributes={safeInputs.input_attributes || []}
                />

                <AttributeSelector
                    inputAttributes={safeInputs.input_attributes || []}
                    outputAttributeName={safeInputs.output_attribute_name || ''}
                    onInputAttributesChange={handleAttributesChange}
                    onOutputNameChange={handleOutputNameChange}
                />

                <ModelSelector
                    value={aiConfig.model_name}
                    onChange={handleModelChange}
                />

                <AdvancedSettings
                    config={aiConfig}
                    onChange={handleAIConfigChange}
                />
            </form>

            <footer className="footer" role="contentinfo">
                <p className="footer-text">
                    AI Prompt Widget - Powered by @atlanhq/automation-iframe-sdk v2.0
                </p>
            </footer>
        </div>
    )
}

export default App
