import { pipeline } from '@huggingface/transformers';

// For MVP, we'll use a simple client-side implementation with Hugging Face
// In production, this should be handled by a backend service
export class HuggingFaceService {
  private apiKey: string | null = null;
  private textGenerator: any = null;

  setApiKey(key: string) {
    this.apiKey = key;
  }

  hasApiKey(): boolean {
    return !!this.apiKey;
  }

  private async initializeGenerator() {
    if (!this.textGenerator) {
      this.textGenerator = await pipeline(
        'text-generation',
        'microsoft/DialoGPT-medium',
        { device: 'webgpu' }
      );
    }
    return this.textGenerator;
  }

  async generateQuiz(interests: string[], marks: Record<string, number>): Promise<any[]> {
    if (!this.apiKey) {
      throw new Error('Hugging Face API key is required');
    }

    const topSubjects = Object.entries(marks)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([subject]) => subject);

    // Create predefined quiz questions based on interests and subjects
    const quizQuestions = this.generatePredefinedQuiz(interests, topSubjects);
    return quizQuestions;
  }

  private generatePredefinedQuiz(interests: string[], topSubjects: string[]): any[] {
    const questions = [];
    
    // Science/Technology questions
    if (interests.some(i => ['science', 'technology', 'engineering', 'computer science'].includes(i.toLowerCase()))) {
      questions.push({
        question: "Which of the following best describes the scientific method?",
        options: [
          "A systematic approach to understanding the natural world through observation and experimentation",
          "A way to prove theories without testing",
          "A method only used in physics",
          "A philosophical approach to understanding reality"
        ],
        correct_answer: "A systematic approach to understanding the natural world through observation and experimentation"
      });
    }

    // Mathematics/Logic questions
    if (interests.some(i => ['mathematics', 'engineering', 'computer science', 'finance'].includes(i.toLowerCase())) || 
        topSubjects.some(s => ['mathematics', 'math', 'physics'].includes(s.toLowerCase()))) {
      questions.push({
        question: "If a pattern follows the sequence 2, 6, 18, 54, what is the next number?",
        options: ["108", "162", "216", "324"],
        correct_answer: "162"
      });
    }

    // Communication/Language questions
    if (interests.some(i => ['writing', 'journalism', 'teaching', 'marketing', 'law'].includes(i.toLowerCase())) ||
        topSubjects.some(s => ['english', 'literature', 'language arts'].includes(s.toLowerCase()))) {
      questions.push({
        question: "What is the most important factor in effective communication?",
        options: [
          "Using complex vocabulary",
          "Understanding your audience",
          "Speaking loudly",
          "Using formal language only"
        ],
        correct_answer: "Understanding your audience"
      });
    }

    // Problem-solving questions
    questions.push({
      question: "When faced with a complex problem, what is the best first step?",
      options: [
        "Immediately start working on a solution",
        "Break the problem down into smaller, manageable parts",
        "Ask someone else to solve it",
        "Avoid the problem until it becomes urgent"
      ],
      correct_answer: "Break the problem down into smaller, manageable parts"
    });

    // Critical thinking question
    questions.push({
      question: "What is the best way to evaluate the reliability of information?",
      options: [
        "Check if it matches your existing beliefs",
        "Consider the source, evidence, and potential bias",
        "See if it's popular on social media",
        "Trust information from any published source"
      ],
      correct_answer: "Consider the source, evidence, and potential bias"
    });

    // Ensure we have exactly 5 questions
    return questions.slice(0, 5);
  }

  async generateCareerRecommendations(
    interests: string[], 
    marks: Record<string, number>, 
    quizScore: number, 
    totalQuestions: number
  ): Promise<any[]> {
    if (!this.apiKey) {
      throw new Error('Hugging Face API key is required');
    }

    const averageMarks = Object.values(marks).reduce((a, b) => a + b, 0) / Object.values(marks).length;
    const quizPercentage = (quizScore / totalQuestions) * 100;

    return this.generateCareerRecommendationsBasedOnProfile(interests, marks, quizScore, totalQuestions);
  }

  private generateCareerRecommendationsBasedOnProfile(
    interests: string[], 
    marks: Record<string, number>, 
    quizScore: number, 
    totalQuestions: number
  ): any[] {
    const averageMarks = Object.values(marks).reduce((a, b) => a + b, 0) / Object.values(marks).length;
    const quizPercentage = (quizScore / totalQuestions) * 100;
    const topSubjects = Object.entries(marks).sort(([,a], [,b]) => b - a).slice(0, 3);

    const recommendations = [];

    // Technology/Engineering careers
    if (interests.some(i => ['technology', 'engineering', 'computer science'].includes(i.toLowerCase()))) {
      const matchPercentage = Math.min(95, 60 + (quizPercentage * 0.3) + (averageMarks * 0.1));
      recommendations.push({
        title: "Software Engineer",
        description: "Design and develop software applications, systems, and platforms. Work with programming languages, frameworks, and development tools to create innovative solutions.",
        match_percentage: Math.round(matchPercentage),
        learning_path: [
          "Learn programming fundamentals (Python, JavaScript, or Java)",
          "Build projects and create a portfolio on GitHub",
          "Study computer science concepts (algorithms, data structures)",
          "Complete coding bootcamp or relevant degree",
          "Gain experience through internships or open-source contributions"
        ],
        skills_needed: ["Programming", "Problem-solving", "Logical thinking", "Attention to detail"]
      });
    }

    // Science/Research careers
    if (interests.some(i => ['science', 'research', 'medicine', 'biology'].includes(i.toLowerCase())) ||
        topSubjects.some(([subject]) => ['biology', 'chemistry', 'physics'].includes(subject.toLowerCase()))) {
      const matchPercentage = Math.min(95, 55 + (quizPercentage * 0.4) + (averageMarks * 0.2));
      recommendations.push({
        title: "Research Scientist",
        description: "Conduct scientific research to advance knowledge in specific fields. Design experiments, analyze data, and publish findings to contribute to scientific understanding.",
        match_percentage: Math.round(matchPercentage),
        learning_path: [
          "Excel in science and mathematics courses",
          "Participate in science fairs and research projects",
          "Pursue undergraduate degree in relevant field",
          "Gain research experience through lab work",
          "Consider graduate school for advanced research"
        ],
        skills_needed: ["Analytical thinking", "Research methodology", "Data analysis", "Scientific writing"]
      });
    }

    // Business/Finance careers
    if (interests.some(i => ['business', 'finance', 'economics', 'entrepreneurship'].includes(i.toLowerCase())) ||
        topSubjects.some(([subject]) => ['mathematics', 'economics'].includes(subject.toLowerCase()))) {
      const matchPercentage = Math.min(95, 50 + (quizPercentage * 0.3) + (averageMarks * 0.25));
      recommendations.push({
        title: "Business Analyst",
        description: "Analyze business processes and data to help organizations make informed decisions. Work with stakeholders to identify opportunities for improvement and growth.",
        match_percentage: Math.round(matchPercentage),
        learning_path: [
          "Develop strong analytical and mathematical skills",
          "Learn business fundamentals and economics",
          "Master data analysis tools (Excel, SQL)",
          "Pursue business degree or relevant certification",
          "Gain experience through internships in business settings"
        ],
        skills_needed: ["Data analysis", "Communication", "Critical thinking", "Business acumen"]
      });
    }

    // Creative/Communication careers
    if (interests.some(i => ['art', 'design', 'writing', 'media'].includes(i.toLowerCase())) ||
        topSubjects.some(([subject]) => ['english', 'art', 'literature'].includes(subject.toLowerCase()))) {
      const matchPercentage = Math.min(95, 55 + (quizPercentage * 0.2) + (averageMarks * 0.15));
      recommendations.push({
        title: "Digital Marketing Specialist",
        description: "Create and implement marketing strategies across digital platforms. Combine creativity with data analysis to engage audiences and drive business growth.",
        match_percentage: Math.round(matchPercentage),
        learning_path: [
          "Develop creative and communication skills",
          "Learn digital marketing tools and platforms",
          "Study marketing principles and consumer behavior",
          "Build portfolio with personal or volunteer projects",
          "Pursue marketing degree or relevant certifications"
        ],
        skills_needed: ["Creativity", "Communication", "Digital literacy", "Analytical thinking"]
      });
    }

    // Default recommendation if no specific matches
    if (recommendations.length === 0) {
      recommendations.push({
        title: "Project Manager",
        description: "Coordinate teams and resources to deliver projects on time and within budget. Work across various industries to ensure successful project completion.",
        match_percentage: Math.round(50 + (quizPercentage * 0.3) + (averageMarks * 0.2)),
        learning_path: [
          "Develop strong organizational and leadership skills",
          "Learn project management methodologies",
          "Gain experience in team coordination",
          "Pursue project management certification",
          "Build experience across different industries"
        ],
        skills_needed: ["Leadership", "Organization", "Communication", "Problem-solving"]
      });
    }

    return recommendations.slice(0, 4);
  }
}

export const huggingFaceService = new HuggingFaceService();