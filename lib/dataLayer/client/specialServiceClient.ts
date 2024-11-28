export async function fetchAddTreeContent(treeContent: TreeContent) {
  try {
    const response = await fetch("/api/special/christmas/addTreeContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ treeContentData: treeContent }),
    });

    if (!response.ok) {
      const { error } = await response.json();
      throw new Error(`Upload failed: ${error}`);
    }

    const { success, updatedTreeContent } = await response.json();
    return updatedTreeContent;
  } catch (error: any) {
    console.error(
      `An error occurred while trying to add Christmas tree content: ${error.message}`
    );
    return null;
  }
}

export async function fetchGetTreeContent(): Promise<TreeContent[]> {
  try {
    const response = await fetch("/api/special/christmas/getTreeContent", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const { error } = await response.json();
      console.error(`Fetching Christmas tree content failed: ${error}`);
      return [];
    }

    const { treeContent } = await response.json();
    return treeContent || [];
  } catch (error: any) {
    console.error(`An error occurred: ${error.message}`);
    return [];
  }
}
