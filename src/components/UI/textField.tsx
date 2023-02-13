import { TextField as TextFieldMUI } from "@mui/material";
import { ChangeEvent, FunctionComponent } from "react";

type TextFieldProps = {
  error?: boolean;
  label: string;
  id?: string;
  helperText?: string;
  defaultValue?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  type?: string;
  className?: string;
};

const TextField: FunctionComponent<TextFieldProps> = ({
  error,
  label,
  id,
  helperText,
  defaultValue,
  onChange,
  required,
  ...props
}) => {
  return (
    <TextFieldMUI
      error={error}
      fullWidth
      label={label}
      id={id || "outlined-basic"}
      helperText={helperText}
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
