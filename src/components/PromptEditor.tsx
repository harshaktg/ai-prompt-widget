import { useState, useRef } from 'react'

interface PromptEditorProps {
    value: string
    onChange: (value: string) => void
    availableAttributes: string[]
}

export default function PromptEditor({
    value,
    onChange,
    availableAttributes,
}: PromptEditorProps) {
    const [showInsertMenu, setShowInsertMenu] = useState(false)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const insertVariable = (attribute: string) => {
        const textarea = textareaRef.current
        if (!textarea) return

        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const newValue =
            value.substring(0, start) +
            `{${attribute}}` +
            value.substring(end)

        onChange(newValue)
        setShowInsertMenu(false)

        // Set cursor position after inserted variable
        setTimeout(() => {
            textarea.focus()
            const newPosition = start + attribute.length + 2
            textarea.setSelectionRange(newPosition, newPosition)
        }, 0)
    }

    const charCount = value.length

    return (
        <div className="prompt-editor">
            <div className="editor-header">
                <label className="editor-label">Prompt Template</label>
                <div className="editor-actions">
                    <button
                        type="button"
                        className="insert-variable-btn"
                        onClick={() => setShowInsertMenu(!showInsertMenu)}
                    >
                        Insert Variable
                    </button>
                    <span className="char-count">{charCount} characters</span>
                </div>
            </div>

            {showInsertMenu && availableAttributes.length > 0 && (
                <div className="variable-menu">
                    <div className="variable-menu-header">
                        Select an attribute to insert:
                    </div>
                    {availableAttributes.map((attr) => (
                        <button
                            key={attr}
                            type="button"
                            className="variable-item"
                            onClick={() => insertVariable(attr)}
                        >
                            {`{${attr}}`}
                        </button>
                    ))}
                </div>
            )}

            <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Enter your AI prompt here. Use {attribute_name} to reference input attributes."
                className="prompt-textarea"
                rows={8}
            />

            <p className="editor-hint">
                Use curly braces to reference attributes, e.g.,{' '}
                <code>{'{name}'}</code> or <code>{'{qualifiedName}'}</code>
            </p>
        </div>
    )
}
