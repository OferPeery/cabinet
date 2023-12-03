import React, { useState } from "react";
import ButtonSubmit from "./ButtonSubmit";
import InputControl from "../Form/InputControl";

const useForm = (initialData, schema, doSubmit) => {
  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const options = { abortEarly: false };
    const { error } = schema.validate(data, options);

    if (!error) {
      return null;
    }

    const validationErrors = {};

    for (let item of error.details) {
      validationErrors[item.path[0]] = item.message;
    }

    return validationErrors;
  };

  const validateProperty = ({ name, value }) => {
    const { error } = schema.extract(name).validate(value);

    return error ? error.details[0].message : null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();

    setErrors(validationErrors || {});
    if (validationErrors) return;

    doSubmit(data); // Injection point - the submission function given from the componenr using this 'useForm'
  };

  const handleChange = ({ target }) => {
    const clonedErrors = { ...errors };
    const errorMessage = validateProperty(target);

    if (errorMessage) {
      clonedErrors[target.name] = errorMessage;
    } else {
      delete clonedErrors[target.name];
    }

    setData({ ...data, [target.name]: target.value });
    setErrors(clonedErrors);
  };

  const resetInputs = () => setData(initialData);

  const renderInput = (InputComponent, name, label) => {
    return (
      <InputComponent
        name={name}
        value={data[name]}
        label={label}
        onChange={handleChange}
        error={errors[name]}
      />
    );
  };

  const renderInputControl = (ControlComponent, name, label) => {
    return (
      <InputControl
        ControlComponent={ControlComponent}
        name={name}
        checked={data[name]}
        label={label}
        onChange={(e) =>
          handleChange({ target: { name, value: e.target.checked } })
        }
        error={errors[name]}
      />
    );
  };

  const renderButtonSumbit = (
    EndIcon,
    label,
    errorInSubmitResponse,
    errorProps,
    ErrorComponent
  ) => {
    return (
      <ButtonSubmit
        EndIcon={EndIcon}
        label={label}
        error={errorInSubmitResponse}
        onSubmit={handleSubmit}
        disabled={!!validate()}
        errorProps={errorProps}
        ErrorComponent={ErrorComponent}
      />
    );
  };

  return {
    resetInputs,
    renderInput,
    renderInputControl,
    renderButtonSumbit,
  };
};

export default useForm;
