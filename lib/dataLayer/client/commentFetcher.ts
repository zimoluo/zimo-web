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

export async function fetchDeleteComment(
  filePath: string,
  index: number,
  existingComment: CommentEntry
) {
  try {
    const response = await fetch("/api/comments/deleteSingleComment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filePath, index, existingComment }),
    });

    if (!response.ok) {
      const { error } = await response.json();
      throw new Error(`Upload failed: ${error}`);
    }

    const { success, updatedComments } = await response.json();
    return updatedComments;
  } catch (error: any) {
    console.error(
      `An error occurred while trying to delete comment: ${error.message}`
    );
    return null;
  }
}

export async function fetchLikeComment(
  filePath: string,
  index: number,
  comment: CommentEntry
) {
  try {
    const response = await fetch("/api/comments/likeSingleComment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filePath, index, existingComment: comment }),
    });

    if (!response.ok) {
      const { error } = await response.json();
      throw new Error(`Upload failed: ${error}`);
    }

    const { success, updatedComments } = await response.json();
    return updatedComments;
  } catch (error: any) {
    console.error(
      `An error occurred while trying to like comment: ${error.message}`
    );
    return null;
  }
}

export async function fetchBanOrUnbanUser(sub: string) {
  try {
    const response = await fetch("/api/comments/banOrUnbanUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sub }),
    });

    if (!response.ok) {
      const { error } = await response.json();
      throw new Error(`Upload failed: ${error}`);
    }

    const { success } = await response.json();

    return success;
  } catch (error: any) {
    console.error(`An error occurred: ${error.message}`);
    return null;
  }
}
