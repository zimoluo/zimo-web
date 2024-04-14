import { fetchEntryBySlug } from "@/lib/dataLayer/server/awsEntryFetcher";
import { enrichTextContent } from "@/lib/lightMarkUpProcessor";
import ExpandCollapseDisplay from "@/components/widgets/ExpandCollapseDisplay";

async function getQuestionsData() {
  return await fetchEntryBySlug("questions", "about/aboutpage", "json", [
    "question",
    "description",
  ]);
}

export default async function AboutQuestionList() {
  const { question: questions, description: descriptions } =
    (await getQuestionsData()) as { question: string[]; description: string[] };

  const processedDescriptions = [...descriptions];
  while (processedDescriptions.length < questions.length) {
    processedDescriptions.push("");
  }
  processedDescriptions.length = questions.length;

  const questionList = questions.map((question, index) => ({
    title: question,
    content: (
      <p className="text-saturated text-opacity-90">
        {enrichTextContent(processedDescriptions[index] || "")}
      </p>
    ),
  }));

  return <ExpandCollapseDisplay entries={questionList} />;
}
