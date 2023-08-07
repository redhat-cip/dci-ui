import type { Meta, StoryObj } from "@storybook/react";
import TeamCreationWizard from "./TeamCreationWizard";
import { Provider } from "react-redux";
import { setupStore } from "store";
import handlers from "mocks/handlers";
import { MemoryRouter } from "react-router-dom";

const store = setupStore();

const meta = {
  title: "TeamCreationWizard",
  component: TeamCreationWizard,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    msw: {
      handlers,
    },
  },
  decorators: [
    (Story) => (
      <Provider store={store}>
        <MemoryRouter>
          <Story />
        </MemoryRouter>
      </Provider>
    ),
  ],
} satisfies Meta<typeof TeamCreationWizard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TeamCreation: Story = {};
