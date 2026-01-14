import { useState } from 'react'

interface AttributeSelectorProps {
    inputAttributes: string[]
    outputAttributeName: string
    onInputAttributesChange: (attrs: string[]) => void
    onOutputNameChange: (name: string) => void
}

export default function AttributeSelector({
    inputAttributes,
    outputAttributeName,
    onInputAttributesChange,
    onOutputNameChange,
}: AttributeSelectorProps) {
    const [newAttributeValue, setNewAttributeValue] = useState('')

    const handleAddAttribute = () => {
        const trimmedValue = newAttributeValue.trim()
        if (trimmedValue && !inputAttributes.includes(trimmedValue)) {
            onInputAttributesChange([...inputAttributes, trimmedValue])
            setNewAttributeValue('')
        }
    }

    const handleRemoveAttribute = (index: number) => {
        const updated = inputAttributes.filter((_, i) => i !== index)
        onInputAttributesChange(updated)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleAddAttribute()
        }
    }

    return (
        <div className="attribute-selector">
            {/* Input Attributes */}
            <div className="field-group">
                <label className="field-label">Input Attributes</label>
                
                {/* Tags Display */}
                {inputAttributes.length > 0 && (
                    <div className="attribute-tags">
                        {inputAttributes.map((attr, index) => (
                            <div key={index} className="attribute-tag">
                                <span className="tag-text">{attr}</span>
                                <button
                                    type="button"
                                    className="tag-remove"
                                    onClick={() => handleRemoveAttribute(index)}
                                    aria-label={`Remove ${attr}`}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add Input */}
                <div className="attribute-input-wrapper">
                    <input
                        type="text"
                        value={newAttributeValue}
                        onChange={(e) => setNewAttributeValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter attribute name and press Enter"
                        className="text-input"
                    />
                    <button
                        type="button"
                        onClick={handleAddAttribute}
                        disabled={!newAttributeValue.trim()}
                        className="add-btn"
                    >
                        Add
                    </button>
                </div>

                <p className="field-hint">
                    Attributes from previous steps that will be passed to the AI prompt
                </p>
            </div>

            {/* Output Attribute Name */}
            <div className="field-group">
                <label htmlFor="output-name" className="field-label">
                    Output Attribute Name
                </label>
                <input
                    id="output-name"
                    type="text"
                    value={outputAttributeName}
                    onChange={(e) => onOutputNameChange(e.target.value)}
                    placeholder="e.g., userDescription, summary, classification"
                    className="text-input"
                />
                <p className="field-hint">
                    Name for the AI-generated response field
                </p>
            </div>
        </div>
    )
}
