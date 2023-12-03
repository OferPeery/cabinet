import { useLoginUser } from "../context/UserContext";
import Joi from "joi";
import { Checkbox, FormGroup } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import useForm from "./Form/useForm";
import InputText from "./Form/InputText";
import InputPassword from "./Form/InputPassword";

const schema = Joi.object({
  username: Joi.string().required().label("Username"),
  password: Joi.string().required().label("Password"),
  isRememberMe: Joi.boolean(),
});

const LoginForm = () => {
  const { onLogin, errorLogin } = useLoginUser();
  const initialData = { username: "", password: "", isRememberMe: false };

  const { renderInput, renderInputControl, renderButtonSumbit } = useForm(
    initialData,
    schema,
    onLogin
  );

  return (
    <form>
      <FormGroup>
        {renderInput(InputText, "username", "Username")}
        {renderInput(InputPassword, "password", "Password")}
        {renderInputControl(Checkbox, "isRememberMe", "Remember Me")}
        {renderButtonSumbit(LoginIcon, "Login", errorLogin)}
      </FormGroup>
    </form>
  );
};

export default LoginForm;
