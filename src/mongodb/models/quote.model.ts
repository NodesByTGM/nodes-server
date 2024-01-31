import mongoose from 'mongoose';

const QuoteSchema = new mongoose.Schema({
  anime: { type: String, required: true },
  character: { type: String, required: true, },
  quote: { type: String, required: true, unique: true },
}, {
  // timestamps: true,
  toJSON: {
    transform: (_, rec) => {
      const { __v, _id, ...object } = rec;
      object.id = _id
      return object;
    }
  }
});

QuoteSchema.index({ anime: 1, character: 1 })
QuoteSchema.index({ charcter: 1, quote: 1 }, { unique: true });

const QuoteModel = mongoose.model('Quote', QuoteSchema);

export default QuoteModel;
