// Analytics data retrieval
app.get('/api/admin/analytics', async (req, res) => {
    if (req.session.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }
    
    const studentActivity = await StudentProgress.aggregate([
        {
            $group: {
                _id: '$student_id',
                totalActivities: { $sum: 1 },
                lastActivity: { $max: '$completed_at' },
                totalScore: { $sum: '$score' }
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: 'id',
                as: 'student'
            }
        }
    ]);
    
    const quizStats = await QuizAttempt.aggregate([
        {
            $group: {
                _id: '$quiz_id',
                averageScore: { $avg: '$score' },
                totalAttempts: { $sum: 1 }
            }
        }
    ]);
    
    res.json({ studentActivity, quizStats });
});