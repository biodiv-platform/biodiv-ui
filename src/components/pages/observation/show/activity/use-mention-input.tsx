// useMentionInput.ts
import { ChangeEvent, KeyboardEvent, RefObject,useCallback, useRef, useState } from "react";

export interface MentionUser {
  id: string | number;
  name: string;
}

interface ActiveMention {
  query: string;
  start: number;
}

interface DropdownPosition {
  top: number;
  left: number;
}

interface UseMentionInputOptions {
  fetchSuggestions: (query: string) => Promise<MentionUser[]>;
  trigger?: string;
  debounceMs?: number;
}

interface UseMentionInputResult {
  text: string;
  setText: (text: string) => void;
  suggestions: MentionUser[];
  highlightIndex: number;
  setHighlightIndex: (index: number) => void;
  dropdownPos: DropdownPosition | null;
  textareaRef: RefObject<HTMLTextAreaElement>;
  handleChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  handleKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  insertMention: (user: MentionUser) => void;
  buildSubmitBody: () => string;
  reset: () => void;
}

function findActiveMention(text: string, cursor: number, trigger: string): ActiveMention | null {
  const upToCursor = text.slice(0, cursor);
  const escaped = trigger.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`(?:^|\\s)${escaped}([^\\s${escaped}]*)$`);
  const match = upToCursor.match(re);
  if (!match) return null;
  const query = match[1];
  const start = upToCursor.length - query.length - trigger.length;
  return { query, start };
}

function getCaretCoordinates(textarea: HTMLTextAreaElement, position: number): DropdownPosition {
  const style = window.getComputedStyle(textarea);
  const div = document.createElement("div");

  const props: (keyof CSSStyleDeclaration)[] = [
    "boxSizing", "width", "fontFamily", "fontSize", "fontWeight",
    "letterSpacing", "lineHeight", "paddingTop", "paddingRight",
    "paddingBottom", "paddingLeft", "borderTopWidth", "borderRightWidth",
    "borderBottomWidth", "borderLeftWidth", "whiteSpace", "wordWrap",
    "overflowWrap",
  ];
  props.forEach((p) => {
    // style[p] is read-only typed but assignable at runtime via index signature
    (div.style as any)[p] = style[p];
  });

  div.style.position = "absolute";
  div.style.visibility = "hidden";
  div.style.whiteSpace = "pre-wrap";
  div.style.wordWrap = "break-word";
  div.style.top = "0";
  div.style.left = "-9999px";

  div.textContent = textarea.value.substring(0, position);

  const span = document.createElement("span");
  span.textContent = textarea.value.substring(position) || ".";
  div.appendChild(span);
  document.body.appendChild(div);

  const top = span.offsetTop + span.offsetHeight;
  const left = span.offsetLeft;
  document.body.removeChild(div);

  const rect = textarea.getBoundingClientRect();
  return {
    top: rect.top + top - textarea.scrollTop,
    left: rect.left + left - textarea.scrollLeft,
  };
}

function useDebouncedCallback<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delay: number
): (...args: Args) => void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef(callback);
  callbackRef.current = callback; // always call latest version, avoids stale closures

  return useCallback(
    (...args: Args) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => callbackRef.current(...args), delay);
    },
    [delay]
  );
}

/**
 * Reusable mention-detection hook for a plain <textarea>.
 */
export function useMentionInput({
  fetchSuggestions,
  trigger = "@",
  debounceMs = 250,
}: UseMentionInputOptions): UseMentionInputResult {
  const [text, setText] = useState<string>("");
  const [suggestions, setSuggestions] = useState<MentionUser[]>([]);
  const [activeMention, setActiveMention] = useState<ActiveMention | null>(null);
  const [highlightIndex, setHighlightIndex] = useState<number>(0);
  const [dropdownPos, setDropdownPos] = useState<DropdownPosition | null>(null);
  const [mentions, setMentions] = useState<MentionUser[]>([]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const runQuery = useDebouncedCallback(async (query: string) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    try {
      const results = await fetchSuggestions(query);
      setSuggestions(results || []);
      setHighlightIndex(0);
    } catch {
      setSuggestions([]);
    }
  }, debounceMs);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      const cursor = e.target.selectionStart ?? value.length;
      setText(value);

      const mention = findActiveMention(value, cursor, trigger);
      setActiveMention(mention);

      if (mention) {
        runQuery(mention.query);
        setDropdownPos(getCaretCoordinates(e.target, cursor));
      } else {
        setSuggestions([]);
        setDropdownPos(null);
      }
    },
    [trigger, runQuery]
  );

  const insertMention = useCallback(
    (user: MentionUser) => {
      const textarea = textareaRef.current;
      if (!activeMention || !textarea) return;

      const { start } = activeMention;
      const cursor = textarea.selectionStart ?? text.length;
      const before = text.slice(0, start);
      const after = text.slice(cursor);
      const insertedDisplay = `${trigger}${user.name}`;
      const newValue = `${before}${insertedDisplay} ${after}`;

      setText(newValue);
      setMentions((prev) => [...prev, { id: user.id, name: user.name }]);
      setSuggestions([]);
      setActiveMention(null);
      setDropdownPos(null);

      requestAnimationFrame(() => {
        const pos = before.length + insertedDisplay.length + 1;
        textarea.focus();
        textarea.setSelectionRange(pos, pos);
      });
    },
    [activeMention, text, trigger]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (!suggestions.length) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightIndex((i) => (i + 1) % suggestions.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightIndex((i) => (i - 1 + suggestions.length) % suggestions.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        insertMention(suggestions[highlightIndex]);
      } else if (e.key === "Escape") {
        setSuggestions([]);
        setActiveMention(null);
        setDropdownPos(null);
      }
    },
    [suggestions, highlightIndex, insertMention]
  );

  // Reconstructs a markup body like "@[Name](id)". Change to match your API.
  const buildSubmitBody = useCallback((): string => {
    const pool = [...mentions];
    const escapedTrigger = trigger.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`${escapedTrigger}([^\\s${escapedTrigger}]+(?:\\s[^\\s${escapedTrigger}]+)*)`, "g");
    return text.replace(re, (full: string, name: string) => {
      const idx = pool.findIndex((m) => m.name === name);
      if (idx === -1) return full;
      const [m] = pool.splice(idx, 1);
      return `${trigger}[${m.name}](${m.id})`;
    });
  }, [text, mentions, trigger]);

  const reset = useCallback(() => {
    setText("");
    setMentions([]);
    setSuggestions([]);
    setActiveMention(null);
    setDropdownPos(null);
  }, []);

  return {
    text,
    setText,
    suggestions,
    highlightIndex,
    setHighlightIndex,
    dropdownPos,
    textareaRef,
    handleChange,
    handleKeyDown,
    insertMention,
    buildSubmitBody,
    reset,
  };
}