import { TextField as TextFieldMUI } from "@mui/material";
import { FunctionComponent, ReactNode } from "react";
type TextFieldProps = {
  label: string;
  id?: string;
  defaultValue?: string;
  onChange?: (e: any) => void;
  required?: boolean;
  [key: string]: any;
};

const TextField: FunctionComponent<TextFieldProps> = ({
  label,
  id,
  defaultValue,
  onChange,
  required,
  ...props
}) => {
  return (
    <TextFieldMUI
      fullWidth
      label={label}
      id={id || "outlined-basic"}
      defaultValue={defaultValue}
      variant="outlined"
      onChange={onChange || (() => {})}
      color="secondary"
      required={required}
      {...props}
      key={label + defaultValue}
    />
  );
};

export default TextField;
