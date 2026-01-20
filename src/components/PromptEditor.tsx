import { useState, useRef, useEffect } from 'react'
import { memo } from 'react'

interface PromptEditorProps {
    value: string
    onChange: (value: string) => void
    availableAttributes: string[]
}

function PromptEditor({
    value,
    onChange,
    availableAttributes,
}: PromptEditorProps) {
    const [localValue, setLocalValue] = useState(value)
    const [showInsertMenu, setShowInsertMenu] = useState(false)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    // Sync local value when prop changes (for external updates like initialization)
    useEffect(() => {
        setLocalValue(value)
    }, [value])

    const handleChange = (newValue: string) => {
        // Update local state immediately (instant UI feedback)
        setLocalValue(newValue)
        // Call parent onChange (debounced in parent)
        onChange(newValue)
    }

    const insertVariable = (attribute: string) => {
        const textarea = textareaRef.current
        if (!textarea) return

        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const newValue =
            localValue.substring(0, start) +
            `{${attribute}}` +
            localValue.substring(end)

        handleChange(newValue)
        setShowInsertMenu(false)

        // Set cursor position after inserted variable
        setTimeout(() => {
            textarea.focus()
            const newPosition = start + attribute.length + 2
            textarea.setSelectionRange(newPosition, newPosition)
        }, 0)
    }

    const charCount = localValue.length

    const menuId = 'variable-insert-menu'

    return (
        <fieldset className="prompt-editor" role="group" aria-labelledby="prompt-label">
            <div className="editor-header">
                <label id="prompt-label" htmlFor="prompt-textarea" className="editor-label">
                    Prompt Template
                </label>
                <div className="editor-actions">
                    <button
                        type="button"
                        className="insert-variable-btn"
                        onClick={() => setShowInsertMenu(!showInsertMenu)}
                        aria-expanded={showInsertMenu}
                        aria-controls={menuId}
                        aria-haspopup="menu"
                    >
                        Insert Variable
                    </button>
                    <span className="char-count" aria-live="polite" aria-atomic="true">
                        {charCount} characters
                    </span>
                </div>
            </div>

            {showInsertMenu && availableAttributes.length > 0 && (
                <div
                    id={menuId}
                    className="variable-menu"
                    role="menu"
                    aria-label="Available variables to insert"
                >
                    <div className="variable-menu-header" role="presentation">
                        Select an attribute to insert:
                    </div>
                    {availableAttributes.map((attr) => (
                        <button
                            key={attr}
                            type="button"
                            className="variable-item"
                            role="menuitem"
                            onClick={() => insertVariable(attr)}
                        >
                            {`{${attr}}`}
                        </button>
                    ))}
                </div>
            )}

            <textarea
                id="prompt-textarea"
                ref={textareaRef}
                value={localValue}
                onChange={(e) => handleChange(e.target.value)}
                placeholder="Enter your AI prompt here. Use {attribute_name} to reference input attributes."
                className="prompt-textarea"
                rows={8}
                aria-describedby="prompt-hint"
            />

            <p id="prompt-hint" className="editor-hint">
                Use curly braces to reference attributes, e.g.,{' '}
                <code>{'{name}'}</code> or <code>{'{qualifiedName}'}</code>
            </p>
        </fieldset>
    )
}

// Memoize to prevent unnecessary re-renders when parent updates
export default memo(PromptEditor)
