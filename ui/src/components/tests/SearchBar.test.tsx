import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from '../SearchBar';

describe('SearchBar', () => {
  const mockOnSearch = vi.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  test('renders with initial values', () => {
    render(
      <SearchBar 
        initialTitle="Test Title" 
        initialOwner="Test Owner" 
        onSearch={mockOnSearch} 
      />
    );
    
    const titleInput = screen.getByLabelText(/Title/i) as HTMLInputElement;
    const ownerInput = screen.getByLabelText(/Producer/i) as HTMLInputElement;
    
    expect(titleInput.value).toBe('Test Title');
    expect(ownerInput.value).toBe('Test Owner');
  });

  test('calls onSearch when form is submitted', async () => {
    const user = userEvent.setup();
    
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const titleInput = screen.getByLabelText(/Title/i);
    const ownerInput = screen.getByLabelText(/Producer/i);
    const searchButton = screen.getByRole('button', { name: /Search/i });
    
    await user.type(titleInput, 'New Title');
    await user.type(ownerInput, 'New Owner');
    await user.click(searchButton);
    
    expect(mockOnSearch).toHaveBeenCalledWith({
      title: 'New Title',
      owner: 'New Owner'
    });
  });

  test('clears inputs and calls onSearch when Clear button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <SearchBar 
        initialTitle="Test Title" 
        initialOwner="Test Owner" 
        onSearch={mockOnSearch} 
      />
    );
    
    const clearButton = screen.getByRole('button', { name: /Clear/i });
    
    await user.click(clearButton);
    
    const titleInput = screen.getByLabelText(/Title/i) as HTMLInputElement;
    const ownerInput = screen.getByLabelText(/Producer/i) as HTMLInputElement;
    
    expect(titleInput.value).toBe('');
    expect(ownerInput.value).toBe('');
    expect(mockOnSearch).toHaveBeenCalledWith({
      title: '',
      owner: ''
    });
  });

  test('updates input values when typing', async () => {
    const user = userEvent.setup();
    
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const titleInput = screen.getByLabelText(/Title/i) as HTMLInputElement;
    const ownerInput = screen.getByLabelText(/Producer/i) as HTMLInputElement;
    
    await user.type(titleInput, 'Test Input');
    expect(titleInput.value).toBe('Test Input');
    
    await user.type(ownerInput, 'Test Owner');
    expect(ownerInput.value).toBe('Test Owner');
  });
});