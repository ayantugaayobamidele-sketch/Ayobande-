// Quiz question retrieval
app.get('/api/quiz/questions', async (req, res) => {
    const { category, limit = 10 } = req.query;
    
    const questions = await QuizQuestion.aggregate([
        { $match: { category } },
        { $sample: { size: parseInt(limit) } },
        { $project: { 
            question_text: 1, 
            options: 1, 
            points: 1,
            _id: 1 
        }}
    ]);
    
    res.json(questions);
});

// Quiz submission and scoring
app.post('/api/quiz/submit', async (req, res) => {
    const { answers, quizId } = req.body;
    const studentId = req.session.userId;
    
    let totalScore = 0;
    const results = [];
    
    for (const answer of answers) {
        const question = await QuizQuestion.findById(answer.questionId);
        const isCorrect = question.correct_answer === answer.selectedOption;
        
        if (isCorrect) {
            totalScore += question.points;
        }
        
        results.push({
            questionId: answer.questionId,
            isCorrect,
            correctAnswer: question.correct_answer
        });
    }
    
    // Save quiz attempt
    const quizAttempt = new QuizAttempt({
        student_id: studentId,
        quiz_id: quizId,
        score: totalScore,
        answers: results,
        completed_at: new Date()
    });
    
    await quizAttempt.save();
    
    // Check for badges
    await checkQuizBadges(studentId, totalScore);
    
    res.json({ score: totalScore, results });
});