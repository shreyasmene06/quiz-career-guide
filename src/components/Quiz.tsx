import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Brain, Clock, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Question {
  question: string;
  options: string[];
  correct_answer: string;
}

interface QuizProps {
  questions: Question[];
  onComplete: (score: number, answers: string[]) => void;
}

export default function Quiz({ questions, onComplete }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleQuizComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleQuizComplete = () => {
    if (isCompleted) return;
    setIsCompleted(true);
    
    const finalAnswers = [...answers];
    if (selectedAnswer && finalAnswers.length === currentQuestion) {
      finalAnswers.push(selectedAnswer);
    }
    
    const score = finalAnswers.reduce((acc, answer, index) => {
      return questions[index]?.correct_answer === answer ? acc + 1 : acc;
    }, 0);
    
    onComplete(score, finalAnswers);
  };

  const handleNextQuestion = () => {
    if (!selectedAnswer) {
      toast({
        title: "Please select an answer",
        description: "Choose one option before proceeding.",
        variant: "destructive"
      });
      return;
    }

    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);
    setSelectedAnswer('');

    if (currentQuestion + 1 >= questions.length) {
      handleQuizComplete();
    } else {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Brain className="w-12 h-12 text-educational-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Generating Questions...</h3>
            <p className="text-muted-foreground">Please wait while we create your personalized quiz.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Brain className="w-8 h-8 text-educational-primary" />
            <h1 className="text-3xl font-bold">Aptitude Assessment</h1>
          </div>
          
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className={timeLeft < 60 ? 'text-educational-warning font-semibold' : ''}>
                {formatTime(timeLeft)}
              </span>
            </div>
            <div>
              Question {currentQuestion + 1} of {questions.length}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="shadow-card animate-fade-in">
          <CardHeader>
            <CardTitle className="text-xl">
              {questions[currentQuestion]?.question}
            </CardTitle>
            <CardDescription>
              Choose the best answer from the options below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={selectedAnswer}
              onValueChange={setSelectedAnswer}
              className="space-y-3"
            >
              {questions[currentQuestion]?.options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label
                    htmlFor={`option-${index}`}
                    className="flex-1 cursor-pointer text-sm"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="mt-8 flex justify-between items-center">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4" />
                <span>{answers.length} completed</span>
              </div>
              
              <Button
                onClick={handleNextQuestion}
                variant="educational"
                size="lg"
                disabled={!selectedAnswer}
              >
                {currentQuestion + 1 >= questions.length ? 'Complete Assessment' : 'Next Question'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}