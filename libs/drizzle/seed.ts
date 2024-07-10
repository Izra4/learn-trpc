import { config } from "../config";
import { seedUsers } from "./seeders/dummy-user";
import { db } from "./connection"
import { seedRoles } from "./seeders/dummy-role";
import { seedSnacks } from "./seeders/dummy-snack";

// Seed the database
const main = async () => {
    try {
        await seedRoles(db);
        await seedUsers(db);
        await seedSnacks(db);
        console.log('Seed done!');
    } catch (error) {
        console.log('Seed failed!', error);
    } finally {
        // Stop process
        process.exit(0);
    }
}

// Run the main function
main();