export const sanitizePhoneNumber = (phoneNumber: string) => {
  if (phoneNumber.slice(0, 4) === "+977") {
    phoneNumber = phoneNumber.slice(4).trim();
  }

  return phoneNumber;
};
