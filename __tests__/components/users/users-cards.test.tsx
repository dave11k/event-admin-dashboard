import { render, screen } from "@testing-library/react";
import { UsersCards } from "@/components/users/users-cards";
import type { UserWithRegistration } from "@/lib/queries/users";

const mockUsers: UserWithRegistration[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    eventId: "event-1",
    eventName: "Tech Conference 2024",
    eventStatus: "upcoming",
    registeredDate: "2024-01-01T10:30:00Z",
    registrationStatus: "registered",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    eventId: "event-2",
    eventName: "Music Festival",
    eventStatus: "ongoing",
    registeredDate: "2024-01-02T14:15:00Z",
    registrationStatus: "registered",
  },
];

describe("UsersCards", () => {
  it("renders all user cards", () => {
    render(<UsersCards users={mockUsers} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  it("displays user details correctly", () => {
    render(<UsersCards users={mockUsers} />);

    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
    expect(screen.getByText("Tech Conference 2024")).toBeInTheDocument();
    expect(screen.getByText("Music Festival")).toBeInTheDocument();
  });

  it("displays status badges with correct styling", () => {
    render(<UsersCards users={mockUsers} />);

    const upcomingBadge = screen.getByText("Upcoming");
    const ongoingBadge = screen.getByText("Ongoing");

    expect(upcomingBadge).toBeInTheDocument();
    expect(ongoingBadge).toBeInTheDocument();
  });

  it("formats registration dates correctly", () => {
    render(<UsersCards users={mockUsers} />);

    expect(
      screen.getByText("Registered Jan 1, 2024, 10:30 AM"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Registered Jan 2, 2024, 02:15 PM"),
    ).toBeInTheDocument();
  });

  it("generates correct initials for user avatars", () => {
    render(<UsersCards users={mockUsers} />);

    expect(screen.getByText("JD")).toBeInTheDocument();
    expect(screen.getByText("JS")).toBeInTheDocument();
  });

  it("renders email as clickable mailto link", () => {
    render(<UsersCards users={mockUsers} />);

    const johnEmailLink = screen.getByRole("link", {
      name: /john@example.com/,
    });
    const janeEmailLink = screen.getByRole("link", {
      name: /jane@example.com/,
    });

    expect(johnEmailLink).toHaveAttribute("href", "mailto:john@example.com");
    expect(janeEmailLink).toHaveAttribute("href", "mailto:jane@example.com");
  });

  it("applies hover effects to cards", () => {
    const { container } = render(<UsersCards users={mockUsers} />);

    const cards = container.querySelectorAll(".hover\\:shadow-md");
    expect(cards).toHaveLength(2);
  });

  it("handles empty users list", () => {
    render(<UsersCards users={[]} />);

    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument();
  });

  it("renders cards in grid layout", () => {
    const { container } = render(<UsersCards users={mockUsers} />);

    const gridContainer = container.firstChild;
    expect(gridContainer).toHaveClass("grid", "gap-4");
  });

  it("truncates long content properly", () => {
    const longNameUser: UserWithRegistration = {
      id: "3",
      name: "Very Long Name That Should Be Truncated",
      email: "verylongemail@verylongdomainname.com",
      eventId: "event-3",
      eventName: "Very Long Event Name That Should Be Truncated As Well",
      eventStatus: "upcoming",
      registeredDate: "2024-01-01T10:30:00Z",
      registrationStatus: "registered",
    };

    render(<UsersCards users={[longNameUser]} />);

    const nameElement = screen.getByText(
      "Very Long Name That Should Be Truncated",
    );
    const emailElement = screen.getByText(
      "verylongemail@verylongdomainname.com",
    );
    const eventElement = screen.getByText(
      "Very Long Event Name That Should Be Truncated As Well",
    );

    expect(nameElement).toHaveClass("truncate");
    expect(emailElement).toHaveClass("truncate");
    expect(eventElement).toHaveClass("truncate");
  });

  it("handles single character names for initials", () => {
    const singleCharUser: UserWithRegistration = {
      id: "4",
      name: "A",
      email: "a@example.com",
      eventId: "event-4",
      eventName: "Test Event",
      eventStatus: "upcoming",
      registeredDate: "2024-01-01T10:30:00Z",
      registrationStatus: "registered",
    };

    render(<UsersCards users={[singleCharUser]} />);

    // Should have exactly 2 instances of 'A' - one in avatar, one in name
    const aElements = screen.getAllByText("A");
    expect(aElements).toHaveLength(2);
  });

  it("handles multi-word names for initials correctly", () => {
    const multiWordUser: UserWithRegistration = {
      id: "5",
      name: "John Michael Smith",
      email: "jms@example.com",
      eventId: "event-5",
      eventName: "Test Event",
      eventStatus: "upcoming",
      registeredDate: "2024-01-01T10:30:00Z",
      registrationStatus: "registered",
    };

    render(<UsersCards users={[multiWordUser]} />);

    // Should only take first 2 initials
    expect(screen.getByText("JM")).toBeInTheDocument();
  });
});
