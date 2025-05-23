import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import ContributionsList from '../ContributionList';
import { Contribution } from '../../types';

// Mock axios
vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ContributionsList', () => {
  const mockContributions: Contribution[] = [
    {
      id: 1,
      title: 'Test Contribution 1',
      description: 'Description 1',
      startTime: '2024-05-27T10:00:00Z',
      endTime: '2024-05-27T11:00:00Z',
      owner: 'Test Owner 1'
    },
    {
      id: 2,
      title: 'Test Contribution 2',
      description: 'Description 2',
      startTime: '2024-05-27T12:00:00Z',
      endTime: '2024-05-27T13:00:00Z',
      owner: 'Test Owner 2'
    }
  ];

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();

    // Mock successful API response
    mockedAxios.get.mockResolvedValue({
      data: {
        contributions: mockContributions,
        total: 2,
        totalItems: 2
      }
    });
  });

  test('renders contributions after loading', async () => {
    render(<ContributionsList />);

    // Wait for contributions to be rendered
    await waitFor(() => {
      expect(screen.getByText('Test Contribution 1')).toBeInTheDocument();
    });

    expect(screen.getByText('Test Contribution 2')).toBeInTheDocument();
  });

  test('calls API with correct parameters', async () => {
    render(<ContributionsList />);

    // Wait for API call to be made
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith('http://127.0.0.1:8000/contributions/', {
        params: {
          page: 1,
          limit: 14
        }
      });
    });
  });

  test('updates page when pagination is used', async () => {
    // Mock response with more pages
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        contributions: mockContributions,
        total: 28, // 2 pages with limit 14
        totalItems: 28
      }
    });

    const user = userEvent.setup();
    render(<ContributionsList />);

    // Wait for initial render
    await waitFor(() => {
      expect(screen.getByText('Test Contribution 1')).toBeInTheDocument();
    });

    // Mock response for next page
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        contributions: [
          {
            id: 3,
            title: 'Test Contribution 3',
            description: 'Description 3',
            startTime: '2024-05-27T14:00:00Z',
            endTime: '2024-05-27T15:00:00Z',
            owner: 'Test Owner 3'
          }
        ],
        total: 28,
        totalItems: 28
      }
    });

    // Click next page button
    const nextButton = screen.getByRole('button', { name: /Next/i });
    await user.click(nextButton);

    // Check if API was called with page 2
    expect(mockedAxios.get).toHaveBeenCalledWith('http://127.0.0.1:8000/contributions/', {
      params: {
        page: 2,
        limit: 14
      }
    });
  });

  test('handles API error gracefully', async () => {
    // Mock API error
    mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));
    
    // Spy on console.error
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<ContributionsList />);
    
    // Wait for error to be logged
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching contributions:', expect.any(Error));
    });
    
    // Clean up spy
    consoleSpy.mockRestore();
  });
});