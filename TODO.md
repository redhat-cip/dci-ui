# TODO

- Replace user.team by user.teams (Need API change)
- Ask for embed topic in https://api.distributed-ci.io/api/v1/components/:id
  Needed to display Topic name instead of Topic Id in the component detail page src/component/ComponentPage.tsx
- Replace sortedUniq from lodash with [...new Set(array)]
- Replace query-string by qs
- Replace axios-mock-adapter by msw
- After an error on the login page, and a successful connection (the user fix a bad password), we should hide all alerts