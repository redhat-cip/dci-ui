// Copyright 2017 Red Hat, Inc.
//
// Licensed under the Apache License, Version 2.0 (the 'License'); you may
// not use this file except in compliance with the License. You may obtain
// a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

export function get_teams_from_remotecis(remotecis) {
  const teams_ids = {};
  remotecis.forEach(remoteci => {
    const team_id = remoteci.team.id;
    if (typeof teams_ids[team_id] === "undefined") {
      teams_ids[team_id] = Object.assign({}, remoteci.team);
    }
    delete remoteci["team"];
    if (typeof teams_ids[team_id].remotecis === "undefined") {
      teams_ids[team_id].remotecis = [remoteci];
    } else {
      teams_ids[team_id].remotecis.push(remoteci);
    }
  });
  return Object.keys(teams_ids).map(function(team_id) {
    return teams_ids[team_id];
  });
}

export function order(teams) {
  return teams.sort(function(team1, team2) {
    let team1_name = team1.name.toLowerCase();
    let team2_name = team2.name.toLowerCase();
    if (team1_name < team2_name) return -1;
    if (team1_name > team2_name) return 1;
    return 0;
  });
}
