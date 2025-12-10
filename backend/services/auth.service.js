import User from '../models/User.js';

export const findUserByPhone = async (phone) => {
  try {
    const user = await User.findOne({ phone });
    return user;
  } catch (error) {
    throw new Error(`Error finding user: ${error.message}`);
  }
};

export const createUser = async (userData) => {
  try {
    const { name, phone, email, address } = userData;
    
    const existingUser = await findUserByPhone(phone);
    if (existingUser) {
      throw new Error('User with this phone number already exists');
    }

    const user = new User({
      name,
      phone,
      email: email || '',
      address: address || ''
    });

    await user.save();
    return user;
  } catch (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }
};

export const validatePhoneNumber = (phone) => {
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone);
};


