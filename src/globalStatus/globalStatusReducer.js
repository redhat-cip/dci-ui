import * as types from "./globalStatusActionsTypes";

export function orderGlobalStatus(stats) {
  const topics = [
    "RDO-Newton",
    "RDO-Ocata",
    "RDO-Pike",
    "RDO-Queens",
    "RDO-Rocky",
    "OSP8",
    "OSP9",
    "OSP10",
    "OSP11",
    "OSP12",
    "OSP13",
    "OSP14"
  ];
  stats
    .sort((stat1, stat2) => {
      const name1 = stat1.topic_name.toLowerCase();
      const name2 = stat2.topic_name.toLowerCase();
      if (name1 < name2) return -1;
      if (name1 > name2) return 1;
      return 0;
    })
    .sort((stat1, stat2) => {
      const index1 = topics.indexOf(stat1.topic_name);
      const index2 = topics.indexOf(stat2.topic_name);
      return index1 < index2;
    });
  return stats;
}

export default function(state = [], action) {
  switch (action.type) {
    case types.SET_GLOBAL_STATUS:
      const globalStatus = orderGlobalStatus(action.globalStatus);
      return [...globalStatus];
    default:
      return state;
  }
}
