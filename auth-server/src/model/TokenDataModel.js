import mongoose from 'mongoose'

const schema = mongoose.Schema

// eslint-disable-next-line new-cap
const TokenDataSchema = new schema({
  token: String,
  username: String,
  date: Date

})

TokenDataSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.__v
  }
})

export default mongoose.model('Tokens', TokenDataSchema)
