import React, { useState } from 'react';
import { linuxCliTasks5 } from '../data/linuxCliCourse5';
import TaskContent from '../components/TaskContent';
import TaskList from '../components/TaskList';
import ProgressHeader from '../components/ProgressHeader';
import CongratsScreen from '../components/CongratsScreen';

export default function LinuxCliCourse5() {
  const [currentTask, setCurrentTask] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string[] }>({});
  const [completedTasks, setCompletedTasks] = useState<{ [key: number]: boolean }>({});
  const [showCongrats, setShowCongrats] = useState(false);

  const calculateProgress = () => {
    const completedCount = Object.values(completedTasks).filter(Boolean).length;
    return (completedCount / linuxCliTasks5.length) * 100;
  };

  const handleNextTask = () => {
    if (currentTask < linuxCliTasks5.length - 1) {
      setCurrentTask(currentTask + 1);
    } else {
      setShowCongrats(true);
    }
  };

  const handlePrevTask = () => {
    if (currentTask > 0) {
      setCurrentTask(currentTask - 1);
    }
  };

  const resetCourse = () => {
    setCurrentTask(0);
    setSelectedAnswers({});
    setCompletedTasks({});
    setShowCongrats(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      <ProgressHeader
        title="Ferramentas Práticas"
        subtitle="Aprenda a usar ferramentas essenciais como Netcat e Socat"
        progress={calculateProgress()}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {!showCongrats ? (
          <div className="grid md:grid-cols-[300px,1fr] gap-6">
            <TaskList
              tasks={linuxCliTasks5}
              currentTask={currentTask}
              completedTasks={completedTasks}
              onTaskSelect={setCurrentTask}
            />
            
            <TaskContent
              task={linuxCliTasks5[currentTask]}
              selectedAnswers={selectedAnswers[currentTask] || []}
              completed={completedTasks[currentTask]}
              onAnswerSelect={(questionIndex: number, choiceId: string) => {
                const taskAnswers = selectedAnswers[currentTask] || [];
                const newAnswers = taskAnswers.includes(choiceId)
                  ? taskAnswers.filter(id => id !== choiceId)
                  : [...taskAnswers, choiceId];

                setSelectedAnswers(prev => ({
                  ...prev,
                  [currentTask]: newAnswers
                }));

                // Check if all questions are answered correctly
                const allQuestionsCorrect = linuxCliTasks5[currentTask].questions.every(question => {
                  const correctAnswer = question.choices.find(choice => choice.correct)?.id;
                  return newAnswers.includes(correctAnswer!);
                });

                if (allQuestionsCorrect) {
                  setCompletedTasks(prev => ({
                    ...prev,
                    [currentTask]: true
                  }));
                }
              }}
              onNext={handleNextTask}
              onPrev={handlePrevTask}
              isFirst={currentTask === 0}
              isLast={currentTask === linuxCliTasks5.length - 1}
            />
          </div>
        ) : (
          <CongratsScreen onReset={resetCourse} />
        )}
      </main>
    </div>
  );
}