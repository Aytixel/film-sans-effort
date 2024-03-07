import bcrypt from "bcrypt";

const saltRounds = 10

export default class Password {    
    static async hash(password) {
        return await bcrypt.hash(password, await bcrypt.genSalt(saltRounds));
    }
  
    static async compare(password, hash) {
        return bcrypt.compare(password, hash);
    }
}