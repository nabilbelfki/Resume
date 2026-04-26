import mongoose from 'mongoose';

const SettingSchema = new mongoose.Schema({
    appearance: {
        type: String,
        default: 'system-default'
    },
    userRegistration: {
        type: Boolean,
        default: false
    },
    siteMaintenance: {
        type: Boolean,
        default: false
    },
    websiteMessaging: {
        type: Boolean,
        default: true
    },
    scheduleMeetings: {
        type: Boolean,
        default: true
    },
    resumeUrl: {
        type: String,
        default: ""
    }
}, { timestamps: true });

export default mongoose.models.Setting || mongoose.model('Setting', SettingSchema);
