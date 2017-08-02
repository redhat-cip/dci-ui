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

import api from "services/api";

class Ctrl {
  constructor($scope, $ngRedux) {
    this.$ngRedux = $ngRedux;
    let unsubscribe = $ngRedux.connect(state => state)(this);
    $scope.$on("$destroy", unsubscribe);
  }

  $onInit() {
    this.$ngRedux.dispatch(api("team").allIfNeeded());
    this.$ngRedux.dispatch(api("role").allIfNeeded()).then(response => {
      this.user.role_id = this.getIdOfRoleUSER(response.data.roles);
    });
  }

  getIdOfRoleUSER(roles) {
    let user_role_id = null;
    for (let i = 0; i < roles.length; i++) {
      const role = roles[i];
      if (role.label === "USER") {
        user_role_id = role.id;
      }
    }
    return user_role_id;
  }
}

Ctrl.$inject = ["$scope", "$ngRedux"];

export default Ctrl;
