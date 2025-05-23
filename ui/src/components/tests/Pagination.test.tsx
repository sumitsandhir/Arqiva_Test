import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pagination from '../Pagination';

describe('Pagination', () => {
  const mockOnPageChange = vi.fn();

  beforeEach(() => {
    mockOnPageChange.mockClear();
  });

  test('does not render when there is only one page', () => {
    const { container } = render(
      <Pagination 
        currentPage={1} 
        totalPages={1} 
        onPageChange={mockOnPageChange} 
      />
    );
    
    expect(container.firstChild).toBeNull();
  });

  test('renders pagination with correct number of pages', () => {
    render(
      <Pagination 
        currentPage={1} 
        totalPages={5} 
        onPageChange={mockOnPageChange} 
      />
    );
    
    // Should show all 5 pages
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  test('renders ellipsis for large number of pages', () => {
    render(
      <Pagination 
        currentPage={5} 
        totalPages={10} 
        onPageChange={mockOnPageChange} 
      />
    );
    
    // Should show first page, ellipsis, pages around current, ellipsis, last page
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getAllByText('...').length).toBe(2);
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  test('calls onPageChange when a page button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <Pagination 
        currentPage={1} 
        totalPages={5} 
        onPageChange={mockOnPageChange} 
      />
    );
    
    const pageButton = screen.getByText('3');
    await user.click(pageButton);
    
    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  test('calls onPageChange when next button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <Pagination 
        currentPage={1} 
        totalPages={5} 
        onPageChange={mockOnPageChange} 
      />
    );
    
    const nextButton = screen.getByRole('button', { name: /Next/i });
    await user.click(nextButton);
    
    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  test('calls onPageChange when previous button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <Pagination 
        currentPage={3} 
        totalPages={5} 
        onPageChange={mockOnPageChange} 
      />
    );
    
    const prevButton = screen.getByRole('button', { name: /Previous/i });
    await user.click(prevButton);
    
    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  test('disables previous button on first page', () => {
    render(
      <Pagination 
        currentPage={1} 
        totalPages={5} 
        onPageChange={mockOnPageChange} 
      />
    );
    
    const prevButton = screen.getByRole('button', { name: /Previous/i });
    expect(prevButton).toBeDisabled();
  });

  test('disables next button on last page', () => {
    render(
      <Pagination 
        currentPage={5} 
        totalPages={5} 
        onPageChange={mockOnPageChange} 
      />
    );
    
    const nextButton = screen.getByRole('button', { name: /Next/i });
    expect(nextButton).toBeDisabled();
  });
});