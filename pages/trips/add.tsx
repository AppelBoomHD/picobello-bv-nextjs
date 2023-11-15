import { ErrorMessage } from "@hookform/error-message";
import { Layout } from "components/layout";
import { drupal } from "lib/drupal";
import { GetStaticPropsResult } from "next";
import { useRouter } from "next/router";
import {
  Controller,
  SubmitHandler,
  set,
  useFieldArray,
  useForm,
} from "react-hook-form";
import Select from "react-select";
import { DrupalOrder, DrupalStop } from "types/drupal";

interface AddTripProps {
  stops: DrupalStop[];
  orders: DrupalOrder[];
}

export default function AddTrip({ stops, orders, ...props }: AddTripProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    control,
  } = useForm<AddTripInputs>();
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control,
      name: "addedStops",
    }
  );
  const onSubmit: SubmitHandler<AddTripInputs> = async (data) => {
    const response = await fetch("/api/trips/add", {
      method: "POST",
      body: JSON.stringify({
        ...data,
        start: Math.floor(new Date(data.start).getTime() / 1000),
      }),
    });

    if (response.ok) {
      return router.push("/trips");
    } else {
      setError("root.serverError", (await response.json()).error);
    }
  };

  return (
    <Layout>
      <h1 className="text-6xl font-black mb-10">New trip.</h1>
      <ErrorMessage
        errors={errors}
        name="root.serverError"
        render={({ message }) => (
          <div className="bg-red-600 rounded-md px-4 py-2 border border-black w-1/2 text-white">
            {message}
          </div>
        )}
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-1/2 gap-2"
      >
        <h2 className="font-bold text-xl mt-4">Description</h2>
        <input
          required
          placeholder="Description"
          className="border-2 py-0.5 px-2 rounded-md hover:border-blue-500 outline-blue-500"
          {...register("description")}
        />
        <h2 className="font-bold text-xl mt-4">Start time</h2>
        <input
          required
          className="border-2 py-0.5 px-2 rounded-md hover:border-blue-500 outline-blue-500"
          type="datetime-local"
          {...register("start")}
        />
        <h2 className="font-bold text-xl mt-4">Stops</h2>
        <h3 className="font-bold text-l">Existing stops</h3>
        <Controller
          name="stops"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              placeholder="Postal code"
              isMulti
              options={stops.map((stop) => ({
                value: stop.id,
                label: stop.postal_code,
              }))}
            />
          )}
        />
        <h3 className="font-bold text-l">New stops</h3>
        <ul className="space-y-4">
          {fields.map((field, index) => (
            <li
              key={field.id}
              className="flex group items-center justify-between"
            >
              <div className="text-5xl">&#8226;</div>
              <div>
                <h4 className="font-bold text-md">Postal code</h4>
                <input
                  type="text"
                  placeholder="Postal code"
                  className="border-2 py-0.5 px-2 rounded-md hover:border-blue-500 outline-blue-500"
                  {...register(`addedStops.${index}.postal_code`)}
                />
                <h4 className="font-bold text-md">House number</h4>
                <input
                  type="text"
                  placeholder="House number"
                  className="border-2 py-0.5 px-2 rounded-md hover:border-blue-500 outline-blue-500"
                  {...register(`addedStops.${index}.house_number`)}
                />
                <h4 className="font-bold text-md">Order</h4>
                <Controller
                  name={`addedStops.${index}.order`}
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      placeholder="Order number"
                      required
                      options={orders.map((order) => ({
                        value: order.id,
                        label: order.drupal_internal__id,
                      }))}
                    />
                  )}
                />
              </div>
              <div className="space-x-1">
                <button
                  type="button"
                  className="bg-green-600 hover:bg-green-500 rounded-xl w-10 h-10 font-bold text-white border border-black"
                  onClick={() =>
                    append({
                      house_number: "",
                      postal_code: "",
                      order: undefined,
                    })
                  }
                >
                  +
                </button>
                <button
                  className="bg-red-600 hover:bg-red-500 rounded-xl w-10 h-10 font-bold text-white border border-black"
                  type="button"
                  onClick={() => remove(index)}
                >
                  -
                </button>
              </div>
            </li>
          ))}
        </ul>
        {fields.length === 0 && (
          <button
            type="button"
            className="bg-green-600 hover:bg-green-500 rounded-xl w-10 h-10 font-bold text-white border border-black"
            onClick={() =>
              append({ house_number: "", postal_code: "", order: undefined })
            }
          >
            +
          </button>
        )}
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
        "fields[trip_admin_stop]": "postal_code,id",
        sort: "created",
      },
      withAuth: true,
    }
  );

  const orders = await drupal.getResourceCollectionFromContext<DrupalOrder[]>(
    "trip_admin_order--trip_admin_order",
    context,
    {
      params: {
        "fields[trip_admin_order]": "drupal_internal_id,id",
        sort: "created",
      },
      withAuth: true,
    }
  );

  console.log(orders);

  return {
    props: {
      stops,
      orders,
    },
  };
}
