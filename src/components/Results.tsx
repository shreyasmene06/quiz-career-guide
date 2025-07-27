import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Target, BookOpen, ExternalLink, RotateCcw } from 'lucide-react';

interface Career {
  title: string;
  description: string;
  match_percentage: number;
  learning_path: string[];
  skills_needed: string[];
}

interface ResultsProps {
  studentName: string;
  quizScore: number;
  totalQuestions: number;
  recommendations: Career[];
  onRestart: () => void;
}

export default function Results({ 
  studentName, 
  quizScore, 
  totalQuestions, 
  recommendations, 
  onRestart 
}: ResultsProps) {
  const scorePercentage = (quizScore / totalQuestions) * 100;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-educational-success';
    if (score >= 60) return 'text-educational-info';
    if (score >= 40) return 'text-educational-warning';
    return 'text-destructive';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <div className="min-h-screen bg-gradient-subtle p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-4">
            <Trophy className="w-8 h-8 text-educational-primary" />
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Assessment Complete!
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Here are your personalized career recommendations, {studentName}
          </p>
        </div>

        {/* Score Summary */}
        <Card className="shadow-card mb-8 animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-educational-success" />
              Your Assessment Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-3xl font-bold">
                  <span className={getScoreColor(scorePercentage)}>
                    {quizScore}/{totalQuestions}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {scorePercentage.toFixed(0)}% - {getScoreLabel(scorePercentage)}
                </div>
              </div>
              <div className="text-right">
                <Badge 
                  variant={scorePercentage >= 70 ? "default" : "secondary"}
                  className="text-lg px-4 py-1"
                >
                  {getScoreLabel(scorePercentage)}
                </Badge>
              </div>
            </div>
            <Progress value={scorePercentage} className="h-3" />
          </CardContent>
        </Card>

        {/* Career Recommendations */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2 animate-fade-in">
            <BookOpen className="w-6 h-6 text-educational-primary" />
            Recommended Career Paths
          </h2>

          {recommendations.length > 0 ? (
            <div className="grid gap-6">
              {recommendations.map((career, index) => (
                <Card key={index} className="shadow-card animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl text-educational-primary">
                          {career.title}
                        </CardTitle>
                        <CardDescription className="mt-2">
                          {career.description}
                        </CardDescription>
                      </div>
                      <Badge 
                        variant="outline" 
                        className="bg-educational-success/10 text-educational-success border-educational-success/20"
                      >
                        {career.match_percentage}% Match
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Skills Needed */}
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Key Skills Required:</h4>
                      <div className="flex flex-wrap gap-2">
                        {career.skills_needed.map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Learning Path */}
                    <div>
                      <h4 className="font-semibold mb-3 text-sm">Recommended Learning Path:</h4>
                      <div className="space-y-2">
                        {career.learning_path.map((step, stepIndex) => (
                          <div key={stepIndex} className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-educational-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs font-semibold text-educational-primary">
                                {stepIndex + 1}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button variant="outline" size="sm" className="w-full">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Explore {career.title} Resources
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="shadow-card">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Generating Recommendations...</h3>
                <p className="text-muted-foreground">
                  We're analyzing your responses to provide personalized career suggestions.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center mt-8">
          <Button onClick={onRestart} variant="outline" size="lg">
            <RotateCcw className="w-4 h-4 mr-2" />
            Take Assessment Again
          </Button>
        </div>
      </div>
    </div>
  );
}