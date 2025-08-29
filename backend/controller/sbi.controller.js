import Sbi from "../model/sbi.model.js"

export const getSbi = async(req,res) =>{
  try {
    const sbi  = await Sbi.find();
    res.status(200).json(sbi);
  } catch (error) {
    console.log("error",error)
    res.status(500).json(error)
  }
};