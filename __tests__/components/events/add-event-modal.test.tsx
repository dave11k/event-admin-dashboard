import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddEventModal } from "@/components/events/add-event-modal";

// Setup global TextEncoder/TextDecoder for Node.js environment
const { TextEncoder, TextDecoder } = require("util");
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock Next.js cache and server actions
jest.mock("next/cache", () => ({
  unstable_cache: jest.fn((fn) => fn),
}));

jest.mock("@/lib/actions/events", () => ({
  addEvent: jest.fn(),
}));

const mockProps = {
  isOpen: true,
  onClose: jest.fn(),
  onSubmit: jest.fn(),
};

describe("AddEventModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders modal when open", () => {
    render(<AddEventModal {...mockProps} />);

    expect(screen.getByText("Create New Event")).toBeInTheDocument();
    expect(screen.getByLabelText(/Event Title/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Event Date/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Location/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Capacity/)).toBeInTheDocument();
  });

  it("does not render modal when closed", () => {
    render(<AddEventModal {...mockProps} isOpen={false} />);

    expect(screen.queryByText("Create New Event")).not.toBeInTheDocument();
  });

  it("shows validation errors for required fields", async () => {
    const user = userEvent.setup();
    render(<AddEventModal {...mockProps} />);

    const submitButton = screen.getByRole("button", { name: /Create Event/ });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Title is required")).toBeInTheDocument();
      expect(screen.getByText("Date is required")).toBeInTheDocument();
      expect(screen.getByText("Location is required")).toBeInTheDocument();
      expect(screen.getByText("Capacity is required")).toBeInTheDocument();
    });
  });

  it("validates future date requirement", async () => {
    const user = userEvent.setup();
    render(<AddEventModal {...mockProps} />);

    const dateInput = screen.getByLabelText(/Event Date/);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toISOString().split("T")[0];

    await user.type(dateInput, yesterdayString);

    const submitButton = screen.getByRole("button", { name: /Create Event/ });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Date must be in the future"),
      ).toBeInTheDocument();
    });
  });

  it("validates capacity is a positive number", async () => {
    const user = userEvent.setup();
    render(<AddEventModal {...mockProps} />);

    // Fill in required fields to focus on capacity validation
    const titleInput = screen.getByLabelText(/Event Title/);
    const dateInput = screen.getByLabelText(/Event Date/);
    const locationInput = screen.getByLabelText(/Location/);
    const capacityInput = screen.getByLabelText(/Capacity/);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowString = tomorrow.toISOString().split("T")[0];

    // Use fireEvent to set values directly
    fireEvent.change(titleInput, { target: { value: "Test Event" } });
    fireEvent.change(dateInput, { target: { value: tomorrowString } });
    fireEvent.change(locationInput, { target: { value: "Test Location" } });
    fireEvent.change(capacityInput, { target: { value: "0" } });

    const submitButton = screen.getByRole("button", { name: /Create Event/ });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Capacity must be greater than 0"),
      ).toBeInTheDocument();
    });
  });

  it("submits form with valid data", async () => {
    const user = userEvent.setup();
    render(<AddEventModal {...mockProps} />);

    const titleInput = screen.getByLabelText(/Event Title/);
    const descriptionInput = screen.getByLabelText(/Description/);
    const dateInput = screen.getByLabelText(/Event Date/);
    const locationInput = screen.getByLabelText(/Location/);
    const capacityInput = screen.getByLabelText(/Capacity/);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowString = tomorrow.toISOString().split("T")[0];

    await user.type(titleInput, "Test Event");
    await user.type(descriptionInput, "Test Description");
    await user.type(dateInput, tomorrowString);
    await user.type(locationInput, "Test Location");
    await user.type(capacityInput, "100");

    const submitButton = screen.getByRole("button", { name: /Create Event/ });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockProps.onSubmit).toHaveBeenCalledWith({
        title: "Test Event",
        description: "Test Description",
        date: tomorrowString,
        location: "Test Location",
        capacity: 100,
        status: "Upcoming",
      });
    });
  });

  it("calls onClose when cancel button is clicked", async () => {
    const user = userEvent.setup();
    render(<AddEventModal {...mockProps} />);

    const cancelButton = screen.getByRole("button", { name: /Cancel/ });
    await user.click(cancelButton);

    expect(mockProps.onClose).toHaveBeenCalled();
  });

  it("clears form data when modal is closed", async () => {
    const user = userEvent.setup();
    render(<AddEventModal {...mockProps} />);

    const titleInput = screen.getByLabelText(/Event Title/);
    await user.type(titleInput, "Test Event");

    const cancelButton = screen.getByRole("button", { name: /Cancel/ });
    await user.click(cancelButton);

    expect(mockProps.onClose).toHaveBeenCalled();
  });

  it("enables submit button initially", () => {
    render(<AddEventModal {...mockProps} />);

    const submitButton = screen.getByRole("button", { name: /Create Event/ });
    expect(submitButton).toBeEnabled();
  });

  it("enables submit button when form is valid", async () => {
    const user = userEvent.setup();
    render(<AddEventModal {...mockProps} />);

    const titleInput = screen.getByLabelText(/Event Title/);
    const dateInput = screen.getByLabelText(/Event Date/);
    const locationInput = screen.getByLabelText(/Location/);
    const capacityInput = screen.getByLabelText(/Capacity/);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowString = tomorrow.toISOString().split("T")[0];

    await user.type(titleInput, "Test Event");
    await user.type(dateInput, tomorrowString);
    await user.type(locationInput, "Test Location");
    await user.type(capacityInput, "100");

    const submitButton = screen.getByRole("button", { name: /Create Event/ });
    expect(submitButton).toBeEnabled();
  });

  it("shows loading state during form submission", async () => {
    const user = userEvent.setup();
    render(<AddEventModal {...mockProps} />);

    const titleInput = screen.getByLabelText(/Event Title/);
    const dateInput = screen.getByLabelText(/Event Date/);
    const locationInput = screen.getByLabelText(/Location/);
    const capacityInput = screen.getByLabelText(/Capacity/);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowString = tomorrow.toISOString().split("T")[0];

    await user.type(titleInput, "Test Event");
    await user.type(dateInput, tomorrowString);
    await user.type(locationInput, "Test Location");
    await user.type(capacityInput, "100");

    const submitButton = screen.getByRole("button", { name: /Create Event/ });
    await user.click(submitButton);

    expect(screen.getByText("Creating...")).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it("clears field errors when user starts typing", async () => {
    const user = userEvent.setup();
    render(<AddEventModal {...mockProps} />);

    const submitButton = screen.getByRole("button", { name: /Create Event/ });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Title is required")).toBeInTheDocument();
    });

    const titleInput = screen.getByLabelText(/Event Title/);
    await user.type(titleInput, "T");

    await waitFor(() => {
      expect(screen.queryByText("Title is required")).not.toBeInTheDocument();
    });
  });
});
