const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
     
      const user = await prisma.user.findUnique({
        where: { username: username }
      });
      if (!user) {
        return done(null, false, { message: 'No user found' });
      }

  
      const isMatch = await bcrypt.compare(password, user.password);
   
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect password' });
      }

     
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));
passport.serialize((user,done)=>{
    return(user.id)
})
passport.deserialize(async (id, done) => {
    try {
        let user = await prisma.user.findUnique({
            where: {id: id}
        })
        return done(null, user)
    } catch (error) {
        return done(error, null)
    }
})