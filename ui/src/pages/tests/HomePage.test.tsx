import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import HomePage from '../HomePage';
import { Contribution } from '../../types';

// Mock axios
vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Setup for all tests
beforeEach(() => {
  vi.resetAllMocks();
});

// Helper function to render component
const renderHomePage = (initialEntries = ['/']) => {
  return render(
      <MemoryRouter initialEntries={initialEntries} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <HomePage />
      </MemoryRouter>
  );
};

describe('HomePage', () => {
  const mockContributions: Contribution[] = [
    {
      id: 1,
      title: 'Test Contribution 1',
      description: 'Description 1',
      startTime: '2024-05-27T10:00:00Z',
      endTime: '2024-05-27T11:00:00Z',
      owner: 'Test Owner 1',
    },
    {
      id: 2,
      title: 'Test Contribution 2',
      description: 'Description 2',
      startTime: '2024-05-27T12:00:00Z',
      endTime: '2024-05-27T13:00:00Z',
      owner: 'Test Owner 2',
    },
  ];

  test('renders loading state initially', () => {
    // Setup mock
    mockedAxios.get.mockResolvedValueOnce({
      data: { contributions: [], total: 0, skip: 0, limit: 14 },
    });

    // Render component
    renderHomePage();

    // Check loading state
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  test('renders contributions after loading', async () => {
    // Setup mock
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        contributions: mockContributions,
        total: 2,
        skip: 0,
        limit: 14,
      },
    });

    // Render component
    renderHomePage();

    // Wait for loading to finish
    await waitFor(() => expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument());

    // Check for content using data-testid if possible, or partial text matching
    expect(screen.getAllByRole('heading', { level: 2 })[0]).toHaveTextContent(/Test Contribution 1/i);
    expect(screen.getAllByRole('heading', { level: 2 })[1]).toHaveTextContent(/Test Contribution 2/i);
  });

  test('renders error message when API call fails', async () => {
    // Setup mock
    mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

    // Render component
    renderHomePage();

    // Wait for error message
    await waitFor(() => expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument());
    expect(screen.getByText(/Failed to fetch contributions/i)).toBeInTheDocument();
  });

  test('renders empty state when no contributions match search', async () => {
    // Setup mock
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        contributions: [],
        total: 0,
        skip: 0,
        limit: 14,
      },
    });

    // Render component
    renderHomePage();

    // Wait for empty state
    await waitFor(() => expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument());
    expect(screen.getByText(/No contributions found/i)).toBeInTheDocument();
  });

  test('calls API with search parameters when search is submitted', async () => {
    // Setup user events
    const user = userEvent.setup();

    // Setup mock
    mockedAxios.get.mockResolvedValue({
      data: {
        contributions: mockContributions,
        total: 2,
        skip: 0,
        limit: 14,
      },
    });

    // Render component
    renderHomePage();

    // Wait for loading to finish
    await waitFor(() => expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument());

    // Get form elements (use getByRole if possible)
    const titleInput = screen.getByLabelText(/Title/i);
    const ownerInput = screen.getByLabelText(/Producer/i);
    const searchButton = screen.getByRole('button', { name: /Search/i });

    // Clear mock to isolate search API call
    mockedAxios.get.mockClear();

    // Type in search fields and submit
    await user.type(titleInput, 'Test Title');
    await user.type(ownerInput, 'Test Owner');
    await user.click(searchButton);

    // Verify API call
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith('/contributions', {
        params: expect.objectContaining({
          title: 'Test Title',
          owner: 'Test Owner',
        }),
      });
    });
  });

  test('renders with URL search parameters', async () => {
    // Setup mock
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        contributions: mockContributions,
        total: 2,
        skip: 14,
        limit: 14,
      },
    });

    // Render with URL params
    renderHomePage(['/?title=Test&owner=Owner&page=2']);

    // Verify API call
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith('/contributions', {
        params: expect.objectContaining({
          title: 'Test',
          owner: 'Owner',
          skip: 14,
        }),
      });
    });

    // Wait for loading to finish
    await waitFor(() => expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument());

    // Check form values
    expect(screen.getByLabelText(/Title/i)).toHaveValue('Test');
    expect(screen.getByLabelText(/Producer/i)).toHaveValue('Owner');
  });

  test('updates URL when pagination is used', async () => {
    // Setup user events
    const user = userEvent.setup();

    // Setup mock for initial load
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        contributions: mockContributions,
        total: 28, // Multiple pages
        skip: 0,
        limit: 14,
      },
    });

    // Render component
    renderHomePage();

    // Wait for loading to finish
    await waitFor(() => expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument());

    // Find pagination button
    const nextPageButton = screen.getByRole('button', { name: /Next/i });
    expect(nextPageButton).toBeInTheDocument();

    // Setup mock for next page
    mockedAxios.get.mockClear();
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        contributions: mockContributions,
        total: 28,
        skip: 14,
        limit: 14,
      },
    });

    // Click pagination
    await user.click(nextPageButton);

    // Verify API call
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith('/contributions', {
        params: expect.objectContaining({
          skip: 14,
        }),
      });
    });
  });
});