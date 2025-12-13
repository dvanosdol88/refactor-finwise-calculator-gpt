import { z } from "zod";

// User schema (placeholder for future authentication)
export interface User {
  id: string;
  username: string;
}

export type InsertUser = Omit<User, 'id'>;

// Chart data interface for savings visualization
export interface ChartDataPoint {
  year: number;
  savings: number;
  flatFeePortfolio: number;
  percentFeePortfolio: number;
}

// Survey data for the interactive poll
export const surveyOptions = [
  { id: 'invest', label: 'Invest it!', boldPart: '!' as const, fullBold: false },
  { id: 'charity', label: 'Donate to my favorite charity', boldPart: undefined, fullBold: false },
  { id: 'advisor', label: 'Give it to my Financial Advisor!', boldPart: undefined, fullBold: true },
  { id: 'home', label: 'Pay off my Mortgage', boldPart: undefined, fullBold: false },
  { id: 'retire', label: 'Retire earlier', boldPart: undefined, fullBold: false },
  { id: 'other', label: 'Other', boldPart: undefined, fullBold: false },
] as const;

export type SurveyOptionId = typeof surveyOptions[number]['id'];

export interface SurveyResults {
  [key: string]: number;
}

export interface SurveyResponse {
  id: string;
  results: SurveyResults;
  selectedOption: string | null;
  timestamp: number;
}

export type InsertSurveyResponse = Omit<SurveyResponse, 'id' | 'timestamp'>;
