module.exports = function(browser) {
  return {
    goAndWaitH1(id, h1) {
      // "navbar-utility__settings-link"
      // "navbar-utility__logout-link"
      // "navbar-primary__jobs-link"
      // "navbar-secondary__job-states-link"
      // "navbar-secondary__job-tests-link"
      // "navbar-secondary__job-issues-link"
      // "navbar-secondary__job-files-link"
      // "navbar-primary__components-link"
      // "navbar-primary__global-status-link"
      // "navbar-primary__metrics-link"
      // "navbar-primary__admin-users-link"
      // "navbar-secondary__admin-users-link"
      // "navbar-secondary__admin-teams-link"
      // "navbar-secondary__admin-topics-link"
      // "navbar-secondary__admin-remotecis-link"
      // "navbar-secondary__admin-products-link"
      // "navbar-primary__settings-link"
      // "navbar-secondary__user-settings-link"
      // "navbar-secondary__change-password-link"
      // "navbar-secondary__notification-link"
      browser
        .waitForElementVisible(id)
        .click(id)
        .useXpath()
        .waitForElementVisible("//h1[starts-with(normalize-space(.),'" + h1 + "')]")
        .useCss();
      return this;
    },
    go(id) {
      browser
        .waitForElementVisible(id)
        .click(id);
      return this;
    },
    changePassword(currentPassword, newPassword) {
      browser
        .waitForElementVisible("#current_password")
        .setValue("#current_password", currentPassword)
        .setValue("#new_password", newPassword)
        .setValue("#new_password2", newPassword)
        .waitForElementVisible("#changePasswordButton")
        .click("#changePasswordButton");
      return this;
    },
    login(user = 'admin', password = 'admin') {
      browser
        .url(browser.launch_url)
        .waitForElementVisible("#inputUsername")
        .pause(1000)
        .setValue("#inputUsername", user)
        .setValue("#inputPassword", password)
        .waitForElementVisible("#logInButton")
        .click("#logInButton")
        .waitForElementVisible("job-summary")
        .pause(300)
        .waitForElementVisible("h1")
        .assert.containsText("h1", "Dashboard");
      return this;
    },
    logout() {
      browser
        .waitForElementVisible("#navbar-utility__logout-link")
        .click("#navbar-utility__logout-link")
        .pause(1000)
        .refresh();
      return this;
    },
    end() {
      browser.end()
    }
  }
};
