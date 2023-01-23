import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import { readFileSync } from 'fs';
import userEvent from '@testing-library/user-event';
import ItemsList from './ItemsList';

const rStream = readFileSync('src/data/data.json', 'utf8');
const data = [...JSON.parse(rStream)];

const mockData = [
  {
    id: 1,
    company: 'Photosnap',
    logo: './images/photosnap.svg',
    new: true,
    featured: true,
    position: 'Senior Frontend Developer',
    role: '',
    level: '',
    postedAt: '1d ago',
    contract: 'Full Time',
    location: 'USA Only',
    languages: [],
    tools: [],
  },
  {
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
  },
];

describe('ItemsList component', () => {
  it('loads all data', () => {
    render(<ItemsList data={data} />);
    const allJobs = screen.getAllByTestId(/item-card/i);
    expect(allJobs.length).toBe(10);
  });

  it('renders all fullstack buttons', () => {
    render(<ItemsList data={data} />);
    const fullstackButtons = screen.getAllByRole('button', {
      name: /Fullstack/i,
    });
    expect(fullstackButtons.length).toBe(3);
  });

  const filterTheProperty = async (property: string): Promise<number> => {
    const fullstackButtons = await screen.findAllByRole('button', {
      name: property,
    });
    const fullstackButton = fullstackButtons[0];
    if (fullstackButton !== undefined) {
      userEvent.click(fullstackButton);
    }
    return fullstackButtons.length;
  };

  const getNoOfAllJobs = async (): Promise<number> => {
    const allJobs = await screen.findAllByTestId(/item-card/i);
    return allJobs.length;
  };

  it('filter Fullstack jobs when clicked once', async () => {
    render(<ItemsList data={data} />);
    const noOfMatchingJobs = await filterTheProperty('Fullstack');
    const noOfAllJobs = await getNoOfAllJobs();
    expect(noOfAllJobs).toBe(noOfMatchingJobs);
  });

  it('filter Fullstack jobs when clicked multiple times', async () => {
    render(<ItemsList data={data} />);
    const fullstackButtons = await screen.findAllByRole('button', {
      name: /Fullstack/i,
    });
    expect(fullstackButtons.length).toBe(3);

    await Promise.all(
      fullstackButtons.map((fullstackButton) =>
        userEvent.click(fullstackButton)
      )
    );
    const noOfAllJobs = await getNoOfAllJobs();
    expect(noOfAllJobs).toBe(fullstackButtons.length);
  });

  it('remove filter and show all postings when clear is clicked', async () => {
    render(<ItemsList data={data} />);
    const noOfMatchingJobs = await filterTheProperty('Fullstack');
    const allJobs = await getNoOfAllJobs();
    expect(allJobs).toBe(noOfMatchingJobs);

    const clearButton = await screen.findByRole('button', { name: /Clear/i });
    expect(clearButton).toBeInTheDocument();

    jest.useFakeTimers();
    userEvent.click(clearButton);
    act(() => {
      jest.advanceTimersByTime(400);
    });

    const allJobsCleared = await getNoOfAllJobs();
    expect(allJobsCleared).toBe(10);
  });

  it('after an item is filtered it has a button to remove the item', async () => {
    render(<ItemsList data={data} />);
    const noOfMatchingJobs = await filterTheProperty('Fullstack');
    const allJobs = await getNoOfAllJobs();
    expect(allJobs).toBe(noOfMatchingJobs);

    const propertyRemoveButton = await screen.findByRole('button', {
      name: /remove Fullstack/i,
    });

    expect(propertyRemoveButton).toHaveClass('filter-property-button-remove');
    expect(propertyRemoveButton).toBeVisible();
  });

  it('remove filter by removing a filtered item', async () => {
    render(<ItemsList data={data} />);
    const noOfMatchingJobs = await filterTheProperty('Fullstack');
    const allJobs = await getNoOfAllJobs();
    expect(allJobs).toBe(noOfMatchingJobs);

    const propertyRemoveButton = await screen.findByRole('button', {
      name: /remove Fullstack/i,
    });
    expect(propertyRemoveButton).toHaveClass('filter-property-button-remove');
    jest.useFakeTimers();
    userEvent.click(propertyRemoveButton);
    act(() => {
      jest.advanceTimersByTime(500);
    });

    const lastJobRemovedFromFilter = await screen.findAllByTestId(/item-card/i);
    expect(lastJobRemovedFromFilter.length).toBe(10);
  });

  it(
    'with more than one filter property present,' +
      'after an item is filtered it has a button to remove the item',
    async () => {
      render(<ItemsList data={data} />);
      const noOfMatchingJobsFullstack = await filterTheProperty('Fullstack');
      expect(noOfMatchingJobsFullstack).toBe(3);
      let noOfMatchingJobsSass = await filterTheProperty('Sass');
      expect(noOfMatchingJobsSass).toBe(1);
      const allJobs = await getNoOfAllJobs();
      expect(allJobs).toBe(noOfMatchingJobsSass);
      const propertyRemoveButton = await screen.findByRole('button', {
        name: /remove Fullstack/i,
      });
      jest.useFakeTimers();
      userEvent.click(propertyRemoveButton);
      act(() => {
        jest.advanceTimersByTime(100);
      });
      noOfMatchingJobsSass = await filterTheProperty('Sass');
      expect(noOfMatchingJobsSass).toBe(5);
      const allSassJobs = await getNoOfAllJobs();
      expect(propertyRemoveButton).not.toBeVisible();
      expect(allSassJobs).toBe(noOfMatchingJobsSass);
    }
  );

  it('renders nothing if there is no data', () => {
    render(<ItemsList data={[]} />);
    const itemsList = screen.getByTestId('items-list');
    expect(itemsList).toBeEmptyDOMElement();
  });

  it(
    'if filter is applied, and a Job has no filter properties' +
      " don't show it in results ",
    async () => {
      render(<ItemsList data={mockData} />);
      const noOfMatchingJobs = await filterTheProperty('Fullstack');
      const allJobs = await getNoOfAllJobs();
      expect(allJobs).toBe(noOfMatchingJobs);

      const propertyRemoveButton = await screen.findByRole('button', {
        name: /remove Fullstack/i,
      });
      jest.useFakeTimers();
      userEvent.click(propertyRemoveButton);
      act(() => {
        jest.advanceTimersByTime(500);
      });

      const allJobsCleared = await getNoOfAllJobs();
      expect(allJobsCleared).toBe(2);
    }
  );
});
