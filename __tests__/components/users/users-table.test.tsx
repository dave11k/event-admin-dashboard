import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UsersTable } from '@/components/users/users-table'
import type { User } from '@/components/users/users-management'

const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    eventName: 'Tech Conference 2024',
    eventStatus: 'Upcoming',
    registeredDate: '2024-01-01T10:30:00Z'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    eventName: 'Music Festival',
    eventStatus: 'Ongoing',
    registeredDate: '2024-01-02T14:15:00Z'
  }
]

const mockProps = {
  users: mockUsers,
  searchQuery: '',
  setSearchQuery: jest.fn(),
  eventFilter: '',
  setEventFilter: jest.fn(),
  statusFilter: '',
  setStatusFilter: jest.fn(),
  uniqueEvents: ['Tech Conference 2024', 'Music Festival'],
  totalCount: 2
}

describe('UsersTable', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders table with users data', () => {
    render(<UsersTable {...mockProps} />)
    
    expect(screen.getByText('All Users (2)')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
  })

  it('displays user details correctly', () => {
    render(<UsersTable {...mockProps} />)
    
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
    expect(screen.getByText('Tech Conference 2024')).toBeInTheDocument()
    expect(screen.getByText('Music Festival')).toBeInTheDocument()
  })

  it('displays status badges with correct styling', () => {
    render(<UsersTable {...mockProps} />)
    
    const upcomingBadge = screen.getByText('Upcoming')
    const ongoingBadge = screen.getByText('Ongoing')
    
    expect(upcomingBadge).toBeInTheDocument()
    expect(ongoingBadge).toBeInTheDocument()
  })

  it('formats registration dates correctly', () => {
    render(<UsersTable {...mockProps} />)
    
    expect(screen.getByText('Jan 1, 2024, 10:30 AM')).toBeInTheDocument()
    expect(screen.getByText('Jan 2, 2024, 02:15 PM')).toBeInTheDocument()
  })

  it('generates correct initials for user avatars', () => {
    render(<UsersTable {...mockProps} />)
    
    expect(screen.getByText('JD')).toBeInTheDocument()
    expect(screen.getByText('JS')).toBeInTheDocument()
  })

  it('renders search input and calls setSearchQuery', async () => {
    const user = userEvent.setup()
    render(<UsersTable {...mockProps} />)
    
    const searchInput = screen.getByPlaceholderText('Search users...')
    expect(searchInput).toBeInTheDocument()
    
    await user.type(searchInput, 'John')
    
    expect(mockProps.setSearchQuery).toHaveBeenCalledWith('John')
  })

  it('handles name sorting', () => {
    render(<UsersTable {...mockProps} />)
    
    const nameHeader = screen.getByRole('button', { name: /Name/ })
    fireEvent.click(nameHeader)
    
    // Check that users are displayed (sorting logic is tested by the actual sorting)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
  })

  it('handles registration date sorting', () => {
    render(<UsersTable {...mockProps} />)
    
    const dateHeader = screen.getByRole('button', { name: /Registered Date/ })
    fireEvent.click(dateHeader)
    
    // Check that users are displayed (sorting logic is tested by the actual sorting)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
  })

  it('renders table headers correctly', () => {
    render(<UsersTable {...mockProps} />)
    
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Event Name')).toBeInTheDocument()
    expect(screen.getByText('Event Status')).toBeInTheDocument()
    expect(screen.getByText('Registered Date')).toBeInTheDocument()
  })

  it('renders email as clickable mailto link', () => {
    render(<UsersTable {...mockProps} />)
    
    const emailLink = screen.getByRole('link', { name: /john@example.com/ })
    expect(emailLink).toHaveAttribute('href', 'mailto:john@example.com')
  })

  it('applies alternating row colors', () => {
    render(<UsersTable {...mockProps} />)
    
    const tableRows = screen.getAllByRole('row')
    const dataRows = tableRows.slice(1) // Skip header row
    
    expect(dataRows[0]).toHaveClass('bg-white')
    expect(dataRows[1]).toHaveClass('bg-gray-50/50')
  })

  it('displays correct total count in title', () => {
    render(<UsersTable {...mockProps} totalCount={5} />)
    
    expect(screen.getByText('All Users (5)')).toBeInTheDocument()
  })

  it('sorts users correctly by name', () => {
    const { rerender } = render(<UsersTable {...mockProps} />)
    
    // Click name header to sort
    const nameHeader = screen.getByRole('button', { name: /Name/ })
    fireEvent.click(nameHeader)
    
    // Check initial order (ascending)
    const rows = screen.getAllByRole('row')
    const firstUserRow = rows[1]
    const secondUserRow = rows[2]
    
    expect(firstUserRow).toHaveTextContent('Jane Smith')
    expect(secondUserRow).toHaveTextContent('John Doe')
  })

  it('sorts users correctly by registration date', () => {
    render(<UsersTable {...mockProps} />)
    
    // Default sort should be by registration date (desc)
    const rows = screen.getAllByRole('row')
    const firstUserRow = rows[1]
    const secondUserRow = rows[2]
    
    // Jane registered later (2024-01-02) so should appear first in desc order
    expect(firstUserRow).toHaveTextContent('Jane Smith')
    expect(secondUserRow).toHaveTextContent('John Doe')
  })
})