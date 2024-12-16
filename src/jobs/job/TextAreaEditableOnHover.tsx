import { useState } from "react";
import * as React from "react";
import {
  Button,
  Form,
  InputGroup,
  InputGroupItem,
  TextArea,
} from "@patternfly/react-core";
import { TimesIcon, CheckIcon } from "@patternfly/react-icons";
import * as Yup from "yup";
import styled from "styled-components";
import {
  t_global_border_color_100,
  t_global_border_color_hover,
} from "@patternfly/react-tokens";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

interface TextAreaEditableOnHoverProps {
  text: string;
  onSubmit: (text: string) => void;
  children: React.ReactNode;
  [x: string]: any;
}

const TextAreaEditableOnHoverSchema = Yup.object().shape({
  text: Yup.string(),
});

const TextAreaEditable = styled.div`
  width: 100%;
  min-height: 56px;
  cursor: text;
  font-size: 0.8em;
  border: 1px solid ${t_global_border_color_100.value};
  border-radius: 5px;
  padding: 0.2em;
`;

export default function TextAreaEditableOnHover({
  text,
  onSubmit,
  children,
  ...props
}: TextAreaEditableOnHoverProps) {
  const [editModeOn, setEditModeOne] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { isValid, isDirty },
  } = useForm<{ text?: string }>({
    resolver: yupResolver(TextAreaEditableOnHoverSchema),
  });

  return editModeOn ? (
    <Form
      onSubmit={handleSubmit(({ text }) => {
        setEditModeOne(false);
        if (text) {
          onSubmit(text);
        }
      })}
      {...props}
    >
      <div>
        <div>
          <TextArea
            id="text"
            style={{
              width: "100%",
              maxWidth: "100%",
              resize: "none",
              padding: "0.25em 0.3em",
              outline: "none",
              borderColor: t_global_border_color_hover.value,
              borderRadius: "5px",
              minHeight: "56px",
              fontSize: "0.8em",
            }}
            defaultValue={text}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            {...register("text")}
          />
        </div>
        <InputGroup className="pf-v6-u-mt-xs">
          <InputGroupItem>
            <Button
              icon={<CheckIcon />}
              variant="control"
              size="sm"
              type="submit"
              isInline
              isDisabled={!(isValid && isDirty)}
            ></Button>
          </InputGroupItem>
          <InputGroupItem>
            <Button
              icon={<TimesIcon />}
              variant="control"
              size="sm"
              type="button"
              isInline
              onClick={() => setEditModeOne(false)}
              className="pf-v6-u-ml-xs"
            ></Button>
          </InputGroupItem>
        </InputGroup>
      </div>
    </Form>
  ) : (
    <TextAreaEditable
      {...props}
      onClick={() => {
        setEditModeOne(true);
      }}
    >
      {children}
    </TextAreaEditable>
  );
}
