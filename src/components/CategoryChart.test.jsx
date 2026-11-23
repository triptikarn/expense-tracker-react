import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CategoryChart from './CategoryChart';

describe('CategoryChart', () => {
  it('renders a row per category with its amount', () => {
    render(
      <CategoryChart byCategory={{ food: 500, transport: 250 }} currency="INR" />
    );
    expect(screen.getByText('food')).toBeTruthy();
    expect(screen.getByText('transport')).toBeTruthy();
    expect(screen.getByText(/500\.00/)).toBeTruthy();
  });

  it('shows an empty state when there is no spending', () => {
    render(<CategoryChart byCategory={{}} currency="INR" />);
    expect(screen.getByText(/No spending recorded/)).toBeTruthy();
  });
});
