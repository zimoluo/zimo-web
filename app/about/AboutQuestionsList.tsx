import React from "react";
import AboutQuestion from "./AboutQuestion";

type Props = {
  questions: string[];
  descriptions: string[];
};

export default function AboutQuestionList({ questions, descriptions }: Props) {
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
