import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders student performance tracker', () => {
  render(<App />);
  const linkElement = screen.getByText(/Student Performance Tracker/i);
  expect(linkElement).toBeInTheDocument();
});
