import Button from "./button";
import PageHeader from "./pageHeader";


export default function EventsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Campus Events"
        description="View and manage campus events."
        action={
          <Button>
            Create Event
          </Button>
        }
      />

      {/* Event list ivide varum */}
    </div>
  );
}