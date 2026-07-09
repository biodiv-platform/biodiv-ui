// MentionTextarea.jsx
import { Box, Textarea } from "@chakra-ui/react";

/**
 * Reusable mention-aware textarea. Pass in the mention hook's returned state/handlers.
 */
export default function MentionTextarea({
  mention, // the object returned by useMentionInput()
  renderSuggestion, // (user, isHighlighted) => ReactNode
  textareaProps = {} // extra props forwarded to Textarea (id, height, placeholder, etc.)
}) {
  const {
    text,
    handleChange,
    handleKeyDown,
    suggestions,
    highlightIndex,
    setHighlightIndex,
    dropdownPos,
    insertMention,
    textareaRef
  } = mention;

  return (
    <Box position="relative">
      <Textarea
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        ref={textareaRef}
        {...textareaProps}
      />
      {suggestions.length > 0 && dropdownPos && (
        <Box
          position="fixed"
          top={`${dropdownPos.top}px`}
          left={`${dropdownPos.left}px`}
          bg="white"
          boxShadow="md"
          borderRadius="md"
          zIndex={1000}
          maxH="200px"
          overflowY="auto"
          minW="200px"
        >
          {suggestions.map((user, i) => (
            <Box
              key={user.id}
              px={3}
              py={2}
              cursor="pointer"
              bg={i === highlightIndex ? "gray.100" : "white"}
              onMouseEnter={() => setHighlightIndex(i)}
              onMouseDown={(e) => {
                e.preventDefault(); // keep textarea focus
                insertMention(user);
              }}
            >
              {renderSuggestion
                ? renderSuggestion(user, i === highlightIndex)
                : `${user.name} (${user.id})`}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
