abstract class  OnAnswerProcessedListener {

        void onAnswerProcessed(int questionId, int position, 
        //QuestionAttemptModel questionAttemptModel
        );

        void showSolutionOfQuestion(int questionId);

        void notifyAnswerStatusChanged(bool status);

        void notifyOptionSelected(String questionId, String answerId);

        void notifySubjectiveSolutionView(bool isExpanded);

        bool isSolutionVideoLocked(int resourceId);
    }