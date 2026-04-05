import { db } from './firebaseConfig';
import { doc, getDoc, updateDoc, collection, query, where, getDocs, arrayUnion } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a unique referral code for a specific referral
 * @param {string} userId - The user's ID
 * @returns {string} - A unique referral code
 */
export const generateReferralCode = (userId) => {
  // Create a unique code in the format REF-XXXX-YYYY-ZZZZ
  // where XXXX is from user ID, YYYY is timestamp, and ZZZZ is random
  const randomPart = uuidv4().substring(0, 4);
  const userPart = userId.substring(0, 4);
  const timestampPart = Date.now().toString(36).substring(0, 4).toUpperCase();
  return `REF-${userPart}-${timestampPart}-${randomPart}`.toUpperCase();
};

/**
 * Creates a new referral code for sharing
 * @param {string} userId - The user's ID
 * @returns {Promise<object>} - The result of the operation with the new referral code
 */
export const createNewReferralCode = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      return { success: false, message: 'User not found' };
    }
    
    // Generate a new unique referral code
    const referralCode = generateReferralCode(userId);
    
    // Create the coupon in Stripe
    const couponResult = await createStripeCoupon(referralCode, userId);
    
    // If coupon creation fails, return the error
    if (!couponResult.success) {
      return { 
        success: false, 
        message: `Failed to create coupon: ${couponResult.message}` 
      };
    }
    
    // Add the new code to the user's available codes
    await updateDoc(userRef, {
      'referrals.availableReferralCodes': arrayUnion({
        code: referralCode,
        createdAt: new Date().toISOString(),
        used: false
      })
    });
    
    return { 
      success: true, 
      message: 'New referral code created successfully',
      referralCode
    };
  } catch (error) {
    console.error('Error creating new referral code:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Initializes the referral system for a new user
 * @param {string} userId - The user's ID
 * @returns {Promise<object>} - The result of the operation
 */
export const initializeUserReferral = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      return { success: false, message: 'User not found' };
    }
    
    const userData = userDoc.data();
    
    // If user already has referral data initialized, don't reinitialize
    if (userData.referrals?.initialized) {
      return { 
        success: true, 
        message: 'Referral system already initialized'
      };
    }
    
    // Initialize referral data without generating a code
    const referralData = {
      referrals: {
        initialized: true,
        referredBy: '',
        availableReferralCodes: [],
        usedReferralCodes: [],
        paidReferrals: [],
        rewardsEarned: [],
        availableRewards: [],
        totalRewardsEarned: 0
      }
    };
    
    // Update the user's document with the referral data
    await updateDoc(userRef, referralData);
    
    return { 
      success: true, 
      message: 'Referral system initialized successfully',
      hasAvailableCode: false
    };
  } catch (error) {
    console.error('Error initializing user referral:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Creates a Stripe coupon for a referral code
 * @param {string} referralCode - The referral code to create a coupon for
 * @param {string} userId - The user ID of the referrer
 * @returns {Promise<object>} - The result of the operation
 */
export const createStripeCoupon = async (referralCode, userId) => {
  try {
    // Get auth token for the request
    const auth = getAuth();
    const currentUser = auth.currentUser;
    const idToken = currentUser ? await currentUser.getIdToken() : null;

    // Call the Firebase Cloud Function to create the coupon in Stripe
    const response = await fetch('https://us-central1-resumancy.cloudfunctions.net/createStripeCouponHttp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${idToken}` },
      body: JSON.stringify({ referralCode, userId })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create Stripe coupon');
    }

    const data = await response.json();
    return {
      success: true,
      message: data.message || 'Coupon created successfully',
      couponId: data.couponId,
      discountPercentage: data.percentOff || 20
    };
  } catch (error) {
    console.error('Error creating Stripe coupon:', error);
    return { 
      success: false, 
      message: error.message || 'Failed to create Stripe coupon'
    };
  }
};

/**
 * Updates a user's referral status when they subscribe to a paid plan
 * @param {string} userId - The user's ID
 * @param {string} couponCode - The coupon code used for the subscription
 * @returns {Promise<object>} - The result of the operation
 */
export const updateReferralOnSubscription = async (userId, couponCode = null) => {
  try {
    // If no coupon code was used, there's nothing to update
    if (!couponCode || !couponCode.startsWith('REF-')) {
      return { success: true, message: 'No referral coupon used' };
    }
    
    // Extract the referrer ID from the coupon code (first part after REF-)
    const referrerIdPart = couponCode.split('-')[1];
    
    // Find the referrer based on the coupon code pattern
    const referrersQuery = query(
      collection(db, 'users'),
      where('referrals.availableReferralCodes', 'array-contains-any', [
        { code: couponCode, used: false }
      ])
    );
    
    const referrerQuerySnapshot = await getDocs(referrersQuery);
    
    if (referrerQuerySnapshot.empty) {
      // Try a different query approach - look for the code in any user's available codes
      const allUsersQuery = query(collection(db, 'users'));
      const allUsersSnapshot = await getDocs(allUsersQuery);
      
      let referrerDoc = null;
      
      for (const doc of allUsersSnapshot.docs) {
        const userData = doc.data();
        const availableCodes = userData.referrals?.availableReferralCodes || [];
        
        if (availableCodes.some(codeObj => codeObj.code === couponCode && !codeObj.used)) {
          referrerDoc = doc;
          break;
        }
      }
      
      if (!referrerDoc) {
        return { success: false, message: 'Referrer not found for this coupon code' };
      }
      
      // Update the referrer's document to mark the code as used
      const referrerId = referrerDoc.id;
      const referrerData = referrerDoc.data();
      
      // Find the index of the code in the available codes
      const availableCodes = referrerData.referrals?.availableReferralCodes || [];
      const codeIndex = availableCodes.findIndex(codeObj => codeObj.code === couponCode);
      
      if (codeIndex !== -1) {
        // Mark the code as used
        availableCodes[codeIndex].used = true;
        availableCodes[codeIndex].usedBy = userId;
        availableCodes[codeIndex].usedAt = new Date().toISOString();
        
        // Update the referrer's document
        await updateDoc(doc(db, 'users', referrerId), {
          'referrals.availableReferralCodes': availableCodes,
          'referrals.usedReferralCodes': arrayUnion({
            code: couponCode,
            usedBy: userId,
            usedAt: new Date().toISOString()
          }),
          'referrals.paidReferrals': arrayUnion(userId)
        });
        
        // Update the user's referredBy field
        await updateDoc(doc(db, 'users', userId), {
          'referrals.referredBy': referrerId
        });
        
        // Check if the referrer has reached 5 paid referrals and should get a reward
        await checkAndApplyReferralReward(referrerId);
        
        return { 
          success: true, 
          message: 'User marked as paid referral'
        };
      }
    }
    
    return { success: false, message: 'Valid referral code not found' };
  } catch (error) {
    console.error('Error updating referral status:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Checks if a user has earned any referral rewards and applies them
 * @param {string} userId - The user's ID
 * @returns {Promise<object>} - The result of the operation
 */
export const checkAndApplyReferralReward = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      return { success: false, message: 'User not found' };
    }
    
    const userData = userDoc.data();
    const paidReferrals = userData.referrals?.paidReferrals || [];
    const rewardsEarned = userData.referrals?.rewardsEarned || [];
    
    // Calculate how many complete sets of 5 paid referrals the user has
    const paidReferralCount = paidReferrals.length;
    const completeSets = Math.floor(paidReferralCount / 5);
    const alreadyRewardedSets = rewardsEarned.length;
    
    // If there are new complete sets to reward
    if (completeSets > alreadyRewardedSets) {
      const newRewardsCount = completeSets - alreadyRewardedSets;
      const newRewards = [];
      
      for (let i = 0; i < newRewardsCount; i++) {
        const rewardId = uuidv4();
        const reward = {
          id: rewardId,
          type: 'premium_month',
          dateEarned: new Date().toISOString(),
          used: false,
          expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days to use the reward
          referralMilestone: (alreadyRewardedSets + i + 1) * 5 // Track which milestone this reward is for
        };
        newRewards.push(reward);
      }
      
      // Update the user's document with the new rewards
      await updateDoc(userRef, {
        'referrals.rewardsEarned': [...rewardsEarned, ...newRewards],
        'referrals.availableRewards': [...(userData.referrals?.availableRewards || []), ...newRewards],
        'referrals.totalRewardsEarned': (userData.referrals?.totalRewardsEarned || 0) + newRewardsCount
      });
      
      return { 
        success: true, 
        message: `${newRewardsCount} new rewards added`,
        rewards: newRewards
      };
    }
    
    return { 
      success: true, 
      message: 'No new rewards available',
      currentPaidReferrals: paidReferralCount,
      neededForNextReward: 5 - (paidReferralCount % 5),
      totalRewardsEarned: userData.referrals?.totalRewardsEarned || 0
    };
  } catch (error) {
    console.error('Error checking referral rewards:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Applies a premium reward to a user's account
 * @param {string} userId - The user's ID
 * @param {string} rewardId - The ID of the reward to apply
 * @returns {Promise<object>} - The result of the operation
 */
export const applyPremiumReward = async (userId, rewardId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      return { success: false, message: 'User not found' };
    }
    
    const userData = userDoc.data();
    const referrals = userData.referrals || {};
    const availableRewards = referrals.availableRewards || [];
    
    // Find the reward in the user's available rewards
    const rewardIndex = availableRewards.findIndex(reward => reward.id === rewardId);
    
    if (rewardIndex === -1) {
      return { success: false, message: 'Reward not found or already used' };
    }
    
    const reward = availableRewards[rewardIndex];
    
    // Calculate the new premium expiration date
    let newPremiumUntil;
    
    if (userData.subscription?.endDate) {
      // If user has an active subscription, add 30 days to their current expiration
      const currentExpiration = new Date(userData.subscription.endDate);
      newPremiumUntil = new Date(currentExpiration.setDate(currentExpiration.getDate() + 30));
    } else {
      // If user doesn't have a subscription, set expiration to 30 days from now
      newPremiumUntil = new Date();
      newPremiumUntil.setDate(newPremiumUntil.getDate() + 30);
    }
    
    // Remove the reward from available rewards
    availableRewards.splice(rewardIndex, 1);
    
    // Add the reward to the used rewards list
    const usedReward = {
      ...reward,
      appliedAt: new Date().toISOString(),
      premiumUntil: newPremiumUntil.toISOString()
    };
    
    // Determine which premium plan to use (use the monthly premium plan)
    const premiumPlanId = 'price_1QrL8rEsYMRYIVaAR2eJ9Vta'; // PREMIUM monthly plan
    
    // Update the user document with the extended subscription
    const updateData = {
      'subscription.endDate': newPremiumUntil.toISOString(),
      'referrals.availableRewards': availableRewards,
      'referrals.usedRewards': arrayUnion(usedReward)
    };
    
    // If the user doesn't already have a premium plan, update their plan
    if (!userData.subscription || userData.subscription.plan !== premiumPlanId) {
      updateData['subscription.plan'] = premiumPlanId;
      updateData['subscription.status'] = 'active';
      updateData['subscription.limits'] = { baseResume: 1, tailoredResumes: Infinity };
    }
    
    // Update the user document
    await updateDoc(userRef, updateData);
    
    return {
      success: true,
      message: 'Premium reward applied successfully',
      newPremiumUntil: newPremiumUntil.toISOString()
    };
  } catch (error) {
    console.error('Error applying premium reward:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Gets referral statistics for a user
 * @param {string} userId - The user's ID
 * @returns {Promise<object>} - Referral statistics
 */
export const getReferralStats = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      return { success: false, message: 'User not found' };
    }
    
    const userData = userDoc.data();
    const referrals = userData.referrals || {
      initialized: false,
      referredBy: '',
      availableReferralCodes: [],
      usedReferralCodes: [],
      paidReferrals: [],
      rewardsEarned: [],
      availableRewards: [],
      totalRewardsEarned: 0
    };
    
    // If referrals aren't initialized yet, initialize them without generating a code
    if (!userData.referrals || !userData.referrals.initialized) {
      // Initialize referral data without generating a code
      const referralData = {
        referrals: {
          initialized: true,
          referredBy: '',
          availableReferralCodes: [],
          usedReferralCodes: [],
          paidReferrals: [],
          rewardsEarned: [],
          availableRewards: [],
          totalRewardsEarned: 0
        }
      };
      
      // Update the user's document with the referral data
      await updateDoc(userRef, referralData);
    }
    
    // Get details of referred users
    const referredUserDetails = [];
    
    if (referrals.paidReferrals && referrals.paidReferrals.length > 0) {
      for (const referredUserId of referrals.paidReferrals) {
        try {
          const referredUserDoc = await getDoc(doc(db, 'users', referredUserId));
          if (referredUserDoc.exists()) {
            const referredUserData = referredUserDoc.data();
            
            referredUserDetails.push({
              id: referredUserId,
              firstName: referredUserData.firstName || 'Unknown',
              lastName: referredUserData.lastName || 'User',
              joinDate: referredUserData.createdAt || null,
              isPaid: true,
              status: 'Subscribed'
            });
          }
        } catch (error) {
          console.error(`Error fetching referred user ${referredUserId}:`, error);
        }
      }
    }
    
    // Get the latest available referral code
    const availableCodes = referrals.availableReferralCodes || [];
    const unusedCodes = availableCodes.filter(code => !code.used);
    const latestCode = unusedCodes.length > 0 
      ? unusedCodes[unusedCodes.length - 1].code 
      : '';
    
    // Calculate progress to next reward
    const paidReferralCount = referrals.paidReferrals?.length || 0;
    const progressToNextReward = paidReferralCount % 5;
    const neededForNextReward = 5 - progressToNextReward;
    
    return {
      success: true,
      currentReferralCode: latestCode,
      hasAvailableCode: unusedCodes.length > 0,
      totalUsedCodes: (referrals.usedReferralCodes || []).length,
      paidReferralCount,
      referredUsers: referredUserDetails,
      rewardsEarned: referrals.rewardsEarned || [],
      availableRewards: referrals.availableRewards || [],
      progressToNextReward,
      neededForNextReward,
      totalRewardsEarned: referrals.totalRewardsEarned || 0
    };
  } catch (error) {
    console.error('Error getting referral stats:', error);
    return { success: false, message: error.message };
  }
};
