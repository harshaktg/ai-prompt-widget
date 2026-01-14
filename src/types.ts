/**
 * TypeScript types for AI Prompt Widget
 * Matches the schema of ai_prompt_activity inputs
 */

export interface AIConfig {
    model_name: string
    provider: string
    base_url: string
    api_key: string
    temperature?: number
    max_tokens?: number
}

export interface AIPromptInputs {
    formatted_prompt: string
    input_attributes: string[]
    output_attribute_name: string
    ai_config: AIConfig
}

export interface ModelOption {
    id: string
    label: string
    provider: string
}
