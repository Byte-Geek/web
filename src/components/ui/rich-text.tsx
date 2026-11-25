import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import { type JSXConvertersFunction, RichText as PayloadRichText } from "@payloadcms/richtext-lexical/react";
import { slugify } from "@/cms/fields";

type TextNode = { text?: string };
type HeadingNode = { type: string; tag?: string; children?: TextNode[] };

const plainText = (children: TextNode[] = []) => children.map((child) => child.text ?? "").join("");
const anchorFor = (text: string) => `s-${slugify(text)}`;

export function tableOfContents(content: SerializedEditorState) {
  const nodes = content.root.children as unknown as HeadingNode[];
  return nodes
    .filter((node) => node.type === "heading" && node.tag === "h2")
    .map((node) => {
      const text = plainText(node.children);
      return { id: anchorFor(text), text };
    });
}

const anchoredHeadings: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  heading: ({ node, nodesToJSX }) => {
    const Tag = node.tag;
    const id = Tag === "h2" ? anchorFor(plainText(node.children as TextNode[])) : undefined;
    return <Tag id={id}>{nodesToJSX({ nodes: node.children })}</Tag>;
  },
});

export function RichText({ content, withAnchors = false }: { content: SerializedEditorState; withAnchors?: boolean }) {
  return <PayloadRichText data={content} converters={withAnchors ? anchoredHeadings : undefined} disableContainer />;
}
