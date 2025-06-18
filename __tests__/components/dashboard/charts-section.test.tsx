import { render, screen } from '@testing-library/react'
import { ChartsSection } from '@/components/dashboard/charts-section'

// Mock recharts to avoid canvas/SVG rendering issues in tests
jest.mock('recharts', () => ({
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  Bar: ({ children }: any) => <div data-testid="bar">{children}</div>,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  PieChart: ({ children }: any) => <div data-testid="pie-chart">{children}</div>,
  Pie: ({ children }: any) => <div data-testid="pie">{children}</div>,
  Cell: () => <div data-testid="cell" />,
}))

describe('ChartsSection', () => {
  it('renders both charts', () => {
    render(<ChartsSection />)
    
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument()
  })

  it('displays chart titles and descriptions', () => {
    render(<ChartsSection />)
    
    expect(screen.getByText('Users per Event')).toBeInTheDocument()
    expect(screen.getByText('Number of registered users for each event')).toBeInTheDocument()
    expect(screen.getByText('Event Status Breakdown')).toBeInTheDocument()
    expect(screen.getByText('Distribution of events by current status')).toBeInTheDocument()
  })

  it('renders with proper grid layout', () => {
    const { container } = render(<ChartsSection />)
    const gridContainer = container.firstChild
    expect(gridContainer).toHaveClass('grid', 'grid-cols-1', 'lg:grid-cols-2', 'gap-8')
  })

  it('displays legend for pie chart', () => {
    render(<ChartsSection />)
    
    expect(screen.getByText(/Upcoming \(8\)/)).toBeInTheDocument()
    expect(screen.getByText(/Ongoing \(3\)/)).toBeInTheDocument()
    expect(screen.getByText(/Completed \(13\)/)).toBeInTheDocument()
  })

  it('renders responsive containers', () => {
    render(<ChartsSection />)
    const responsiveContainers = screen.getAllByTestId('responsive-container')
    expect(responsiveContainers).toHaveLength(2)
  })

  it('applies shadow styling to cards', () => {
    const { container } = render(<ChartsSection />)
    const cards = container.querySelectorAll('.shadow-lg')
    expect(cards).toHaveLength(2)
  })

  it('has proper height containers for charts', () => {
    const { container } = render(<ChartsSection />)
    const chartContainers = container.querySelectorAll('.h-80')
    expect(chartContainers).toHaveLength(2)
  })
})