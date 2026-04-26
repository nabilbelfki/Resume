import dbConnect from "../../lib/dbConnect";
import Setting from "../../models/Setting";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { clearCache } from "../../lib/cache";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    return handleGetRequest(req, res);
  } else if (req.method === 'PUT') {
    return handlePutRequest(req, res);
  } else {
    res.setHeader('Allow', ['GET', 'PUT']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function handleGetRequest(req, res) {
  try {
    let setting = await Setting.findOne();
    if (!setting) {
      // Create defaults
      setting = await Setting.create({
        appearance: 'system-default',
        userRegistration: false,
        siteMaintenance: false,
        websiteMessaging: true,
        scheduleMeetings: true
      });
    }

    return res.status(200).json({ data: setting });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function handlePutRequest(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ error: "Not Configured / Unauthorized" });
    }

    const { appearance, userRegistration, siteMaintenance, websiteMessaging, scheduleMeetings, resumeUrl } = req.body;

    let setting = await Setting.findOne();
    if (!setting) {
      setting = new Setting();
    }

    if (appearance !== undefined) setting.appearance = appearance;
    if (userRegistration !== undefined) setting.userRegistration = userRegistration;
    if (siteMaintenance !== undefined) setting.siteMaintenance = siteMaintenance;
    if (websiteMessaging !== undefined) setting.websiteMessaging = websiteMessaging;
    if (scheduleMeetings !== undefined) setting.scheduleMeetings = scheduleMeetings;
    if (resumeUrl !== undefined) setting.resumeUrl = resumeUrl;

    await setting.save();

    // Optionally clear any cache that replies on settings
    clearCache("settings"); // Though standard pages might just fetch dynamically

    return res.status(200).json({ data: setting });
  } catch (error) {
    console.error("Error updating settings:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
