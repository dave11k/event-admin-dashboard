import { createClient } from "@/lib/supabase/server";

export default async function TestPage() {
  const supabase = await createClient();

  try {
    // Test database connection by fetching events
    const { data: events, error } = await supabase
      .from("events")
      .select("*")
      .limit(5);

    if (error) {
      throw error;
    }

    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Database Connection Test</h1>

        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          ✅ Successfully connected to Supabase!
        </div>

        <h2 className="text-xl font-semibold mb-2">Events from Database:</h2>
        <div className="space-y-2">
          {events?.map((event) => (
            <div key={event.id} className="bg-white p-4 rounded border">
              <h3 className="font-semibold">{event.title}</h3>
              <p className="text-gray-600">{event.description}</p>
              <p className="text-sm text-gray-500">
                {new Date(event.date).toLocaleDateString()} - {event.location}
              </p>
              <p className="text-sm">
                Status: <span className="font-medium">{event.status}</span> |
                Capacity: <span className="font-medium">{event.capacity}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Database Connection Test</h1>

        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          ❌ Database connection failed: {errorMessage}
        </div>
      </div>
    );
  }
}
