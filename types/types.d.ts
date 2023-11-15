type AddTripInputs = {
  description: string;
  start: string;
  stops: { value: string; label: string }[];
  addedStops: (Pick<DrupalStop, "postal_code" | "house_number"> & {
    order: { value: string; label: number };
  })[];
};
