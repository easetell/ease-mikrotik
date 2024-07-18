import mongoose from 'mongoose';

// Campaign Schema
const CampaignSchema = new mongoose.Schema({
  name: String,
  description: String,
  startDate: Date,
  endDate: Date,
  audience: [String],
  status: String,
  emailsSent: Number,
  smsSent: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  campaignType: { type: String, enum: ['email', 'sms'], required: true },
  schedule: { type: Date },
  emailTemplateId: { type: mongoose.Schema.Types.ObjectId, ref: 'EmailTemplate' },
  smsTemplateId: { type: mongoose.Schema.Types.ObjectId, ref: 'SmsTemplate' },
  tracking: {
    opens: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    responses: { type: Number, default: 0 },
  },
  personalizationVariables: [String],
  errors: [{
    message: { type: String },
    timestamp: { type: Date, default: Date.now },
  }],
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  batchSize: { type: Number, default: 100 },
  abTest: {
    isEnabled: { type: Boolean, default: false },
    variations: [{
      name: String,
      audiencePercentage: Number,
      emailTemplateId: { type: mongoose.Schema.Types.ObjectId, ref: 'EmailTemplate' },
      smsTemplateId: { type: mongoose.Schema.Types.ObjectId, ref: 'SmsTemplate' },
    }],
  },
  optOutList: [String],
}, {
  suppressReservedKeysWarning: true // Add this option to suppress the warning
});

const EmailTemplateSchema = new mongoose.Schema({
  name: String,
  subject: String,
  body: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, {
  suppressReservedKeysWarning: true // Add this option to suppress the warning
});

const SmsTemplateSchema = new mongoose.Schema({
  name: String,
  message: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, {
  suppressReservedKeysWarning: true // Add this option to suppress the warning
});

const LogSchema = new mongoose.Schema({
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
  messageType: { type: String, enum: ['email', 'sms'] },
  recipient: String,
  status: String,
  error: String,
  createdAt: { type: Date, default: Date.now },
}, {
  suppressReservedKeysWarning: true // Add this option to suppress the warning
});

const Campaign = mongoose.models.Campaign || mongoose.model('Campaign', CampaignSchema);
const EmailTemplate = mongoose.models.EmailTemplate || mongoose.model('EmailTemplate', EmailTemplateSchema);
const SmsTemplate = mongoose.models.SmsTemplate || mongoose.model('SmsTemplate', SmsTemplateSchema);
const Log = mongoose.models.Log || mongoose.model('Log', LogSchema);

export { Campaign, EmailTemplate, SmsTemplate, Log };
