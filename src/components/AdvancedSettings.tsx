import { useState } from 'react'
import type { AIConfig } from '../types'

interface AdvancedSettingsProps {
    config: AIConfig
    onChange: (updates: Partial<AIConfig>) => void
}

export default function AdvancedSettings({
    config,
    onChange,
}: AdvancedSettingsProps) {
    const [isExpanded, setIsExpanded] = useState(false)

    const temperature = config.temperature ?? 0.7
    const maxTokens = config.max_tokens ?? 200

    return (
        <div className="advanced-settings">
            <button
                type="button"
                className="advanced-settings-toggle"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <span className="toggle-icon">{isExpanded ? '▼' : '▶'}</span>
                Advanced Settings
            </button>

            {isExpanded && (
                <div className="advanced-settings-content">
                    {/* Base URL */}
                    <div className="field-group">
                        <label htmlFor="base-url" className="field-label">
                            Base URL
                        </label>
                        <input
                            id="base-url"
                            type="url"
                            value={config.base_url}
                            onChange={(e) =>
                                onChange({ base_url: e.target.value })
                            }
                            placeholder="https://api.openai.com"
                            className="text-input"
                        />
                        <p className="field-hint">
                            API endpoint URL for the AI provider
                        </p>
                    </div>

                    {/* API Key */}
                    <div className="field-group">
                        <label htmlFor="api-key" className="field-label">
                            API Key
                        </label>
                        <input
                            id="api-key"
                            type="password"
                            value={config.api_key}
                            onChange={(e) =>
                                onChange({ api_key: e.target.value })
                            }
                            placeholder="Enter your API key"
                            className="text-input"
                        />
                        <p className="field-hint">
                            Your API key for authentication
                        </p>
                    </div>

                    {/* Temperature */}
                    <div className="field-group">
                        <label htmlFor="temperature" className="field-label">
                            Temperature: {temperature.toFixed(1)}
                        </label>
                        <div className="slider-container">
                            <span className="slider-label">0</span>
                            <input
                                id="temperature"
                                type="range"
                                min="0"
                                max="2"
                                step="0.1"
                                value={temperature}
                                onChange={(e) =>
                                    onChange({
                                        temperature: parseFloat(e.target.value),
                                    })
                                }
                                className="slider"
                            />
                            <span className="slider-label">2</span>
                        </div>
                        <p className="field-hint">
                            Controls randomness. Lower = more focused, Higher = more creative
                        </p>
                    </div>

                    {/* Max Tokens */}
                    <div className="field-group">
                        <label htmlFor="max-tokens" className="field-label">
                            Max Tokens
                        </label>
                        <input
                            id="max-tokens"
                            type="number"
                            min="1"
                            max="4000"
                            value={maxTokens}
                            onChange={(e) =>
                                onChange({
                                    max_tokens: parseInt(e.target.value) || 200,
                                })
                            }
                            className="number-input"
                        />
                        <p className="field-hint">
                            Maximum length of the AI response
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}
