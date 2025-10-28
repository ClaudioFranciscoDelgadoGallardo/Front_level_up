/* eslint-disable import/first */
import { render, screen } from '@testing-library/react';
import React from 'react';

jest.mock('react-router-dom');

import App from './App';

describe('App Component', () => {
  test('renders app without crashing', () => {
    render(<App />);
    const router = screen.getByTestId('router');
    expect(router).toBeInTheDocument();
  });

  test('renders header with logo', () => {
    render(<App />);
    const logoElements = screen.getAllByText(/LEVEL-UP GAMER/i);
    expect(logoElements[0]).toBeInTheDocument();
  });
});
