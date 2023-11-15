import { JsonApiResourceWithPath } from "next-drupal";

export interface DrupalTrip extends JsonApiResourceWithPath {
  id: string;
  drupal_internal__id: number;
  type: string;
  completed: boolean;
  start: string;
  created: string;
  changed: string;
  stops: DrupalStop[]?;
}

export interface DrupalStop extends JsonApiResourceWithPath {
  type: string;
  id: string;
  drupal_internal__id: number;
  postal_code: string;
  house_number: string;
  delivered: boolean;
  created: string;
  changed: string;
}

export interface DrupalOrder extends JsonApiResourceWithPath {
  type: string;
  id: string;
  drupal_internal__id: number;
  created: string;
  changed: string;
}
