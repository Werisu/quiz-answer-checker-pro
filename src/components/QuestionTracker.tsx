
import React from 'react';
import { QuestionCard } from './QuestionCard';
import { Question } from '@/hooks/useQuiz';

interface QuestionTrackerProps {
  questions: Array<{
    id: number;
    status: 'correct' | 'incorrect' | 'unanswered';
  }>;
  onUpdateStatus: (questionId: number, status: 'correct' | 'incorrect' | 'unanswered') => void;
}

export const QuestionTracker: React.FC<QuestionTrackerProps> = ({
  questions,
  onUpdateStatus
}) => {
  return (
    <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3">
      {questions.map((question) => (
        <QuestionCard
          key={question.id}
          question={{
            id: question.id.toString(),
            quiz_id: '',
            question_number: question.id,
            text: null,
            correct_answer: null,
            status: question.status
          }}
          onUpdateStatus={onUpdateStatus}
        />
      ))}
    </div>
  );
};
