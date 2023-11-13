import { DrupalTrip } from "types/drupal";

import { formatDate } from "lib/utils";

import Checkmark from "../public/icons/checkmark.svg";
import Clock from "../public/icons/clock.svg";

interface TripProps {
  trip: DrupalTrip;
}

export function Trip({ trip, ...props }: TripProps) {
  return (
    <article {...props} className="space-y-4">
      <div className="flex mb-4 text-6xl leading-tight space-x-4">
        <h1 className="font-black">Trip {trip.drupal_internal__id}</h1>
        <div
          className="cursor-default"
          title={trip.completed ? "Completed" : "Not completed"}
        >
          {trip.completed ? "✅" : "🚙"}
        </div>
      </div>
      <div className="mb-4 text-gray-600">
        <span> {formatDate(trip.created)}</span>
      </div>
      {trip.description?.processed && (
        <div
          dangerouslySetInnerHTML={{ __html: trip.description?.processed }}
          className="mt-6 font-serif text-xl leading-loose prose"
        />
      )}
      <div>
        {trip.stops.length > 0 && (
          <>
            <h2 className="text-xl font-bold">Stops</h2>
            <ul className="mt-4">
              {trip.stops.map((stop) => (
                <li key={stop.id} className="group flex">
                  <div>
                    <div className="flex items-start">
                      <div className="group-last:h-1.5 group-only:rounded-l-lg h-32 w-1.5 bg-blue-500 group-first:rounded-tl-lg group-last:rounded-bl-lg" />
                      <div
                        className={`w-16 h-1.5 bg-gradient-to-r to-50% from-blue-500 ${
                          stop.delivered ? "to-green-600" : "to-yellow-300"
                        }`}
                      />
                      <div
                        className="w-8 h-8 -mt-3 -ml-1 mr-2 fill-white"
                        title={stop.delivered ? "Delivered" : "In delivery"}
                      >
                        {stop.delivered ? (
                          <Checkmark className="p-1.5 bg-green-600 rounded-full" />
                        ) : (
                          <Clock className="p-1 bg-yellow-300 rounded-full" />
                        )}
                      </div>

                      <div className="flex flex-col -mt-2">
                        <div className="font-bold">
                          Stop {stop.drupal_internal__id}
                        </div>

                        <div>
                          <div>Postal code: {stop.postal_code}</div>
                          <div>House number: {stop.house_number}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </article>
  );
}
