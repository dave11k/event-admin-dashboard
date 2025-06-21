import { render, screen } from "@testing-library/react";
import { MetricCards } from "@/components/dashboard/metric-cards";
import { DashboardMetrics } from "@/lib/queries/dashboard";

const mockMetrics: DashboardMetrics = {
  totalEvents: 24,
  upcomingEvents: 8,
  totalUsers: 1247,
  estimatedRevenue: 12470,
};

describe("MetricCards", () => {
  it("renders all metric cards", () => {
    render(<MetricCards metrics={mockMetrics} />);

    expect(screen.getByText("Total Events")).toBeInTheDocument();
    expect(screen.getByText("Upcoming Events")).toBeInTheDocument();
    expect(screen.getByText("Total Registered Users")).toBeInTheDocument();
    expect(screen.getByText("Estimated Revenue")).toBeInTheDocument();
  });

  it("displays correct metric values", () => {
    render(<MetricCards metrics={mockMetrics} />);

    expect(screen.getByText("24")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.getByText("1,247")).toBeInTheDocument();
    expect(screen.getByText("$12,470")).toBeInTheDocument();
  });

  it("renders with proper grid layout", () => {
    const { container } = render(<MetricCards metrics={mockMetrics} />);
    const gridContainer = container.firstChild;
    expect(gridContainer).toHaveClass(
      "grid",
      "grid-cols-1",
      "md:grid-cols-2",
      "lg:grid-cols-4",
      "gap-6",
    );
  });

  it("applies gradient backgrounds to cards", () => {
    const { container } = render(<MetricCards metrics={mockMetrics} />);
    const cards = container.querySelectorAll(".bg-gradient-to-br");
    expect(cards).toHaveLength(4);
  });

  it("renders icons for each metric", () => {
    const { container } = render(<MetricCards metrics={mockMetrics} />);
    const icons = container.querySelectorAll("svg");
    expect(icons).toHaveLength(4);
  });

  it("has hover effects on cards", () => {
    const { container } = render(<MetricCards metrics={mockMetrics} />);
    const cards = container.querySelectorAll(".hover\\:shadow-xl");
    expect(cards).toHaveLength(4);
  });

  it("formats large numbers correctly", () => {
    render(<MetricCards metrics={mockMetrics} />);

    expect(screen.getByText("1,247")).toBeInTheDocument();
    expect(screen.getByText("$12,470")).toBeInTheDocument();
  });
});
