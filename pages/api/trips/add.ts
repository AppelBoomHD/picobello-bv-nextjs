import { drupal } from "lib/drupal";
import type { NextApiRequest, NextApiResponse } from "next";
import { DrupalTrip } from "types/drupal";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = JSON.parse(req.body);

  console.log(
    body.stops.map((id) => ({
      data: {
        type: "trip_admin_stop--trip_admin_stop",
        id,
      },
    }))
  );

  const trip = await drupal.createResource<DrupalTrip>(
    "trip_admin_trip--trip_admin_trip",
    {
      data: {
        type: "trip_admin_trip--trip_admin_trip",
        attributes: {
          start: body.start,
          description: {
            value: body.description,
            format: "plain_text",
          },
        },
        relationships: {
          stops: {
            data: body.stops.map((stop) => ({
              type: "trip_admin_stop--trip_admin_stop",
              id: stop.value,
            })),
          },
        },
      },
    }
  );

  res.status(200).send({ id: trip.id });
}
