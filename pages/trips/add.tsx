import { Layout } from "components/layout";
import { drupal } from "lib/drupal";
import { GetStaticPropsResult } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Select from "react-select";
import { DrupalStop, DrupalTrip } from "types/drupal";

interface AddTripProps {
  stops: DrupalStop[];
}

type Inputs = {
  description: string;
  start: string;
  stops: {};
};

export default function AddTrip({ stops, ...props }: AddTripProps) {
  const router = useRouter();

  const { register, handleSubmit, control } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const response = await fetch("/api/trips/add", {
      method: "POST",
      body: JSON.stringify({
        ...data,
        start: Math.floor(new Date(data.start).getTime() / 1000),
      }),
    });

    if (response.ok) {
      return router.push("/trips");
    }
  };

  return (
    <Layout>
      <h1 className="text-6xl font-black mb-10">New trip.</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-1/2 gap-2"
      >
        <h2 className="font-bold text-xl mt-4">Description</h2>
        <input
          placeholder="Description"
          className="border-2 py-0.5 px-2 rounded-md hover:border-blue-500 outline-blue-500"
          {...register("description")}
        />
        <h2 className="font-bold text-xl mt-4">Start time</h2>
        <input
          className="border-2 py-0.5 px-2 rounded-md hover:border-blue-500 outline-blue-500"
          type="datetime-local"
          {...register("start")}
        />
        <h2 className="font-bold text-xl mt-4">Stops</h2>
        <Controller
          name="stops"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              isMulti
              options={stops.map((stop) => ({
                value: stop.id,
                label: stop.drupal_internal__id,
              }))}
            />
          )}
        />
        <button
          className="mt-4 mx-auto bg-blue-600 hover:bg-blue-500 rounded-xl py-3 px-4 font-bold text-white border border-black"
          type="submit"
        >
          Submit
        </button>
      </form>
    </Layout>
  );
}

export async function getStaticProps(
  context
): Promise<GetStaticPropsResult<AddTripProps>> {
  const stops = await drupal.getResourceCollectionFromContext<DrupalStop[]>(
    "trip_admin_stop--trip_admin_stop",
    context,
    {
      params: {
        "fields[trip_admin_stop]": "drupal_internal_id,id",
        sort: "created",
      },
      withAuth: true,
    }
  );

  return {
    props: {
      stops,
    },
  };
}
