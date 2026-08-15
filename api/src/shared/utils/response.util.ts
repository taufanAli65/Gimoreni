export const success = <T>(data: T, meta?: any) => {
  if (meta) {
    return { success: true, data, meta };
  }
  return { success: true, data };
};

export const error = (code: string, message: string) => {
  return {
    success: false,
    error: {
      code,
      message,
    },
  };
};
