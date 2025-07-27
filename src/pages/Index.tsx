import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { huggingFaceService } from '@/lib/openai';
import ApiKeyInput from '@/components/ApiKeyInput';
import StudentForm from '@/components/StudentForm';
import Quiz from '@/components/Quiz';
import Results from '@/components/Results';

interface StudentData {
  name: string;
  age: string;
  grade: string;
  interests: string[];
  marks: Record<string, number>;
}

interface Question {
  question: string;
  options: string[];
  correct_answer: string;
}

interface Career {
  title: string;
  description: string;
  match_percentage: number;
  learning_path: string[];
  skills_needed: string[];
}

type AppStep = 'api-key' | 'form' | 'quiz' | 'results';

export default function Index() {
  const [currentStep, setCurrentStep] = useState<AppStep>('api-key');
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizScore, setQuizScore] = useState(0);
  const [recommendations, setRecommendations] = useState<Career[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleApiKeySet = (apiKey: string) => {
    huggingFaceService.setApiKey(apiKey);
    setCurrentStep('form');
    toast({
      title: "Hugging Face Token Set",
      description: "You can now proceed with the career assessment.",
    });
  };

  const handleStudentFormSubmit = async (data: StudentData) => {
    setStudentData(data);
    setIsLoading(true);

    try {
      toast({
        title: "Generating Quiz",
        description: "Creating personalized questions based on your interests...",
      });

      const quiz = await huggingFaceService.generateQuiz(data.interests, data.marks);
      setQuestions(quiz);
      setCurrentStep('quiz');
    } catch (error: any) {
      toast({
        title: "Error Generating Quiz",
        description: error.message || "Failed to generate quiz. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuizComplete = async (score: number, answers: string[]) => {
    setQuizScore(score);
    setIsLoading(true);

    try {
      toast({
        title: "Analyzing Results",
        description: "Generating your personalized career recommendations...",
      });

      if (studentData) {
        const careers = await huggingFaceService.generateCareerRecommendations(
          studentData.interests,
          studentData.marks,
          score,
          questions.length
        );
        setRecommendations(careers);
        setCurrentStep('results');
      }
    } catch (error: any) {
      toast({
        title: "Error Generating Recommendations",
        description: error.message || "Failed to generate recommendations. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestart = () => {
    setCurrentStep('form');
    setStudentData(null);
    setQuestions([]);
    setQuizScore(0);
    setRecommendations([]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-educational-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Processing...</h2>
          <p className="text-muted-foreground">
            {currentStep === 'quiz' ? 'Generating your quiz questions' : 'Analyzing your responses'}
          </p>
        </div>
      </div>
    );
  }

  switch (currentStep) {
    case 'api-key':
      return <ApiKeyInput onApiKeySet={handleApiKeySet} />;
    
    case 'form':
      return <StudentForm onSubmit={handleStudentFormSubmit} />;
    
    case 'quiz':
      return <Quiz questions={questions} onComplete={handleQuizComplete} />;
    
    case 'results':
      return (
        <Results
          studentName={studentData?.name || 'Student'}
          quizScore={quizScore}
          totalQuestions={questions.length}
          recommendations={recommendations}
          onRestart={handleRestart}
        />
      );
    
    default:
      return <div>Loading...</div>;
  }
}