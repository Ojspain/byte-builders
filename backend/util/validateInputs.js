const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateSignup = ({ username, email, password }) => {
  if (!username || username.trim().length < 4) {
    return "Username must be at least 4 characters";
  }
  if (!email || !emailRegex.test(email)) {
    return "Invalid email format";
  }
  if (!password || password.length < 8) {
    return "Password must be at least 8 characters";
  }
  return null;
};

export const validateLogin = ({ username, password }) => {
  if (!username || username.trim().length < 4) {
    return "Username must be at least 4 characters";
  }
  if (!password) {
    return "Password is required";
  }
  return null;
};

export const validateProfileUpdate = ({ username, email }) => {
  if (username !== undefined && username.trim().length < 4) {
    return "Username must be at least 4 characters";
  }
  if (email !== undefined && !emailRegex.test(email)) {
    return "Invalid email format";
  }
  return null;
};
