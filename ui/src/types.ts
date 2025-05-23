/**
 * TypeScript interfaces for the application
 */

/**
 * Represents a contribution from the backend API
 */
export interface Contribution {
  id: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  owner: string;
}

/**
 * Represents the response from the contributions API
 */
export interface ContributionsResponse {
  contributions: Contribution[];
  total: number;
  skip: number;
  limit: number;
}

/**
 * Represents the status of a contribution
 */
export interface ContributionStatus {
  label: 'Complete' | 'Active' | 'Scheduled';
  color: string;
}

/**
 * Represents search parameters for contributions
 */
export interface SearchParams {
  title?: string;
  owner?: string;
}