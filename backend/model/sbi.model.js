import mongoose  from "mongoose";


const sbiSchema = mongoose.Schema({
  img:String,
  name:String,
  position:String
});

const data = mongoose.model("data" , sbiSchema);

export default data;