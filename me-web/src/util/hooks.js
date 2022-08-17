import { useState } from "react";

export const useForm = (callback, initialState = {}) => {
  const [values, setValues] = useState(initialState);

  const onArrayChange = (event) => {
    // const newValues = [...values];
    var list = values[event.target.name];

    let index = 0;

    if (event.target.checked) {
      if (!list.includes(event.target.value)) {
        list = [...list, event.target.value];
      }
    } else {
      index = list.indexOf(event.target.value);
      list.splice(index, 1);
    }

    list.sort();
    setValues({ ...values, [event.target.name]: list });
  };

  const onChange = (event) => {
    // event.preventDefault();
    // event.stopPropagation();
    if (event.target.type === "number") {
      const numberValue = parseInt(event.target.value, 10);

      setValues({
        ...values,
        [event.target.name]: numberValue,
      });
    } else if (event.target.type === "checkbox") {
      if (event.target.checked) {
        setValues({ ...values, [event.target.name]: true });
      } else {
        setValues({ ...values, [event.target.name]: false });
      }
      // }else{}
    } else if (event.target.name === "typeOfDiscount") {
      setValues({
        ...values,
        [event.target.name]: parseInt(event.target.value) || 0,
      });
    } else {
      setValues({ ...values, [event.target.name]: event.target.value });
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();

    event.stopPropagation();
    callback();
  };

  // const counterClickCallback = (targetInputName) => {

  // };

  return {
    onChange,
    onSubmit,
    // onCounterClick,
    onArrayChange,
    values,
    setValues,
    // onDrop,
  };
};
