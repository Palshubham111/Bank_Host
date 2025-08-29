import mongoose from "mongoose";

const accdataSchema = mongoose.Schema({
  Name: {
    type: String,
    required: true,
    trim: true
  },
  "A/C NO": {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  "IFSC CODE": {
    type: String,
    required: true,
    trim: true
  },
  BRANCH: {
    type: String,
    required: true,
    trim: true
  },
  "A/C TYPE": {
    type: String,
    required: true,
    trim: true
  },
  AMOUNT: {
    type: Number,
    required: true,
    default: 0
  },
  mobile: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid mobile number!`
    }
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  address: {
    type: String,
    trim: true
  },
  dateOfBirth: {
    type: Date
  },
  aadharNumber: {
    type: String,
    // required: true,
    unique: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^\d{12}$/.test(v);
      },
      message: props => `${props.value} is not a valid Aadhar number!`
    }
  },
  panNumber: {
    type: String,
    // required: true,
    unique: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v);
      },
      message: props => `${props.value} is not a valid PAN number!`
    }
  },
  photo: {
    type: String,
    trim: true
  },
  aadharPhoto: {
    type: String,
    trim: true
  },
  panPhoto: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add index for faster queries
accdataSchema.index({ "A/C NO": 1 });
accdataSchema.index({ aadharNumber: 1 });
accdataSchema.index({ panNumber: 1 });
accdataSchema.index({ mobile: 1 });

const accdata = mongoose.model("accdata", accdataSchema);

export default accdata;