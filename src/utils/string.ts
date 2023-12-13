export const cleanString = (str: string): string => str.replace(/\s/g, '_').replace(/[,'!?:\u2022&]/g, '').replace(/_{2,}/g, '_').toLowerCase();

export const formatHsrString = (hsrString: string, values: any[]): string => {
  let formatted = hsrString;

  for (let i = 1; i <= values.length; i++) {
    const value = values[i - 1] < 1 ? values[i - 1] * 100 : values[i - 1];
    formatted = formatted.replace(`#${i}[i]`, value);
  }

  return formatted;
};