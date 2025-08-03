import dbConnect from "../../lib/dbConnect";
import User from "../../models/User";
import bcrypt from 'bcrypt';
import { setCache, getCache, clearCache } from "../../lib/cache";

export default async function handler(req, res) {
  await dbConnect();

  const { method, query } = req;

  try {
    switch (method) {
      case "GET":
        console.log("Connected to MongoDB for GET request");
        
        // Extract query parameters with defaults
        const { 
          page = 1, 
          limit = 25, 
          search = '',
          sortBy = 'created', 
          sortOrder = 'desc' 
        } = query;
        
        // Parse and validate parameters
        const pageNumber = parseInt(page.toString());
        const limitNumber = parseInt(limit.toString());
        const skip = (pageNumber - 1) * limitNumber;
        
        // Validate sort order
        const sortDirection = sortOrder.toString().toLowerCase() === 'asc' ? 1 : -1;
        
        // Create cache key based on all query parameters
        const cacheKey = `users:${page}:${limit}:${search}:${sortBy}:${sortOrder}`;

        // Check cache
        const cachedData = getCache(cacheKey);
        if (cachedData) {
          console.log("Returning cached users data");
          return res.status(200).json(cachedData);
        }

        // Build search conditions
        const conditions = {};
        if (search) {
          const searchRegex = new RegExp(search.toString(), 'i');
          const searchTerms = search.toString().trim().split(/\s+/);
          
          conditions.$or = [
            { firstName: searchRegex },
            { lastName: searchRegex },
            { email: searchRegex },
            { role: searchRegex },
            { status: searchRegex },
            // Combined name search for "firstName lastName" or "lastName firstName"
            ...(searchTerms.length > 1 ? [
              {
                $and: [
                  { firstName: new RegExp(searchTerms[0], 'i') },
                  { lastName: new RegExp(searchTerms[1], 'i') }
                ]
              },
              {
                $and: [
                  { firstName: new RegExp(searchTerms[1], 'i') },
                  { lastName: new RegExp(searchTerms[0], 'i') }
                ]
              }
            ] : [])
          ];
        }

        // Get total count
        const total = await User.countDocuments(conditions);

        // Build sort object
        const sortOptions = {
          [sortBy]: sortDirection,
          '_id': sortDirection
        };

        // Fetch paginated, filtered, and sorted users
        const data = await User.find(conditions)
          .skip(skip)
          .limit(limitNumber)
          .sort(sortOptions);

        console.log(`Users fetched: ${data.length} of ${total}, sorted by ${sortBy} ${sortOrder}`);

        // Prepare response
        const responseData = {
          data,
          total,
          totalPages: Math.ceil(total / limitNumber),
          currentPage: pageNumber,
          limit: limitNumber,
          sortBy,
          sortOrder
        };

        // Cache the response
        setCache(cacheKey, responseData);

        res.status(200).json(responseData);
        break;

      case "POST":
        clearCache('user');

        const {
          image,
          username,
          firstName,
          lastName,
          email,
          birthday,
          phoneNumber,
          password, // This comes in plain text from the client
          role,
          status,
          address,
        } = req.body;

        // Basic validation
        if (!username || !firstName || !lastName || !email) {
          return res.status(400).json({ error: "Missing required fields: username, firstName, lastName, email" });
        }

        // Only validate password if it's provided (for cases where password might be optional)
        let hashedPassword = undefined;
        if (password) {
          // Validate password strength if needed
          if (password.length < 8) {
            return res.status(400).json({ error: "Password must be at least 8 characters long" });
          }

          // Hash the password with a salt round of 10
          const saltRounds = 10;
          hashedPassword = await bcrypt.hash(password, saltRounds);
        }
        
        const newUser = await User.create({
          image,
          username,
          firstName,
          lastName,
          email,
          password: hashedPassword, // Store the hashed password
          birthday: birthday ? new Date(birthday) : undefined,
          phoneNumber,
          role,
          status,
          address,
          created: new Date(),
        });

        console.log("New user created:", newUser);
        
        // Important: Don't send the password (even hashed) back in the response
        const userResponse = { ...newUser.toJSON() };
        delete userResponse.password;
        
        res.status(201).json(userResponse);
        break;

      default:
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
        break;
    }
  } catch (error) {
    console.error(`Error during ${method} request:`, error);
    // Handle Mongoose validation errors specifically if needed
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: `Failed to process ${method} request` });
  }
}