import { DrupalTrip } from "types/drupal";

import { formatDate } from "lib/utils";

interface TripProps {
  trip: DrupalTrip;
}

export function Trip({ trip, ...props }: TripProps) {
  return (
    <article {...props}>
      <h1 className="mb-4 text-6xl font-black leading-tight">
        Trip {trip.drupal_internal__id}
      </h1>
      <div className="mb-4 text-gray-600">
        <span> {formatDate(trip.created)}</span>
      </div>
      {trip.description?.processed && (
        <div
          dangerouslySetInnerHTML={{ __html: trip.description?.processed }}
          className="mt-6 font-serif text-xl leading-loose prose"
        />
      )}
      <div>{trip.completed ? "Completed" : "Not completed"}</div>
      <div>
        {trip.stops?.map((stop) => (
          <div key={stop.id}>Stop {stop.drupal_internal__id}</div>
        ))}
      </div>
    </article>
  );
}
