export const allowedCommentPath: RegExp =
  /^(blog|photos|projects)\/comments\/[^\/\\:*?"<>|A-Z]+\.json$|^about\/homepage\/messages\.json$/;
export const allowedEntryLikePath: RegExp =
  /^(blog|photos|projects)\/likedBy\/[^\/\\:*?"<>|A-Z]+\.json$/;

export const maxCommentCharacterCount: number = 3000;
