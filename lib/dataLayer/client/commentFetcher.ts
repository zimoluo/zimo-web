export async function fetchComments(filePath: string): Promise<CommentEntry[]> {
  try {
    const response = await fetch(
      `/api/comments/getComments?filePath=${encodeURIComponent(filePath)}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const { error } = await response.json();
      console.error(`Fetching comments failed: ${error}`);
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
    const response = await fetch(
      `/api/comments/getUser?sub=${encodeURIComponent(sub)}`
    );

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
      method: "DELETE",
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
      method: "PUT",
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

export async function fetchDeleteReply(
  filePath: string,
  commentIndex: number,
  replyIndex: number,
  existingReply: ReplyProps
) {
  try {
    const response = await fetch("/api/comments/deleteReply", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filePath,
        commentIndex,
        replyIndex,
        existingReply,
      }),
    });

    if (!response.ok) {
      const { error } = await response.json();
      throw new Error(`Upload failed: ${error}`);
    }

    const { success, updatedComments } = await response.json();
    return updatedComments;
  } catch (error: any) {
    console.error(
      `An error occurred while trying to delete reply: ${error.message}`
    );
    return null;
  }
}

export async function fetchAddReply(
  filePath: string,
  newReply: ReplyProps,
  commentIndex: number
) {
  try {
    const response = await fetch("/api/comments/addReply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filePath, newReply, commentIndex }),
    });

    if (!response.ok) {
      const { error } = await response.json();
      throw new Error(`Upload failed: ${error}`);
    }

    const { success, updatedComments } = await response.json();
    return updatedComments;
  } catch (error: any) {
    console.error(
      `An error occurred while trying to add reply: ${error.message}`
    );
    return null;
  }
}

export async function fetchAddComment(
  filePath: string,
  newComment: CommentEntry
) {
  try {
    const response = await fetch("/api/comments/addComment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filePath, newComment }),
    });

    if (!response.ok) {
      const { error } = await response.json();
      throw new Error(`Upload failed: ${error}`);
    }

    const { success, updatedComments } = await response.json();
    return updatedComments;
  } catch (error: any) {
    console.error(
      `An error occurred while trying to add comment: ${error.message}`
    );
    return null;
  }
}

export async function fetchEntryLike(filePath: string): Promise<string[]> {
  try {
    const response = await fetch(
      `/api/comments/getEntryLike?filePath=${encodeURIComponent(filePath)}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const { error } = await response.json();
      console.error(`Fetch failed: ${error}`);
      return [];
    }

    const { likedBy } = await response.json();
    return likedBy || [];
  } catch (error: any) {
    console.error(`An error occurred: ${error.message}`);
    return [];
  }
}

export async function fetchUpdateEntryLike(filePath: string) {
  try {
    const response = await fetch("/api/comments/updateEntryLike", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filePath }),
    });

    if (!response.ok) {
      const { error } = await response.json();
      throw new Error(`Upload failed: ${error}`);
    }

    const { updatedLikedBy } = await response.json();
    return updatedLikedBy;
  } catch (error: any) {
    console.error(`An error occurred: ${error.message}`);
    return null;
  }
}
