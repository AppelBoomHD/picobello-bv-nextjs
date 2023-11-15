import { drupal } from "lib/drupal";
import type { NextApiRequest, NextApiResponse } from "next";
import { ErrorOption } from "react-hook-form";
import { DrupalStop, DrupalTrip } from "types/drupal";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = JSON.parse(req.body) as AddTripInputs;

  let stopIds: { value: string }[] = [];
  if (body.addedStops && body.addedStops.length > 0) {
    stopIds = await Promise.all(
      body.addedStops.map(async (stop) => {
        const { id } = await drupal.createResource<DrupalStop>(
          "trip_admin_stop--trip_admin_stop",
          {
            data: {
              type: "trip_admin_stop--trip_admin_stop",
              attributes: {
                postal_code: stop.postal_code,
                house_number: stop.house_number,
              },
              relationships: {
                order_id: {
                  data: {
                    type: "trip_admin_order--trip_admin_order",
                    id: stop.order.value,
                  },
                },
              },
            },
          }
        );
        return { value: id };
      })
    );
  }

  try {
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
              //@ts-ignore
              data: [...(body.stops ?? []), ...(stopIds ?? [])].map((stop) => ({
                type: "trip_admin_stop--trip_admin_stop",
                id: stop.value,
              })),
            },
          },
        },
      }
    );

    res.status(200).send({ id: trip.id });
  } catch (err) {
    const errorMessage = err as Error;
    let error: ErrorOption = {};
    if (errorMessage.message.includes("stops: This value should not be null")) {
      error.message = "You need to add at least one stop to your trip!";
      error.type = "required";
    }
    res.status(400).send({ error });
  }
}
