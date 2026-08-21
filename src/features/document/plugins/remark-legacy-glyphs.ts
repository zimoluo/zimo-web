import type { Code, Effects, Extension, State, TokenizeContext } from "micromark-util-types";

declare module "micromark-util-types" {
  interface TokenTypeMap {
    glyph: "glyph";
    glyphMarker: "glyphMarker";
    glyphName: "glyphName";
  }
}

const AT = 64;
const MAX_NAME = 48;

const isLineEnding = (code: Code): boolean =>
  code === null || code === -5 || code === -4 || code === -3;

function tokenizeGlyph(
  this: TokenizeContext,
  effects: Effects,
  ok: State,
  nok: State,
): State {
  let length = 0;

  const closing = (code: Code): State | undefined => {
    if (code !== AT) return nok(code);
    effects.consume(code);
    effects.exit("glyphMarker");
    effects.exit("glyph");
    return ok;
  };

  const nameMore = (code: Code): State | undefined => {
    if (code === AT) {
      if (length === 0) return nok(code);
      effects.exit("glyphName");
      effects.enter("glyphMarker");
      effects.consume(code);
      return closing;
    }
    if (isLineEnding(code) || length >= MAX_NAME) return nok(code);
    effects.consume(code);
    length += 1;
    return nameMore;
  };

  const nameStart = (code: Code): State | undefined => {
    if (isLineEnding(code) || code === AT) return nok(code);
    effects.enter("glyphName");
    effects.consume(code);
    length = 1;
    return nameMore;
  };

  const afterFirst = (code: Code): State | undefined => {
    if (code !== AT) return nok(code);
    effects.consume(code);
    effects.exit("glyphMarker");
    return nameStart;
  };

  const start = (code: Code): State | undefined => {
    effects.enter("glyph");
    effects.enter("glyphMarker");
    effects.consume(code);
    return afterFirst;
  };

  return start as State;
}

export const glyphSyntax: Extension = {
  text: {
    [AT]: { name: "glyph", tokenize: tokenizeGlyph as never },
  },
};

type Token = { readonly type: string };

type FromMarkdownContext = {
  enter: (node: unknown, token: Token) => void;
  exit: (token: Token) => void;
  sliceSerialize: (token: Token) => string;
  stack: unknown[];
};

export const glyphFromMarkdown = {
  enter: {
    glyph(this: FromMarkdownContext, token: Token) {
      this.enter(
        {
          type: "textDirective",
          name: "glyph",
          attributes: {},
          children: [],
          data: { legacyGlyph: true },
        },
        token,
      );
    },
  },
  exit: {
    glyphName(this: FromMarkdownContext, token: Token) {
      const node = this.stack[this.stack.length - 1] as {
        children: { type: string; value: string }[];
      };
      node.children.push({ type: "text", value: this.sliceSerialize(token) });
    },
    glyph(this: FromMarkdownContext, token: Token) {
      this.exit(token);
    },
  },
};

export function remarkLegacyGlyphs(this: {
  data: (key: string) => unknown[];
}): undefined {
  const micromarkExtensions = this.data("micromarkExtensions");
  const fromMarkdownExtensions = this.data("fromMarkdownExtensions");

  micromarkExtensions.push(glyphSyntax);
  fromMarkdownExtensions.push(glyphFromMarkdown);

  return undefined;
}
