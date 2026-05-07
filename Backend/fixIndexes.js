/**
 * fixIndexes.js
 * Run this ONCE to drop the stale solo studentId_1 index from MongoDB.
 * The correct compound index {studentId, batch} will remain.
 *
 * Usage:  node fixIndexes.js
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/student-retention';

async function fixIndexes() {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected');

    const db         = mongoose.connection.db;
    const collection = db.collection('studentprofiles');

    // List current indexes
    const indexes = await collection.indexes();
    console.log('\nCurrent indexes on studentprofiles:');
    indexes.forEach(idx => console.log(' -', JSON.stringify(idx.key), idx.unique ? '(unique)' : ''));

    // Drop the stale solo studentId_1 index if it exists
    const staleIndex = indexes.find(idx =>
        idx.name === 'studentId_1' &&
        Object.keys(idx.key).length === 1 &&
        idx.key.studentId !== undefined
    );

    if (staleIndex) {
        await collection.dropIndex('studentId_1');
        console.log('\n✅ Dropped stale index: studentId_1');
    } else {
        console.log('\nℹ️  No stale studentId_1 index found — nothing to drop.');
    }

    // Confirm remaining indexes
    const remaining = await collection.indexes();
    console.log('\nRemaining indexes:');
    remaining.forEach(idx => console.log(' -', JSON.stringify(idx.key), idx.unique ? '(unique)' : ''));

    await mongoose.disconnect();
    console.log('\nDone. You can now run importData.js safely.\n');
    process.exit(0);
}

fixIndexes().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
