import {
  getTreeContentFromServer,
  uploadTreeContentToServer,
} from "@/lib/dataLayer/server/specialServiceManager";
import { isTreeContentPositionValid } from "@/lib/special/christmasTreeHelper";

export async function POST(request: Request) {
  try {
    const { treeContentData } = await request.json();

    if (treeContentData.from.length > 100) throw new Error("Name is too long!");
    if (treeContentData.message.length > 800)
      throw new Error("Message is too long!");

    const downloadedTreeContent = await getTreeContentFromServer();

    if (
      !isTreeContentPositionValid(
        treeContentData.position,
        downloadedTreeContent
      )
    )
      throw new Error("Invalid position!");

    treeContentData.date = new Date().toISOString();

    const updatedTreeContent = [
      ...downloadedTreeContent,
      treeContentData as TreeContent,
    ];

    await uploadTreeContentToServer(updatedTreeContent);

    return new Response(JSON.stringify({ success: true, updatedTreeContent }), {
      status: 200,
    });
  } catch (error: any) {
    console.error("Error in liking comment:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
