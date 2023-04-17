import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { readFileSync } from 'fs';
import ItemsList from './ItemsList';
import userEvent from '@testing-library/user-event';

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

// console.log(allJobs.map((c) => c.getAttribute('data-testid')));

describe('ItemsList component', () => {
  it('loads all data', async () => {
    render(<ItemsList data={data} />);
    const allJobs = await screen.findAllByTestId(/card-item-/i);
    expect(allJobs.length).toBe(10);
  });

  it('renders all fullstack buttons', () => {
    render(<ItemsList data={data} />);
    const fullstackButtons = screen.getAllByRole('button', {
      name: /Fullstack/i,
    });
    expect(fullstackButtons.length).toBe(3);
  });

  const filterTheProperty = async (property: string): Promise<number[]> => {
    const fullstackButtons = await screen.findAllByRole('button', {
      name: property,
    });
    const fullstackButton = fullstackButtons[0];
    if (fullstackButton !== undefined) {
      act(() => userEvent.click(fullstackButton));
    }
    const allJobs = await screen.findAllByTestId(/card-item-/i);
    return [fullstackButtons.length, allJobs.length];
  };

  it('filter Fullstack jobs when clicked once', async () => {
    render(<ItemsList data={data} />);
    const [noOfMatchingJobs, noOfAllJobs] = await filterTheProperty(
      'Fullstack'
    );
    expect(noOfAllJobs).toBe(noOfMatchingJobs);
  });

  it('filter Fullstack jobs when clicked multiple times', async () => {
    render(<ItemsList data={data} />);
    const fullstackButtons = await screen.findAllByRole('button', {
      name: 'Fullstack',
    });
    expect(fullstackButtons.length).toBe(3);

    await Promise.all(
      fullstackButtons.map((fullstackButton) =>
        act(() => userEvent.click(fullstackButton))
      )
    );
    const noOfAllJobs = (await screen.findAllByTestId(/card-item-/i)).length;
    expect(noOfAllJobs).toBe(fullstackButtons.length);
  });

  it('remove filter and show all postings when clear is clicked', async () => {
    render(<ItemsList data={data} />);
    const [noOfMatchingJobs, noOfAllJobs] = await filterTheProperty(
      'Fullstack'
    );
    expect(noOfAllJobs).toBe(noOfMatchingJobs);

    const clearButton = await screen.findByRole('button', { name: /Clear/i });
    expect(clearButton).toBeInTheDocument();

    jest.useFakeTimers();
    act(() => {
      userEvent.click(clearButton);
      jest.advanceTimersByTime(400);
    });

    const allJobsCleared = (await screen.findAllByTestId(/card-item-/i)).length;
    expect(allJobsCleared).toBe(10);
  });

  it('after an item is filtered it has a button to remove the item', async () => {
    render(<ItemsList data={data} />);
    const [noOfMatchingJobs, noOfAllJobs] = await filterTheProperty(
      'Fullstack'
    );
    expect(noOfAllJobs).toBe(noOfMatchingJobs);

    const propertyRemoveButton = await screen.findByRole('button', {
      name: /remove Fullstack/i,
    });

    expect(propertyRemoveButton).toHaveClass('filter-property__button-remove');
    expect(propertyRemoveButton).toBeVisible();
  });

  it('remove filter by removing a filtered item', async () => {
    render(<ItemsList data={data} />);
    const [noOfMatchingJobs, noOfAllJobs] = await filterTheProperty(
      'Fullstack'
    );
    expect(noOfAllJobs).toBe(noOfMatchingJobs);

    const propertyRemoveButton = await screen.findByRole('button', {
      name: /remove Fullstack/i,
    });
    expect(propertyRemoveButton).toHaveClass('filter-property__button-remove');
    jest.useFakeTimers();
    act(() => {
      userEvent.click(propertyRemoveButton);
      jest.advanceTimersByTime(500);
    });

    const lastJobRemovedFromFilter = await screen.findAllByTestId(
      /card-item-/i
    );
    expect(lastJobRemovedFromFilter.length).toBe(10);
  });

  it(
    'with more than one filter property present,' +
      'after an item is filtered it has a button to remove the item',
    async () => {
      render(<ItemsList data={data} />);
      const [noOfMatchingJobsFullstack, _] = await filterTheProperty(
        'Fullstack'
      );
      expect(noOfMatchingJobsFullstack).toBe(3);
      let [noOfMatchingJobsSass, allJobs] = await filterTheProperty('Sass');
      expect(noOfMatchingJobsSass).toBe(1);
      expect(allJobs).toBe(noOfMatchingJobsSass);
      const propertyRemoveButton = await screen.findByRole('button', {
        name: /remove Fullstack/i,
      });
      jest.useFakeTimers();
      act(() => {
        userEvent.click(propertyRemoveButton);
        jest.advanceTimersByTime(100);
      });
      let allSassJobs;
      [noOfMatchingJobsSass, allSassJobs] = await filterTheProperty('Sass');
      expect(noOfMatchingJobsSass).toBe(5);
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
      const [noOfMatchingJobs, allJobs] = await filterTheProperty('Fullstack');
      expect(allJobs).toBe(noOfMatchingJobs);

      const propertyRemoveButton = await screen.findByRole('button', {
        name: /remove Fullstack/i,
      });
      jest.useFakeTimers();
      act(() => userEvent.click(propertyRemoveButton));
      act(() => {
        jest.advanceTimersByTime(500);
      });

      const allJobsCleared = (await screen.findAllByTestId(/card-item-/i))
        .length;
      expect(allJobsCleared).toBe(2);
    }
  );
});
