import OpenAI from 'openai';

// For MVP, we'll use a simple client-side implementation
// In production, this should be handled by a backend service
export class OpenAIService {
  private apiKey: string | null = null;

  setApiKey(key: string) {
    this.apiKey = key;
  }

  hasApiKey(): boolean {
    return !!this.apiKey;
  }

  async generateQuiz(interests: string[], marks: Record<string, number>): Promise<any[]> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key is required');
    }

    const openai = new OpenAI({
      apiKey: this.apiKey,
      dangerouslyAllowBrowser: true // Only for MVP demo
    });

    const topSubjects = Object.entries(marks)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([subject]) => subject);

    const prompt = `Generate a 5-question multiple-choice quiz to assess a high school student's aptitude in ${interests.join(', ')}. 
    The student's strongest subjects are: ${topSubjects.join(', ')}.
    
    Include questions that test:
    - Logical reasoning and problem-solving
    - Subject-specific knowledge related to their interests
    - Critical thinking skills
    - Basic concepts that relate to potential careers in their interest areas
    
    Format the response as a JSON array with this structure:
    [
      {
        "question": "Question text here",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correct_answer": "Option A"
      }
    ]
    
    Make sure questions are appropriate for high school level and directly relate to career aptitude assessment.`;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an educational assessment expert. Generate quiz questions that help determine career aptitude for high school students."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      // Extract JSON from response
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('Invalid response format from OpenAI');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Error generating quiz:', error);
      throw error;
    }
  }

  async generateCareerRecommendations(
    interests: string[], 
    marks: Record<string, number>, 
    quizScore: number, 
    totalQuestions: number
  ): Promise<any[]> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key is required');
    }

    const openai = new OpenAI({
      apiKey: this.apiKey,
      dangerouslyAllowBrowser: true
    });

    const averageMarks = Object.values(marks).reduce((a, b) => a + b, 0) / Object.values(marks).length;
    const quizPercentage = (quizScore / totalQuestions) * 100;

    const prompt = `Based on the following student profile, recommend 3-4 specific career paths:

    Interests: ${interests.join(', ')}
    Academic Performance: Average ${averageMarks.toFixed(1)}% across subjects
    Top Subjects: ${Object.entries(marks).sort(([,a], [,b]) => b - a).slice(0, 3).map(([subject, mark]) => `${subject} (${mark}%)`).join(', ')}
    Quiz Performance: ${quizScore}/${totalQuestions} (${quizPercentage.toFixed(1)}%)

    For each career recommendation, provide:
    1. Career title
    2. Brief description (2-3 sentences)
    3. Match percentage (realistic based on their profile)
    4. 4-5 specific learning path steps
    5. 3-4 key skills needed

    Format as JSON array:
    [
      {
        "title": "Career Title",
        "description": "Brief description of the career",
        "match_percentage": 85,
        "learning_path": [
          "Step 1: Specific action",
          "Step 2: Next action",
          "Step 3: Further development",
          "Step 4: Advanced preparation"
        ],
        "skills_needed": ["Skill 1", "Skill 2", "Skill 3", "Skill 4"]
      }
    ]

    Base recommendations on actual performance and interests. Be realistic with match percentages.`;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a career counselor expert. Provide realistic, actionable career recommendations based on student data."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2500
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('Invalid response format from OpenAI');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      throw error;
    }
  }
}

export const openaiService = new OpenAIService();