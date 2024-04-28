export const Success = (data?: any) => {
  return {
    code: 200,
    data: data || null,
    msg: "success"
  };
};

export const Error = (msg: string) => {
  return {
    code: 5001,
    data: null,
    msg: msg
  };
};

export const FormTypeField = ["text", "email", "phone", "longText"];
