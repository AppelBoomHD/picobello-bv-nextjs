import { GetStaticPropsResult } from "next";

import { drupal } from "lib/drupal";
import { Layout } from "components/layout";
import { TripTeaser } from "components/trip--teaser";
import { DrupalTrip } from "types/drupal";
import Link from "next/link";

interface TripsPageProps {
  trips: DrupalTrip[];
}

export default function IndexPage({ trips }: TripsPageProps) {
  return (
    <Layout>
      <div>
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-6xl font-black">Latest trips.</h1>
          <Link
            className="bg-blue-500 rounded-xl py-3 px-4 font-bold text-white"
            href={"/trips/add"}
          >
            New Trip +
          </Link>
        </div>
        {trips?.length ? (
          trips.map((trip) => (
            <div key={trip.id}>
              <TripTeaser trip={trip} />
              <hr className="my-20" />
            </div>
          ))
        ) : (
          <p className="py-4">No trips found</p>
        )}
      </div>
    </Layout>
  );
}

export async function getStaticProps(
  context
): Promise<GetStaticPropsResult<TripsPageProps>> {
  const trips = await drupal.getResourceCollectionFromContext<DrupalTrip[]>(
    "trip_admin_trip--trip_admin_trip",
    context,
    {
      params: {
        "fields[trip_admin_trip]": "description,created",
        sort: "-created",
      },
      withAuth: true,
    }
  );

  return {
    props: {
      trips,
    },
  };
}
