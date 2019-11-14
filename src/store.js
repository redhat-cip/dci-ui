import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import alertsReducer from "./alerts/alertsReducer";
import configReducer from "./config/configReducer";
import currentUserReducer from "./currentUser/currentUserReducer";
import productsReducer from "./products/productsReducer";
import topicsReducer from "./topics/topicsReducer";
import remotecisReducer from "./remotecis/remotecisReducer";
import feedersReducer from "./feeders/feedersReducer";
import teamsReducer from "./teams/teamsReducer";
import usersReducer from "./users/usersReducer";
import jobsReducer from "./jobs/jobsReducer";
import globalStatusReducer from "./stats/globalStatus/globalStatusReducer";
import trendsReducer from "./stats/trends/trendsReducer";

const store = createStore(
  combineReducers({
    alerts: alertsReducer,
    config: configReducer,
    globalStatus: globalStatusReducer,
    currentUser: currentUserReducer,
    jobs: jobsReducer,
    products: productsReducer,
    topics: topicsReducer,
    feeders: feedersReducer,
    remotecis: remotecisReducer,
    teams: teamsReducer,
    users: usersReducer,
    trends: trendsReducer
  }),
  applyMiddleware(thunk)
);

export default store;
