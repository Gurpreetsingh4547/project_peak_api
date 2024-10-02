/**
 * Sends a token to the user with the specified response status code and message.
 * @param {Object} res - The response object
 * @param {Object} user - The user object
 * @param {number} statusCode - The status code for the response
 * @param {string} message - The message to be included in the response
 * @return {Object} The JSON response containing success status, message, and user data
 */
export const SendToken = (res, user, statusCode, message) => {
  // Generate JWT token
  const token = user.getJWTToken();

  // Set cookie options
  const options = {
    httpOnly: true,
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    sameSite: "none",
    secure: true,
  };

  // Set user data
  const data = {
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    tasks: user.tasks,
    verified: user.verified,
    token: token,
  };

  // Send response
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    message,
    data,
  });
};
