import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import ItemCard from './ItemCard';
import Job from '../model/Job';

const mockJobItem: Job = {
  id: 2,
  company: 'Manage',
  logo: './images/manage.svg',
  new: true,
  featured: true,
  position: 'Fullstack Developer',
  role: 'Fullstack',
  level: 'Midweight',
  postedAt: '1d ago',
  contract: 'Part Time',
  location: 'Remote',
  languages: ['Python'],
  tools: ['React'],
};

const mockJobItemFalse: Job = {
  id: 2,
  company: 'Manage',
  logo: './images/manage.svg',
  new: false,
  featured: false,
  position: 'Fullstack Developer',
  role: 'Fullstack',
  level: 'Midweight',
  postedAt: '1d ago',
  contract: 'Part Time',
  location: 'Remote',
  languages: ['Python'],
  tools: ['React'],
};

const handlePropertyClicked = jest.fn((id: number, propertyName: string) => {
  // do nothing});
});

describe('ItemsList component', () => {
  const renderTemplate = (JobItem: Job) =>
    render(
      <ItemCard
        jobItem={JobItem}
        handlePropertyClicked={handlePropertyClicked}
      />
    );

  afterEach(() => {
    cleanup();
  });
  it('renders one card', () => {
    renderTemplate(mockJobItem);
    const allJobs = screen.getAllByTestId(/card-item-2/i);
    expect(allJobs.length).toBe(1);
  });

  it('renders with buttons for level, role, languages and tools', () => {
    renderTemplate(mockJobItem);
    const buttons = screen.getAllByRole('button');
    const buttonsNames = buttons.map((b) => b.textContent);
    expect(buttonsNames.includes('Fullstack')).toBe(true);
    expect(buttonsNames.includes('Midweight')).toBe(true);
    expect(buttonsNames.includes('Python')).toBe(true);
    expect(buttonsNames.includes('React')).toBe(true);
  });

  it('has new and featured visible if set to true', () => {
    renderTemplate(mockJobItem);
    const itemNew = screen.getByText(/new/i);
    expect(itemNew).toBeVisible();
    const itemFeatured = screen.getByText(/featured/i);
    expect(itemFeatured).toBeVisible();
  });

  it("doesn't have new and featured if set to false", () => {
    renderTemplate(mockJobItemFalse);
    const headerTitles = screen.getByTestId('card-item__tiles');
    expect(headerTitles).toHaveTextContent('');
  });
});
