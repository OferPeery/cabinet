import { useRegisterUser } from "../context/UserContext";
import Joi from "joi";
import { Checkbox, FormGroup, Stack } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import useForm from "./Form/useForm";
import InputText from "./Form/InputText";
import InputPassword from "./Form/InputPassword";

const minCharacters = 3;
const maxCharacters = 30;
const stringSchema = Joi.string().min(minCharacters).max(maxCharacters);

const nameSchema = stringSchema
  .pattern(/^[a-zA-Z \-\']+$/, "characters")
  .messages({
    "string.pattern.name":
      "{{#label}} must only contain english letters, space or dash",
  });

const firstNameSchema = nameSchema.label("First Name").required();

const lastNameSchema = nameSchema.label("Last Name").required();

const emailSchema = Joi.string()
  .label("Email")
  .required()
  .email({ tlds: { allow: false } });

const usernameSchema = stringSchema.label("Username").required().alphanum();

const passwordSchema = stringSchema
  .label("Password")
  .required()
  .pattern(/^[a-zA-Z0-9!@#$%^&*]+$/, "characters")
  .messages({
    "string.pattern.name":
      "{{#label}} must only contain characters, digits, and special characters",
  });

const schema = Joi.object({
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
  isRememberMe: Joi.boolean(),
});

const RegisterForm = () => {
  const { handleRegister, errorRegister } = useRegisterUser();
  const initialData = {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    isRememberMe: false,
  };

  const { renderInput, renderInputControl, renderButtonSumbit } = useForm(
    initialData,
    schema,
    handleRegister
  );

  return (
    <form>
      <FormGroup>
        <Stack direction="row">
          {renderInput(InputText, "firstName", "First Name")}
          {renderInput(InputText, "lastName", "Last Name")}
        </Stack>
        <Stack direction="row">
          {renderInput(InputText, "username", "Username")}
          {renderInput(InputText, "email", "Email")}
        </Stack>
        {renderInput(InputPassword, "password", "New Password")}
        {renderInputControl(Checkbox, "isRememberMe", "Remember Me")}
        {renderButtonSumbit(LoginIcon, "Sign Up and Login", errorRegister)}
      </FormGroup>
    </form>
  );
};

export default RegisterForm;
