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

class Ctrl {
  $onInit() {
    this.percentageTested = this.calcPercentageTested(this.topic.components);
    this.percentageBefore2days = this.calcPercentageBefore2days(
      this.topic.components
    );
  }

  calcPercentageBefore2days(components) {
    let count = 0;
    let numberBefore2Day = 0;
    components
      .filter(function(component) {
        return component.values.length > 0;
      })
      .forEach(function(component) {
        count += 1;
        const twoDays = 2 * 24 * 60 * 60;
        const firstRunDuration = component.values[0];
        if (firstRunDuration < twoDays) {
          numberBefore2Day += 1;
        }
      });
    if(count === 0){
      return 0
    }
    return Math.round(numberBefore2Day * 100 / count);
  }

  calcPercentageTested(components) {
    let count = 0;
    let tested = 0;
    components.forEach(function(component) {
      count += 1;
      if (component.values.length > 0) {
        tested += 1;
      }
    });
    if(count === 0){
      return 0
    }
    return Math.round(tested * 100 / count);
  }
}

export default Ctrl;
