import { fetchEntryBySlug } from "@/lib/dataLayer/server/awsEntryFetcher";
import AboutQuestion from "./AboutQuestion";

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

  return (
    <>
      {questions.map((question, index) => (
        <AboutQuestion
          key={index}
          question={question}
          description={processedDescriptions[index]}
          index={index}
        />
      ))}
    </>
  );
}
