import { createSelector } from "reselect";
import { sortBy } from "lodash";
import { getTimezone } from "currentUser/currentUserSelectors";
import { fromNow } from "services/date";

export const getComponentsById = state => state.components.byId;
export const getComponentsAllIds = state => state.components.allIds;
export const getComponents = createSelector(
  getTimezone,
  getComponentsById,
  getComponentsAllIds,
  (timezone, components, componentsAllIds) =>
    sortBy(
      componentsAllIds.map(id => {
        const component = components[id];
        return {
          ...component,
          parent_component: components[component.parent_id],
          from_now: fromNow(component.created_at, timezone)
        };
      }),
      [e => e.name.toLowerCase()]
    )
);
