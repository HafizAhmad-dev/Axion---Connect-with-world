import { useRef, useEffect } from "react";

interface EditableTextProps {
    value: string;
    onChange: (text: string) => void;
    maxLength?: number;
    placeholder?: string;
    className?: string;
}

const CustomInput = ({
    value,
    onChange,
    maxLength = 220,
    placeholder = "Type here...",
    className = "",
}: EditableTextProps) => {
    const editableRef = useRef<HTMLDivElement>(null);

    // Update div content when `value` changes externally
    useEffect(() => {
        if (editableRef.current && editableRef.current.textContent !== value) {
            editableRef.current.textContent = value;
        }
    }, [value]);

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        const el = e.currentTarget;
        let text = el.textContent || "";

        if (text.length > maxLength) {
            text = text.slice(0, maxLength);
            el.textContent = text;

            const range = document.createRange();
            const sel = window.getSelection();
            range.selectNodeContents(el);
            range.collapse(false);
            sel?.removeAllRanges();
            sel?.addRange(range);
        }

        onChange(text);
    };

    return (
        <div
            ref={editableRef}
            contentEditable
            data-placeholder={placeholder}
            onInput={handleInput}
            className={`${className}`}
        />
    );
};

export default CustomInput;


