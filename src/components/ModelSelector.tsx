import type { ModelOption } from '../types'

const MODEL_OPTIONS: ModelOption[] = [
    { id: 'gpt-4o', label: 'GPT-4o', provider: 'openai' },
    { id: 'gpt-4-turbo', label: 'GPT-4 Turbo', provider: 'openai' },
    { id: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo', provider: 'openai' },
    { id: 'claude-3-opus-20240229', label: 'Claude 3 Opus', provider: 'anthropic' },
    { id: 'claude-3-sonnet-20240229', label: 'Claude 3 Sonnet', provider: 'anthropic' },
    { id: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku', provider: 'anthropic' },
]

interface ModelSelectorProps {
    value: string
    onChange: (modelName: string, provider: string) => void
}

export default function ModelSelector({ value, onChange }: ModelSelectorProps) {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedModel = MODEL_OPTIONS.find((m) => m.id === e.target.value)
        if (selectedModel) {
            onChange(selectedModel.id, selectedModel.provider)
        }
    }

    const groupedModels = MODEL_OPTIONS.reduce(
        (acc, model) => {
            if (!acc[model.provider]) {
                acc[model.provider] = []
            }
            acc[model.provider].push(model)
            return acc
        },
        {} as Record<string, ModelOption[]>
    )

    return (
        <div className="model-selector" role="group" aria-labelledby="model-label">
            <label id="model-label" htmlFor="model" className="field-label">
                AI Model
            </label>
            <select
                id="model"
                value={value}
                onChange={handleChange}
                className="model-select"
                aria-describedby="model-hint"
                aria-required="true"
            >
                {!value && <option value="">Select a model</option>}
                {Object.entries(groupedModels).map(([provider, models]) => (
                    <optgroup
                        key={provider}
                        label={provider.charAt(0).toUpperCase() + provider.slice(1)}
                    >
                        {models.map((model) => (
                            <option key={model.id} value={model.id}>
                                {model.label}
                            </option>
                        ))}
                    </optgroup>
                ))}
            </select>
            <p id="model-hint" className="sr-only">
                Select the AI model to use for generating content
            </p>
        </div>
    )
}
