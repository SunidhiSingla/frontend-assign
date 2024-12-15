import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

beforeEach(()=>{global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([
      { "s.no": 1, "percentage.funded": "800", "amt.pledged": "5900" },
      { "s.no": 2, "percentage.funded": "9", "amt.pledged": "2000" },
      { "s.no": 3, "percentage.funded": "14", "amt.pledged": "8700" },
      { "s.no": 4, "percentage.funded": "5", "amt.pledged": "3000" },
      { "s.no": 5, "percentage.funded": "60", "amt.pledged": "1070" },
      { "s.no": 6, "percentage.funded": "78", "amt.pledged": "3500" },
    ]),
  })
);
});

describe('App Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the component correctly', async () => {
    render(<App />);
    expect(screen.getByText('S.No.')).toBeInTheDocument();
    expect(screen.getByText('Percentage funded')).toBeInTheDocument();
    expect(screen.getByText('Amount pledged')).toBeInTheDocument();
  });

  test('correctly fetches the data from API', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('1070')).toBeInTheDocument();
      expect(screen.getByText('60')).toBeInTheDocument();
    });
  });

  test('displays the correct number of pages in the dropdown', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getAllByRole('option').length).toBe(2); // there are 6 items, 5 items per page, so total 2 pages
    });
  });

  test('disables pagination controls on going out of the limit', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('<<').className).toContain('pagination_disable');
    });

    fireEvent.click(screen.getByText('Next'));
    await waitFor(() => {
      expect(screen.getByText('>>').className).toContain('pagination_disable');
    });
  });
});

  test('navigates between pages when pagination button are clicked', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('2000')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Next'));
    await waitFor(() => {
      expect(screen.getByText('3500')).toBeInTheDocument(); // Data on the second page
    });
  });