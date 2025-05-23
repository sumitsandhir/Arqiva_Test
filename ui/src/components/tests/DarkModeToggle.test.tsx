import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DarkModeToggle from '../DarkModeToggle';

describe('DarkModeToggle', () => {
  beforeEach(() => {
    // Clear localStorage and document classes before each test
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  test('renders with light mode by default when no preference is stored', () => {
    // Mock matchMedia to return false for dark mode preference
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(<DarkModeToggle />);
    
    // In light mode, we should see the moon icon (for switching to dark mode)
    expect(screen.getByLabelText('Switch to dark mode')).toBeInTheDocument();
  });

  test('renders with dark mode when system prefers dark mode', () => {
    // Mock matchMedia to return true for dark mode preference
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(<DarkModeToggle />);
    
    // In dark mode, we should see the sun icon (for switching to light mode)
    expect(screen.getByLabelText('Switch to light mode')).toBeInTheDocument();
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  test('renders with dark mode when dark mode is stored in localStorage', () => {
    // Set dark mode preference in localStorage
    localStorage.setItem('darkMode', 'true');
    
    render(<DarkModeToggle />);
    
    // In dark mode, we should see the sun icon (for switching to light mode)
    expect(screen.getByLabelText('Switch to light mode')).toBeInTheDocument();
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  test('toggles between light and dark mode when clicked', async () => {
    const user = userEvent.setup();
    
    // Start in light mode
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    
    render(<DarkModeToggle />);
    
    // Initially in light mode
    expect(screen.getByLabelText('Switch to dark mode')).toBeInTheDocument();
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    
    // Click to switch to dark mode
    const toggleButton = screen.getByRole('button');
    await user.click(toggleButton);
    
    // Now in dark mode
    expect(screen.getByLabelText('Switch to light mode')).toBeInTheDocument();
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('darkMode')).toBe('true');
    
    // Click again to switch back to light mode
    await user.click(toggleButton);
    
    // Back to light mode
    expect(screen.getByLabelText('Switch to dark mode')).toBeInTheDocument();
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('darkMode')).toBe('false');
  });
});