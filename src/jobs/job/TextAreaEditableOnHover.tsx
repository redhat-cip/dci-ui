import { useState } from "react";
import * as React from "react";
import { Button, InputGroup, InputGroupItem } from "@patternfly/react-core";
import { TimesIcon, CheckIcon } from "@patternfly/react-icons";
import * as Yup from "yup";
import { Form, Formik, Field } from "formik";
import styled from "styled-components";
import {
  t_global_border_color_100,
  t_global_border_color_hover,
} from "@patternfly/react-tokens";

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
  return editModeOn ? (
    <Formik
      initialValues={{ text }}
      validationSchema={TextAreaEditableOnHoverSchema}
      onSubmit={(v) => {
        setEditModeOne(false);
        onSubmit(v.text);
      }}
    >
      {({ isValid, dirty }) => (
        <Form {...props}>
          <div>
            <div>
              <Field
                id="text"
                name="text"
                as="textarea"
                style={{
                  width: "100%",
                  maxWidth: "100%",
                  resize: "none",
                  padding: "0.2em",
                  outline: "none",
                  borderColor: t_global_border_color_hover.value,
                  borderRadius: "5px",
                }}
                cols={50}
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
              />
            </div>
            <InputGroup>
              <InputGroupItem>
                <Button
                  icon={<CheckIcon />}
                  variant="primary"
                  type="submit"
                  isInline
                  isDisabled={!(isValid && dirty)}
                ></Button>
              </InputGroupItem>
              <InputGroupItem>
                <Button
                  icon={<TimesIcon />}
                  variant="secondary"
                  type="button"
                  isInline
                  onClick={() => setEditModeOne(false)}
                  className="pf-v6-u-ml-xs"
                ></Button>
              </InputGroupItem>
            </InputGroup>
          </div>
        </Form>
      )}
    </Formik>
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
