const { MongoClient } = require('mongodb');

// Connection URL
const url = "mongodb+srv://zd03:zd@icc.qjfjs3s.mongodb.net/?appName=icc";
const client = new MongoClient(url);

async function main() {
    try {
        await client.connect();
        console.log('Connected successfully to server');
        const db = client.db();

        const oldCollection = db.collection('citizens');
        const usersCollection = db.collection('users');
        const familyCollection = db.collection('familymembers');
        const paymentCollection = db.collection('payments');

        // Check if migration already ran
        const existingUsers = await usersCollection.countDocuments();
        if (existingUsers > 0) {
            console.log("Users already exist. Assuming migration was already done or not needed.");
            return;
        }

        const citizens = await oldCollection.find({}).toArray();
        console.log(`Found ${citizens.length} citizens to migrate...`);

        for (const citizen of citizens) {
            // 1. Create User
            const userDoc = {
                _id: citizen._id,
                membershipId: citizen.membershipId,
                name: citizen.name,
                mobile: citizen.mobile,
                password: citizen.password,
                role: citizen.role,
                bloodGroup: citizen.bloodGroup || null,
                education: citizen.education || null,
                gender: citizen.gender || null,
                address: citizen.address || null,
                monthlyFee: citizen.monthlyFee || 0,
                profileImage: citizen.profileImage || null,
                createdAt: citizen.createdAt || new Date(),
                updatedAt: citizen.updatedAt || new Date()
            };

            await usersCollection.insertOne(userDoc);

            // 2. Create Family Members
            if (citizen.familyMembers && citizen.familyMembers.length > 0) {
                const familyDocs = citizen.familyMembers.map(fm => ({
                    _id: fm._id, // Preserve ID if possible
                    userId: citizen._id,
                    name: fm.name,
                    relationship: fm.relationship,
                    age: fm.age,
                    gender: fm.gender,
                    bloodGroup: fm.bloodGroup,
                    education: fm.education,
                    photo: fm.photo,
                    maritalStatus: fm.maritalStatus,
                    spouseName: fm.spouseName,
                    occupation: fm.occupation,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }));
                await familyCollection.insertMany(familyDocs);
            }

            // 3. Create Payments
            if (citizen.paymentHistory && citizen.paymentHistory.length > 0) {
                const paymentDocs = citizen.paymentHistory.map(ph => ({
                    _id: ph._id,
                    userId: citizen._id,
                    type: 'Fee', // Default to Fee based on old structure
                    month: ph.month,
                    year: ph.year,
                    amount: ph.amount,
                    status: ph.status,
                    paymentDate: ph.status === 'Paid' ? ph.updatedAt : null,
                    updatedBy: ph.updatedBy,
                    createdAt: new Date(),
                    updatedAt: ph.updatedAt || new Date()
                }));
                await paymentCollection.insertMany(paymentDocs);
            }

            console.log(`Migrated citizen: ${citizen.name}`);
        }

        console.log("Migration completed successfully.");

    } catch (error) {
        console.error("Error during migration:", error);
    } finally {
        await client.close();
    }
}

main();
