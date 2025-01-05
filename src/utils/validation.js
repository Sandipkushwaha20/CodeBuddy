const validator = require("validator");

const validateSignUpData = (req) => {
  console.log("SignUp data validating...");
  const { firstName, lastName, password, emailId } = req.body;
  if (!firstName || !lastName || !password || !emailId) {
    throw new Error("All fields are mandatory");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Enter strong password.");
  }
};

const validateloginData = (req) => {
  console.log("Login data validating...");
  const { emailId, password } = req.body;
  if (!password || !emailId) {
    throw new Error("All fields are mandatory");
  }
};

const validateEditProfileData = (req) => {
  console.log("Profile Edit data is validating...");
  const allowedEditFields = [
    "firstName",
    "lastName",
    "age",
    "about",
    "photoUrl",
    "skills",
    "gender",
  ];
  
  const isEditAllowed = Object.keys(req.body).every((field) =>{
    return allowedEditFields.includes(field); 
  }) 

  if (!isEditAllowed) {
    throw new Error("All fields are required.");
  }
};


const validateProfileChangePassword = (req) =>{
  const {oldPassword, newPassword, confirmNewPassword} = req.body;
  if(!oldPassword || !newPassword || !confirmNewPassword){
    throw new Error("All fields are required. Please fill all the fields.");
  }
  if(newPassword !== confirmNewPassword){
    throw new Error("newPassword and confirmNewPassword should be same. Please try again.");
  }
}
module.exports = {
  validateSignUpData,
  validateloginData,
  validateEditProfileData,
  validateProfileChangePassword
};
