import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import HomePage from '../HomePage';
import { Contribution } from '../../types';

// Mock axios
vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('HomePage', () => {
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
        skip: 0,
        limit: 14
      }
    });
  });

  const renderWithRouter = (initialEntries = ['/']) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </MemoryRouter>
    );
  };

  test('renders loading state initially', () => {
    renderWithRouter();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  test('renders contributions after loading', async () => {
    renderWithRouter();

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });

    // Check if contributions are rendered
    expect(screen.getByText('Test Contribution 1')).toBeInTheDocument();
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('Test Contribution 2')).toBeInTheDocument();
    expect(screen.getByText('Description 2')).toBeInTheDocument();
  });

  test('renders error message when API call fails', async () => {
    // Mock failed API response
    mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

    renderWithRouter();

    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch contributions/i)).toBeInTheDocument();
    });
  });

  test('renders empty state when no contributions match search', async () => {
    // Mock empty response
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        contributions: [],
        total: 0,
        skip: 0,
        limit: 14
      }
    });

    renderWithRouter();

    // Wait for empty state message
    await waitFor(() => {
      expect(screen.getByText(/No contributions found/i)).toBeInTheDocument();
    });
  });

  test('calls API with search parameters when search is submitted', async () => {
    const user = userEvent.setup();

    renderWithRouter();

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });

    // Fill search form
    const titleInput = screen.getByLabelText(/Title/i);
    const ownerInput = screen.getByLabelText(/Producer/i);
    const searchButton = screen.getByRole('button', { name: /Search/i });

    await user.type(titleInput, 'Test Title');
    await user.type(ownerInput, 'Test Owner');
    await user.click(searchButton);

    // Check if API was called with correct parameters
    expect(mockedAxios.get).toHaveBeenCalledWith('/contributions', {
      params: expect.objectContaining({
        title: 'Test Title',
        owner: 'Test Owner',
        skip: 0,
        limit: 14
      })
    });
  });

  test('renders with URL search parameters', async () => {
    // Render with initial URL params
    renderWithRouter(['/?title=Test&owner=Owner&page=2']);

    // Check if API was called with correct parameters from URL
    expect(mockedAxios.get).toHaveBeenCalledWith('/contributions', {
      params: expect.objectContaining({
        title: 'Test',
        owner: 'Owner',
        skip: 14, // page 2 with limit 14
        limit: 14
      })
    });

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });

    // Check if search inputs have values from URL
    const titleInput = screen.getByLabelText(/Title/i) as HTMLInputElement;
    const ownerInput = screen.getByLabelText(/Producer/i) as HTMLInputElement;

    expect(titleInput.value).toBe('Test');
    expect(ownerInput.value).toBe('Owner');
  });

  test('updates URL when pagination is used', async () => {
    const user = userEvent.setup();

    // Mock response with more pages
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        contributions: mockContributions,
        total: 28, // 2 pages with limit 14
        skip: 0,
        limit: 14
      }
    });

    renderWithRouter();

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });

    // Check if pagination is rendered
    const nextPageButton = screen.getByRole('button', { name: /Next/i });
    expect(nextPageButton).toBeInTheDocument();

    // Mock response for next page
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        contributions: mockContributions,
        total: 28,
        skip: 14,
        limit: 14
      }
    });

    // Click next page
    await user.click(nextPageButton);

    // Check if API was called with correct pagination parameters
    expect(mockedAxios.get).toHaveBeenCalledWith('/contributions', {
      params: expect.objectContaining({
        skip: 14,
        limit: 14
      })
    });
  });
});
