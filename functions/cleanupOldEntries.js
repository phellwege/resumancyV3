const { onSchedule } = require("firebase-functions/v2/scheduler");
const { getFirestore, Timestamp } = require("firebase-admin/firestore");
const admin = require("firebase-admin");

const db = getFirestore();

exports.cleanUpOldEntries = onSchedule("every 24 hours", async (event) => {
    console.log("🕒 Running clean-up function...");

    const usersSnapshot = await db.collection("users").get();
    const thirtyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

    const batch = db.batch();
    let batchCounter = 0;
    
    usersSnapshot.forEach((userDoc) => {
        const userData = userDoc.data();
        const userRef = userDoc.ref;

        const isRecent = (dateStr) => {
            if (!dateStr) return false;
            const date = new Date(dateStr);
            return date > thirtyDaysAgo;
        };

        const updatedTailoredResume = userData.tailoredResume
            ? userData.tailoredResume.filter((tr, index) => index === 0 || isRecent(tr.createdAt))
            : [];

        const updatedCoverLetter = userData.coverLetter?.filter(cl => isRecent(cl.createdAt)) || [];

        const updatedResume = userData.resume?.filter(resume => 
            resume.usage?.baseResume === true || isRecent(resume.usage?.timeStamp)
        ) || [];

        if (
            updatedTailoredResume.length !== userData.tailoredResume?.length || 
            updatedCoverLetter.length !== userData.coverLetter?.length ||
            updatedResume.length !== userData.resume?.length
        ) {
            batch.update(userRef, {
                tailoredResume: updatedTailoredResume,
                coverLetter: updatedCoverLetter,
                resume: updatedResume
            });

            batchCounter++;

            if (batchCounter >= 450) {
                batch.commit();
                console.log("✅ Batch committed to Firestore.");
                batchCounter = 0; // Reset counter for new batch
            }
        }
    });

    if (batchCounter > 0) {
        await batch.commit();
        console.log("✅ Final batch committed to Firestore.");
    }

    console.log("✅ Old entries successfully cleaned up.");
});
