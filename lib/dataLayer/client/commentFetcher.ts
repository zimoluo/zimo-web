export async function fetchComments(filePath: string): Promise<CommentEntry[]> {
  try {
    const response = await fetch("/api/comments/getComments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filePath }),
    });

    if (!response.ok) {
      const { error } = await response.json();
      console.error(`Fetching comment failed: ${error}`);
      return [];
    }

    const { comments } = await response.json();
    return comments || [];
  } catch (error: any) {
    console.error(`An error occurred: ${error.message}`);
    return [];
  }
}

export async function fetchCommentUser(sub: string) {
  try {
    const response = await fetch("/api/comments/getUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sub }),
    });

    if (!response.ok) {
      const { error } = await response.json();
      console.error(`Fetching comment failed: ${error}`);
      return null;
    }

    const { userInfo } = await response.json();
    return userInfo as UserInfo;
  } catch (error: any) {
    console.error(`An error occurred: ${error.message}`);
    return null;
  }
}
