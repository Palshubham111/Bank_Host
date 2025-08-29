import accdata from "../model/accdata.model.js"

export const getSbidata = async (req,res) =>{
  try {
    const sbidata = await accdata.find();
    res.status(200).json(sbidata)
  } catch (error) {
    console.log("error",error)
    res.status(500).json(error)
  }
};

export const getRESULTBYACC = async (req,res) =>{
  try {
    const {acc} = req.params;
    // Search using the correct field name "A/C NO"
    const result = await accdata.findOne({"A/C NO": acc});

    if(!result){
      return res.status(404).json({ message: "Invalid account number" });
    }

    res.status(200).json(result);
    
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateMobile = async (req, res) => {
  try {
    const { acc } = req.params;
    const { mobile } = req.body;

    if (!/^\d{10}$/.test(mobile)) {
      return res.status(400).json({ message: "Invalid mobile number format" });
    }

    const updatedAccount = await accdata.findOneAndUpdate(
      { "A/C NO": acc },
      { mobile },
      { new: true, runValidators: true }
    );

    if (!updatedAccount) {
      return res.status(404).json({ message: "Account not found" });
    }

    res.status(200).json({
      message: "Mobile number updated successfully",
      account: updatedAccount
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const openAccount = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      dateOfBirth,
      aadharNumber,
      panNumber,
      initialDeposit
    } = req.body;

    // Get file paths from uploaded files
    const photo = req.files?.photo?.[0];
    const aadharPhoto = req.files?.aadharPhoto?.[0];
    const panPhoto = req.files?.panPhoto?.[0];

    // Validate required fields
    const requiredFields = ['name', 'phone', 'aadharNumber', 'panNumber', 'address', 'dateOfBirth', 'initialDeposit'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Validate required files
    if (!photo || !aadharPhoto || !panPhoto) {
      return res.status(400).json({
        success: false,
        message: 'All photos (profile, Aadhar, and PAN) are required'
      });
    }

    // Validate name (only letters and spaces)
    if (!/^[a-zA-Z\s]{2,50}$/.test(name)) {
      return res.status(400).json({
        success: false,
        message: "Invalid name format. Only letters and spaces allowed (2-50 characters)."
      });
    }

    // Validate email if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format."
      });
    }

    // Validate Aadhar number (12 digits)
    if (!/^\d{12}$/.test(aadharNumber)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Aadhar number. Must be exactly 12 digits."
      });
    }

    // Validate PAN number (5 letters, 4 numbers, 1 letter)
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: "Invalid PAN number. Must be in format: ABCDE1234F"
      });
    }

    // Validate phone number (10 digits)
    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number. Must be exactly 10 digits."
      });
    }

    // Validate date of birth (must be at least 18 years old)
    const dob = new Date(dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    if (age < 18) {
      return res.status(400).json({
        success: false,
        message: "You must be at least 18 years old to open an account."
      });
    }

    // Validate initial deposit
    const depositAmount = parseFloat(initialDeposit);
    if (isNaN(depositAmount) || depositAmount < 1000) {
      return res.status(400).json({
        success: false,
        message: "Initial deposit must be at least ₹1000"
      });
    }

    // Check if account already exists with same Aadhar or PAN
    const existingAccount = await accdata.findOne({
      $or: [
        { aadharNumber },
        { panNumber: panNumber.toUpperCase() }
      ]
    });

    if (existingAccount) {
      return res.status(400).json({
        success: false,
        message: "An account already exists with this Aadhar or PAN number"
      });
    }

    // Generate a random 11-digit account number
    let accountNumber;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 5;
    
    while (!isUnique && attempts < maxAttempts) {
      accountNumber = Math.floor(10000000000 + Math.random() * 90000000000).toString();
      const existingAcc = await accdata.findOne({ "A/C NO": accountNumber });
      if (!existingAcc) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate unique account number. Please try again."
      });
    }
    
    // Create new account
    const newAccount = new accdata({
      Name: name,
      "A/C NO": accountNumber,
      "IFSC CODE": "SBIN0987", // Default IFSC code
      BRANCH: "MAIN BRANCH", // Default branch
      "A/C TYPE": "SAVING A/C",
      AMOUNT: depositAmount,
      mobile: phone,
      email: email || undefined,
      address: address,
      dateOfBirth: dob,
      aadharNumber: aadharNumber,
      panNumber: panNumber.toUpperCase(),
      photo: photo.path,
      aadharPhoto: aadharPhoto.path,
      panPhoto: panPhoto.path
    });

    await newAccount.save();

    // Log successful account creation
    console.log(`New account created: ${accountNumber} for ${name}`);

    res.status(201).json({
      success: true,
      message: "Account opened successfully",
      account: {
        "A/C NO": newAccount["A/C NO"],
        "Name": newAccount.Name,
        "IFSC CODE": newAccount["IFSC CODE"],
        "BRANCH": newAccount.BRANCH,
        "A/C TYPE": newAccount["A/C TYPE"],
        "AMOUNT": newAccount.AMOUNT
      }
    });
  } catch (error) {
    console.error("Error opening account:", error);
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "An account already exists with this information."
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to open account",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};