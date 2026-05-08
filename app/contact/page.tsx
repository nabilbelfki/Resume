import ResponsiveContact from "@/components/ResponsiveContact/ResponsiveContact";

const ContactPage = async () => {
    let settings = {
        siteMaintenance: false,
        websiteMessaging: true,
        scheduleMeetings: true
    };

    // Fetch Settings
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
    try {
        const res = await fetch(`${API_BASE_URL}/api/settings`, { cache: 'no-store' });
        if (res.ok) {
            const data = await res.json();
            if (data.data) {
                settings = data.data;
            }
        }
    } catch {
        // silently fallback to defaults
    }

    return <ResponsiveContact settings={settings} />;
};

export default ContactPage;
