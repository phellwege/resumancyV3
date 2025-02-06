const { onSchedule } = require("firebase-functions/v2/scheduler");
const { getFirestore, Timestamp } = require("firebase-admin/firestore");
const admin = require("firebase-admin");

const db = getFirestore();

exports.cleanUpOldEntries = onSchedule("every 24 hours", async (event) => {
    console.log("🕒 Running clean-up function...");

    const usersSnapshot = await db.collection("users").get();
    const thirtyDaysAgo = Timestamp.fromDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));

    const batch = db.batch();

    usersSnapshot.forEach((userDoc) => {
        const userData = userDoc.data();
        const userRef = userDoc.ref;

        // Filter out old tailored resumes
        const updatedTailoredResume = userData.tailoredResume?.filter(tr => tr.createdAt && tr.createdAt.toDate() > thirtyDaysAgo) || [];
        
        // Filter out old cover letters
        const updatedCoverLetter = userData.coverLetter?.filter(cl => cl.createdAt && cl.createdAt.toDate() > thirtyDaysAgo) || [];

        // Filter out old non-base resumes
        const updatedResume = userData.resume?.filter(resume => 
            resume.usage?.baseResume === true ||  
            (resume.usage?.timeStamp && resume.usage.timeStamp.toDate() > thirtyDaysAgo)
        ) || [];

        // Update Firestore only if necessary
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
        }
    });

    await batch.commit();
    console.log("✅ Old entries successfully cleaned up.");
});
