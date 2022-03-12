const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		image: { type: String, default: 'https://cdn-icons-png.flaticon.com/512/456/456212.png' },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		status: {
			type: String,
			enum: ['Pending', 'Active'],
			default: 'Pending'
		},
		confirmationCode: {
			type: String,
			unique: true
		}
	},
	{
		collection: 'users',
		timestamps: true
	}
)

const model = mongoose.model('UserSchema', UserSchema)

module.exports = model