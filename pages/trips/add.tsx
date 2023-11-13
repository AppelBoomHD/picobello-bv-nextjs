import { Layout } from "components/layout";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";

interface AddTripProps {}

type Inputs = {
  description: string;
  start: string;
  stops: string;
};

export default function AddTrip({ ...props }: AddTripProps) {
  const router = useRouter();

  const { register, handleSubmit } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data.stops.split(","));
    const response = await fetch("/api/trips/add", {
      method: "POST",
      body: JSON.stringify({
        ...data,
        start: Math.floor(new Date(data.start).getTime() / 1000),
        stops: data.stops.split(","),
      }),
    });

    if (response.ok) {
      return router.push("/trips");
    }
  };

  return (
    <Layout>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-1/2">
        <h2 className="font-bold">Description</h2>
        <input {...register("description")} />
        <h2 className="font-bold">Start time</h2>
        <input type="datetime-local" {...register("start")} />
        <h2 className="font-bold">Stops</h2>
        <input {...register("stops")} />
        <button type="submit">Submit</button>
      </form>
    </Layout>
  );
}
