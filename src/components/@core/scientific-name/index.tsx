import { getInjectableScientificName } from "@utils/text";

export default function ScientificName({ value }) {
  return (
    <span
      style={{
        wordBreak: "break-word"
      }}
      dangerouslySetInnerHTML={getInjectableScientificName(value)}
    />
  );
}
