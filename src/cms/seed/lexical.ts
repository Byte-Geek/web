export type Block = ["h2" | "h3" | "p" | "quote", string] | ["ul" | "ol", string[]];

const BOLD = /(\*\*[^*]+\*\*)/g;
const BOLD_FORMAT = 1;

const textNodes = (value: string) =>
  value
    .split(BOLD)
    .filter(Boolean)
    .map((part) => {
      const isBold = part.startsWith("**");
      return {
        type: "text",
        version: 1,
        text: isBold ? part.slice(2, -2) : part,
        format: isBold ? BOLD_FORMAT : 0,
        detail: 0,
        mode: "normal",
        style: "",
      };
    });

const elementNode = (type: string, children: unknown[], extra: Record<string, unknown> = {}) => ({
  type,
  version: 1,
  direction: "ltr",
  format: "",
  indent: 0,
  children,
  ...extra,
});

function blockToNode([tag, value]: Block) {
  if (typeof value !== "string") {
    const children = value.map((item, index) => elementNode("listitem", textNodes(item), { value: index + 1 }));
    return elementNode("list", children, { listType: tag === "ul" ? "bullet" : "number", start: 1, tag });
  }
  if (tag === "h2" || tag === "h3") return elementNode("heading", textNodes(value), { tag });
  if (tag === "quote") return elementNode("quote", textNodes(value));
  return elementNode("paragraph", textNodes(value), { textFormat: 0, textStyle: "" });
}

export const toRichText = (blocks: Block[]) => ({ root: elementNode("root", blocks.map(blockToNode)) });
