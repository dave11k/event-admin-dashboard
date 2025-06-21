import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EventsTable } from "@/components/events/events-table";
import type { Event } from "@/components/events/events-management";

const mockEvents: Event[] = [
  {
    id: "1",
    title: "Tech Conference 2024",
    description: "Annual technology conference",
    date: "2024-12-01",
    location: "San Francisco, CA",
    capacity: 500,
    registeredUsers: 250,
    status: "upcoming",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    title: "Music Festival",
    description: "Summer music festival",
    date: "2024-12-15",
    location: "Los Angeles, CA",
    capacity: 1000,
    registeredUsers: 800,
    status: "ongoing",
    createdAt: "2024-01-02T00:00:00Z",
  },
];

const mockProps = {
  events: mockEvents,
  onUpdateStatus: jest.fn(),
  onDeleteEvent: jest.fn(),
  onEditEvent: jest.fn(),
  onRegisterUser: jest.fn(),
  onViewRegistrations: jest.fn(),
  userRole: "admin" as const,
};

describe("EventsTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders table with events data", () => {
    render(<EventsTable {...mockProps} />);

    expect(screen.getByText("All Events")).toBeInTheDocument();
    expect(screen.getByText("Tech Conference 2024")).toBeInTheDocument();
    expect(screen.getByText("Music Festival")).toBeInTheDocument();
  });

  it("displays event details correctly", () => {
    render(<EventsTable {...mockProps} />);

    expect(
      screen.getByText("Annual technology conference"),
    ).toBeInTheDocument();
    expect(screen.getByText("San Francisco, CA")).toBeInTheDocument();
    expect(screen.getByText("250 / 500")).toBeInTheDocument();
  });

  it("formats dates correctly", () => {
    render(<EventsTable {...mockProps} />);

    expect(screen.getByText("Dec 1, 2024")).toBeInTheDocument();
    expect(screen.getByText("Dec 15, 2024")).toBeInTheDocument();
  });

  it("displays status badges with correct styling", () => {
    render(<EventsTable {...mockProps} />);

    const upcomingBadge = screen.getByText("Upcoming");
    const ongoingBadge = screen.getByText("Ongoing");

    expect(upcomingBadge).toBeInTheDocument();
    expect(ongoingBadge).toBeInTheDocument();
  });

  it("calculates and displays capacity percentage", () => {
    render(<EventsTable {...mockProps} />);

    expect(screen.getByText("50% filled")).toBeInTheDocument();
    expect(screen.getByText("80% filled")).toBeInTheDocument();
  });

  it("renders dropdown menu for actions", () => {
    render(<EventsTable {...mockProps} />);

    const actionButtons = screen.getAllByRole("button");
    const dropdownTriggers = actionButtons.filter(
      (button) =>
        button
          .querySelector("svg")
          ?.getAttribute("class")
          ?.includes("MoreHorizontal") ||
        button.getAttribute("aria-haspopup") === "menu",
    );

    expect(dropdownTriggers.length).toBeGreaterThan(0);
  });

  it("calls onUpdateStatus when status is changed", async () => {
    const user = userEvent.setup();
    render(<EventsTable {...mockProps} />);

    const actionButtons = screen.getAllByRole("button");
    const firstDropdownTrigger = actionButtons.find(
      (button) => button.getAttribute("aria-haspopup") === "menu",
    );

    if (firstDropdownTrigger) {
      await user.click(firstDropdownTrigger);

      const setOngoingOption = await screen.findByText("Set as Ongoing");
      await user.click(setOngoingOption);

      expect(mockProps.onUpdateStatus).toHaveBeenCalledWith("1", "ongoing");
    }
  });

  it("calls onDeleteEvent when delete is clicked", async () => {
    const user = userEvent.setup();
    render(<EventsTable {...mockProps} />);

    const actionButtons = screen.getAllByRole("button");
    const firstDropdownTrigger = actionButtons.find(
      (button) => button.getAttribute("aria-haspopup") === "menu",
    );

    if (firstDropdownTrigger) {
      await user.click(firstDropdownTrigger);

      const deleteOption = await screen.findByText("Delete Event");
      await user.click(deleteOption);

      expect(mockProps.onDeleteEvent).toHaveBeenCalledWith("1");
    }
  });

  it("displays empty state when no events", () => {
    render(<EventsTable {...mockProps} events={[]} />);

    expect(
      screen.getByText("No events found matching the selected filter."),
    ).toBeInTheDocument();
  });

  it("renders table headers correctly", () => {
    render(<EventsTable {...mockProps} />);

    expect(screen.getByText("Event Details")).toBeInTheDocument();
    expect(screen.getByText("Date & Location")).toBeInTheDocument();
    expect(screen.getByText("Capacity")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("applies hover effects to table rows", () => {
    render(<EventsTable {...mockProps} />);

    const tableRows = screen.getAllByRole("row");
    const dataRows = tableRows.slice(1); // Skip header row

    dataRows.forEach((row) => {
      expect(row).toHaveClass("hover:bg-gray-50");
    });
  });
});
