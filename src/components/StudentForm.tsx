import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, User, Calendar, BookOpen } from 'lucide-react';

interface StudentData {
  name: string;
  age: string;
  grade: string;
  interests: string[];
  marks: Record<string, number>;
}

interface StudentFormProps {
  onSubmit: (data: StudentData) => void;
}

const INTEREST_OPTIONS = [
  'Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology',
  'English Literature', 'History', 'Geography', 'Economics', 'Psychology',
  'Art & Design', 'Music', 'Sports', 'Business', 'Engineering'
];

const SUBJECTS = [
  'Mathematics', 'English', 'Physics', 'Chemistry', 'Biology',
  'History', 'Geography', 'Computer Science', 'Economics'
];

export default function StudentForm({ onSubmit }: StudentFormProps) {
  const [formData, setFormData] = useState<StudentData>({
    name: '',
    age: '',
    grade: '',
    interests: [],
    marks: {}
  });

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const updateMarks = (subject: string, marks: number) => {
    setFormData(prev => ({
      ...prev,
      marks: { ...prev.marks, [subject]: marks }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isFormValid = formData.name && formData.age && formData.grade && 
    formData.interests.length > 0 && Object.keys(formData.marks).length > 0;

  return (
    <div className="min-h-screen bg-gradient-subtle p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-4">
            <GraduationCap className="w-8 h-8 text-educational-primary" />
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Career Discovery
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Let's discover your perfect career path through personalized assessment
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <Card className="shadow-card animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-educational-primary" />
                Personal Information
              </CardTitle>
              <CardDescription>Tell us about yourself</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Your age"
                    value={formData.age}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="grade">Grade/Class</Label>
                  <Input
                    id="grade"
                    placeholder="e.g., 11th, 12th"
                    value={formData.grade}
                    onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interests */}
          <Card className="shadow-card animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-educational-secondary" />
                Areas of Interest
              </CardTitle>
              <CardDescription>Select subjects or fields that interest you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                {INTEREST_OPTIONS.map((interest) => (
                  <Badge
                    key={interest}
                    variant={formData.interests.includes(interest) ? "default" : "outline"}
                    className={`cursor-pointer text-center justify-center py-2 transition-all ${
                      formData.interests.includes(interest)
                        ? 'bg-educational-primary hover:bg-educational-primary/90'
                        : 'hover:bg-educational-primary/10'
                    }`}
                    onClick={() => toggleInterest(interest)}
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Academic Scores */}
          <Card className="shadow-card animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-educational-success" />
                Academic Performance
              </CardTitle>
              <CardDescription>Enter your recent marks/grades (out of 100)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {SUBJECTS.map((subject) => (
                  <div key={subject}>
                    <Label htmlFor={subject}>{subject}</Label>
                    <Input
                      id={subject}
                      type="number"
                      min="0"
                      max="100"
                      placeholder="Enter marks"
                      value={formData.marks[subject] || ''}
                      onChange={(e) => updateMarks(subject, parseInt(e.target.value) || 0)}
                      className="mt-1"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button
              type="submit"
              variant="gradient"
              size="xl"
              disabled={!isFormValid}
              className="min-w-[200px]"
            >
              Start Assessment
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}