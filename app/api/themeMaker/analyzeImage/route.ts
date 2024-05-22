import { analyzeImageColor } from "@/lib/themeMaker/imageColorAnalysisTool";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (file === null) {
      throw new Error("No image file uploaded");
    }

    const maxSize = 4 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error("File size exceeds the 4 MB limit");
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const colorArray = await analyzeImageColor(fileBuffer);

    return new Response(
      JSON.stringify({ success: colorArray !== null, colorArray: colorArray }),
      {
        status: 200,
      }
    );
  } catch (e) {
    console.log("Error in uploading theme image:", e);
    return new Response(JSON.stringify({ success: false }), {
      status: 500,
    });
  }
}
