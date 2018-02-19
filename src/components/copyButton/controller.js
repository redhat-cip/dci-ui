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
import copy from "copy-text-to-clipboard";

class Ctrl {
  constructor($scope) {
    this.$scope = $scope;
  }

  $onInit() {
    this.title = this.before;
    this.position = this.position || "up";
  }
  copyTxt() {
    copy(this.txt);
    this.title = this.after;
    setTimeout(() => {
      this.title = this.before;
      this.$scope.$apply();
    }, 2000);
  }
}

Ctrl.$inject = ["$scope", "$ngRedux"];

export default Ctrl;
