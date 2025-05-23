import { render, screen } from '@testing-library/react';
import ContributionCard from '../ContributionCard';
import { Contribution } from '../../types';

describe('ContributionCard', () => {
  // Mock date to ensure consistent test results
  const originalDate = global.Date;

  beforeAll(() => {
    // Mock current date to 2024-05-27T13:00:00Z
    const OriginalDate = global.Date;
    global.Date = class extends OriginalDate {
      constructor(...args: ConstructorParameters<typeof Date>) {
        // Cast args to an array to avoid the strict tuple length issue
        const argsArray = args as unknown[];
        if (argsArray.length === 0) {
          super('2024-05-27T13:00:00Z'); // Default mock date
        } else {
          super(...args); // Pass through args to the original Date constructor
        }
      }
    } as unknown as DateConstructor;
  });

  afterAll(() => {
    global.Date = originalDate;
  });

  const mockCompletedContribution: Contribution = {
    id: 1,
    title: 'Test Completed Contribution',
    description: 'This is a test description for a completed contribution',
    startTime: '2024-05-27T10:00:00Z',
    endTime: '2024-05-27T11:00:00Z',
    owner: 'Test Owner'
  };

  const mockActiveContribution: Contribution = {
    id: 2,
    title: 'Test Active Contribution',
    description: 'This is a test description for an active contribution',
    startTime: '2024-05-27T12:00:00Z',
    endTime: '2024-05-27T14:00:00Z',
    owner: 'Test Owner'
  };

  const mockScheduledContribution: Contribution = {
    id: 3,
    title: 'Test Scheduled Contribution',
    description: 'This is a test description for a scheduled contribution',
    startTime: '2024-05-27T15:00:00Z',
    endTime: '2024-05-27T16:00:00Z',
    owner: 'Test Owner'
  };

  test('renders completed contribution correctly', () => {
    render(<ContributionCard contribution={mockCompletedContribution} />);

    expect(screen.getByText('Test Completed Contribution')).toBeInTheDocument();
    expect(screen.getByText('This is a test description for a completed contribution')).toBeInTheDocument();
    expect(screen.getByText('Complete')).toBeInTheDocument();
    expect(screen.getByText(/Test Owner/)).toBeInTheDocument();
  });

  test('renders active contribution correctly', () => {
    render(<ContributionCard contribution={mockActiveContribution} />);

    expect(screen.getByText('Test Active Contribution')).toBeInTheDocument();
    expect(screen.getByText('This is a test description for an active contribution')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText(/Test Owner/)).toBeInTheDocument();
  });

  test('renders scheduled contribution correctly', () => {
    render(<ContributionCard contribution={mockScheduledContribution} />);

    expect(screen.getByText('Test Scheduled Contribution')).toBeInTheDocument();
    expect(screen.getByText('This is a test description for a scheduled contribution')).toBeInTheDocument();
    expect(screen.getByText('Scheduled')).toBeInTheDocument();
    expect(screen.getByText(/Test Owner/)).toBeInTheDocument();
  });
});
