import { useState } from 'react'
import type { AIConfig } from '../types'

/**
 * ⚠️ SECURITY WARNING: API Key Handling
 *
 * This component currently stores API keys in React state and sends them via postMessage
 * to the parent application. This is NOT recommended for production use.
 *
 * RECOMMENDED SECURE APPROACH:
 * 1. Store API keys in backend secrets management (e.g., Vault, AWS Secrets Manager)
 * 2. Use a reference/identifier instead of the actual key in the frontend
 * 3. The backend should proxy API calls using the stored credentials
 * 4. Never expose API keys in:
 *    - Frontend state
 *    - postMessage payloads
 *    - Browser DevTools
 *    - Network requests from the browser
 *
 * See: docs/SECURITY.md for detailed implementation guide
 */

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

    const panelId = 'advanced-settings-panel'

    return (
        <div className="advanced-settings">
            <button
                type="button"
                className="advanced-settings-toggle"
                onClick={() => setIsExpanded(!isExpanded)}
                aria-expanded={isExpanded}
                aria-controls={panelId}
            >
                <span className="toggle-icon" aria-hidden="true">
                    {isExpanded ? '▼' : '▶'}
                </span>
                Advanced Settings
            </button>

            {isExpanded && (
                <div
                    id={panelId}
                    className="advanced-settings-content"
                    role="region"
                    aria-label="Advanced AI configuration settings"
                >
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
                            aria-describedby="base-url-hint"
                        />
                        <p id="base-url-hint" className="field-hint">
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
                            autoComplete="off"
                            data-lpignore="true"
                            aria-describedby="api-key-hint api-key-warning"
                        />
                        <p id="api-key-hint" className="field-hint">
                            Your API key for authentication
                        </p>
                        <p
                            id="api-key-warning"
                            className="field-warning"
                            role="alert"
                            style={{
                                marginTop: '4px',
                                padding: '8px',
                                backgroundColor: '#fef3c7',
                                border: '1px solid #f59e0b',
                                borderRadius: '4px',
                                fontSize: '11px',
                                color: '#92400e',
                            }}
                        >
                            <strong>Security Note:</strong> For production use, API keys should be
                            stored in a secure backend secrets manager, not in the browser.
                            Contact your administrator to configure secure credential storage.
                        </p>
                    </div>

                    {/* Temperature */}
                    <div className="field-group">
                        <label htmlFor="temperature" className="field-label">
                            Temperature: <span aria-live="polite">{temperature.toFixed(1)}</span>
                        </label>
                        <div className="slider-container">
                            <span className="slider-label" aria-hidden="true">0</span>
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
                                aria-describedby="temperature-hint"
                                aria-valuemin={0}
                                aria-valuemax={2}
                                aria-valuenow={temperature}
                                aria-valuetext={`Temperature: ${temperature.toFixed(1)}`}
                            />
                            <span className="slider-label" aria-hidden="true">2</span>
                        </div>
                        <p id="temperature-hint" className="field-hint">
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
                            aria-describedby="max-tokens-hint"
                        />
                        <p id="max-tokens-hint" className="field-hint">
                            Maximum length of the AI response
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}
