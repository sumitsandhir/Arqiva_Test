/**
 * ContributionCard Component
 * 
 * Displays a single contribution with its details in a card format.
 * Shows title, description, start/end times, owner, and dynamically calculated status.
 * Status is determined based on the current time relative to the contribution's start and end times.
 */
import React from 'react';
import { Contribution, ContributionStatus } from '../types';

/**
 * Props for the ContributionCard component
 */
interface ContributionCardProps {
  contribution: Contribution;
}

const ContributionCard: React.FC<ContributionCardProps> = ({ contribution }) => {
  const {title, description, startTime, endTime, owner } = contribution;

  /**
   * Formats an ISO date string to the user's locale
   * @param dateString - ISO 8601 formatted date string
   * @returns Formatted date string in the user's locale
   */
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  /**
   * Determines the contribution status based on current time
   * - Complete: End time is in the past
   * - Active: Current time is between start and end times
   * - Scheduled: Start time is in the future
   * @returns ContributionStatus object with label and color
   */
  const getStatus = (): ContributionStatus => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (end.getTime() < now.getTime()) {
      return { label: 'Complete', color: 'bg-gray-100 text-gray-800' };
    } else if (start.getTime() <= now.getTime() && end.getTime() >= now.getTime()) {
      return { label: 'Active', color: 'bg-green-100 text-green-800' };
    } else {
      return { label: 'Scheduled', color: 'bg-blue-100 text-blue-800' };
    }
  };

  const status = getStatus();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">{title}</h2>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
            {status.label}
          </span>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{description}</p>

        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
          <span className="font-medium">Start:</span> {formatDate(startTime)}
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          <span className="font-medium">End:</span> {formatDate(endTime)}
        </div>

        <div className="flex items-center mt-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Producer:</span>
          <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">{owner}</span>
        </div>
      </div>
    </div>
  );
};

export default ContributionCard;
