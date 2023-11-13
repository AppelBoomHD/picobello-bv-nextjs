import Link from "next/link";

import { formatDate } from "lib/utils";
import { DrupalTrip } from "types/drupal";

interface TripTeaserProps {
  trip: DrupalTrip;
}

export function TripTeaser({ trip, ...props }: TripTeaserProps) {
  return (
    <article {...props}>
      <Link href={trip.path.alias} className="no-underline hover:text-blue-600">
        <div className="flex mb-4 text-4xl font-bold space-x-2">
          <h2>Trip {trip.drupal_internal__id}</h2>
          <div title={trip.completed ? "Completed" : "Not completed"}>
            {trip.completed ? "✅" : "🚙"}
          </div>
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: trip.description?.processed }}
        />
      </Link>
      <div className="mb-4 text-gray-600">
        <span> {formatDate(trip.created)}</span>
      </div>
      <Link
        href={trip.path.alias}
        className="inline-flex items-center px-6 py-2 border border-gray-600 rounded-full hover:bg-gray-100"
      >
        Show trip
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 ml-2"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </Link>
    </article>
  );
}
