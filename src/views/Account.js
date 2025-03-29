import React, {useState, useEffect} from 'react'
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import { Button, Card, OverlayTrigger, Tooltip, ProgressBar, Alert, Badge } from 'react-bootstrap';
import { useUser } from '../context/UserContext';
import { useData } from '../context/DataContext';
import DeleteUserModal from '../components/user/DeleteUserModal';
import { BsQuestionCircle, BsShare, BsPlus } from "react-icons/bs";
import { createNewReferralCode, getReferralStats, applyPremiumReward } from '../server/ReferralService';

export default function Account() {
  const {
    displayCorrectPlan,
    user,
    setDeleteAcctModal,
    subscriptionPlans,
    daysLeft,
    describeBaseResume,
    describeTailoredResume
  } = useUser();
  const {
    handleManagePlan,
    initializeUserReferral
  } = useData();
  const [referralStats, setReferralStats] = useState({
    currentReferralCode: '',
    hasAvailableCode: false,
    totalUsedCodes: 0,
    paidReferralCount: 0,
    referredUsers: [],
    availableRewards: [],
    progressToNextReward: 0,
    neededForNextReward: 5,
    totalRewardsEarned: 0
  });
  const [copied, setCopied] = useState(false);
  const [rewardApplying, setRewardApplying] = useState(false);
  const [generatingCode, setGeneratingCode] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [codeGenerated, setCodeGenerated] = useState(false);

  useEffect(() => {
    if (user.id) {
      // Only fetch referral stats, don't automatically generate a code
      fetchReferralStats();
    }
  }, [user.id]);

  const fetchReferralStats = async () => {
    setLoading(true);
    try {
      const stats = await getReferralStats(user.id);
      if (stats.success) {
        setReferralStats(stats);
      }
    } catch (error) {
      console.error('Error fetching referral stats:', error);
    }
    setLoading(false);
  };

  const handleGenerateNewCode = async () => {
    if (!user || !user.id) return;
    
    setGeneratingCode(true);
    setErrorMessage('');
    
    try {
      const result = await createNewReferralCode(user.id);
      
      if (result.success) {
        // Refresh referral stats
        fetchReferralStats();
        // Mark that the user has explicitly generated a code
        setCodeGenerated(true);
      } else {
        setErrorMessage('Failed to generate new code: ' + result.message);
      }
    } catch (error) {
      setErrorMessage('Error generating code: ' + error.message);
    }
    
    setGeneratingCode(false);
  };

  const handleApplyReward = async (rewardId) => {
    setRewardApplying(true);

    try {
      const result = await applyPremiumReward(user.id, rewardId);
      if (result.success) {
        fetchReferralStats(); // Refresh stats
      } else {
        setErrorMessage(result.message || 'Failed to apply reward');
      }
    } catch (error) {
      setErrorMessage('Error applying reward');
      console.error('Error applying reward:', error);
    }
    setRewardApplying(false);
  };

  const handleDeleteAccount = () => {
      setDeleteAcctModal(true);
  };
  
  return (
    <>
        <Header />
        <div className='pageWrapper'>
            <div className='secondaryPageWrapper'>
              <DeleteUserModal/>
              <div className='rightDiv'>
                <Card className="mb-4 shadow-sm">
                  <Card.Body>
                    <div className="cardInnerDiv p-3">
                      <h4 className="mb-3">Subscription Plan</h4>
                      <h6 className="mb-2">
                        <strong>Current Plan: {displayCorrectPlan()}</strong> 
                      </h6>
                      <hr className="my-3" />
                      <div className="usage-info mb-3">
                        <h6 className="mb-2">Current Usage</h6>
                        <p className="mb-1">
                          <strong>Base Resume:</strong> {user.subscription?.usage.baseResume} / {subscriptionPlans[user.subscription.plan]?.baseResume}
                          <OverlayTrigger 
                              overlay={
                              <Tooltip id="tooltip">
                                  {describeBaseResume}
                              </Tooltip>
                              }>
                              <span className="question-icon">
                                  <BsQuestionCircle />
                              </span>
                          </OverlayTrigger>
                        </p>
                        <p>
                          <strong>Tailored Resume(s):</strong> {user.subscription?.usage.tailoredResumes} / {subscriptionPlans[user.subscription.plan]?.tailoredResumes}
                          <OverlayTrigger 
                              overlay={
                              <Tooltip id="tooltip">
                                  {describeTailoredResume}
                              </Tooltip>
                              }>
                              <span className="question-icon">
                                  <BsQuestionCircle />
                              </span>
                          </OverlayTrigger>
                        </p>
                      </div>
                      <hr className="my-3" />
                      <p className="mb-4">
                        <strong>Days left in Billing Cycle:</strong> {daysLeft}
                      </p>
                      <div className="text-center">
                        <Button variant="primary" onClick={handleManagePlan}>
                          Manage Plan
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>

                <Card className="mb-4 shadow-sm">
                  <Card.Body>
                    <div className='cardInnerDiv'>
                      <h4>Referral Program</h4>
                      <p>Invite your friends and earn rewards! When 5 people use your referral codes to subscribe to a paid plan, you'll get 1 month of premium for free.</p>
                      
                      {errorMessage && (
                        <Alert variant="danger" className="mb-3">
                          {errorMessage}
                        </Alert>
                      )}
                      
                      {referralStats.availableRewards && referralStats.availableRewards.length > 0 && (
                        <Alert variant="success" className="mb-3">
                          <strong>Congratulations!</strong> You have {referralStats.availableRewards.length} premium month reward{referralStats.availableRewards.length > 1 ? 's' : ''} available.
                          {referralStats.availableRewards.map((reward, index) => (
                            <div key={reward.id} className="mt-2">
                              <Button 
                                variant="primary" 
                                size="sm"
                                onClick={() => handleApplyReward(reward.id)}
                                disabled={rewardApplying}
                              >
                                {rewardApplying ? 'Applying...' : 'Apply Premium Month Reward'}
                              </Button>
                              <small className="text-muted ml-2"> (Expires: {new Date(reward.expiresAt).toLocaleDateString()})</small>
                            </div>
                          ))}
                        </Alert>
                      )}
                      
                      <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <p className="mb-0"><strong>Your Referral Code:</strong></p>
                          <Button 
                            variant="primary" 
                            size="sm"
                            onClick={handleGenerateNewCode}
                            disabled={generatingCode}
                            className="d-flex align-items-center"
                          >
                            <BsPlus className="mr-1" /> {generatingCode ? 'Generating...' : 'Generate New Code'}
                          </Button>
                        </div>
                        
                        {(codeGenerated && referralStats.hasAvailableCode) ? (
                          <>
                            <div className="input-group">
                              <input 
                                type='text' 
                                value={referralStats.currentReferralCode} 
                                readOnly 
                                className='form-control' 
                              />
                              <div className="input-group-append">
                                <Button 
                                  variant="primary" 
                                  onClick={() => {
                                    navigator.clipboard.writeText(referralStats.currentReferralCode);
                                    setCopied(true);
                                    setTimeout(() => setCopied(false), 3000);
                                  }}
                                  className="d-flex align-items-center"
                                >
                                  <BsShare className="mr-1" /> {copied ? 'Copied!' : 'Copy'}
                                </Button>
                              </div>
                            </div>
                            <small className="text-muted">Share this code with a friend to give them 20% off their subscription. <strong>This is a single-use code.</strong></small>
                          </>
                        ) : (
                          <Alert variant="warning">
                            You don't have any available referral codes. Generate a new one to share with a friend.
                          </Alert>
                        )}
                      </div>
                      
                      <div className="mb-3">
                        <p className="mb-1"><strong>Referral Stats:</strong></p>
                        <p>Total used referral codes: {referralStats.totalUsedCodes}</p>
                        <p>Successful paid referrals: {referralStats.paidReferralCount}</p>
                        {referralStats.totalRewardsEarned > 0 && (
                          <p>
                            <strong>Total free months earned:</strong> {referralStats.totalRewardsEarned}
                            {referralStats.availableRewards.length > 0 && (
                              <span className="text-success"> ({referralStats.availableRewards.length} available to use)</span>
                            )}
                          </p>
                        )}
                        
                        <div className="d-flex justify-content-between mb-1">
                          <span>Progress to next reward:</span>
                          <span>{referralStats.progressToNextReward}/5</span>
                        </div>
                        <ProgressBar 
                          now={referralStats.progressToNextReward * 20} 
                          label={`${referralStats.progressToNextReward}/5`} 
                          className="mb-2"
                          variant={referralStats.progressToNextReward >= 4 ? "success" : "primary"}
                        />
                        <small className="text-muted">
                          {referralStats.neededForNextReward} more paid referral{referralStats.neededForNextReward !== 1 ? 's' : ''} needed for your next free month
                        </small>
                        {referralStats.paidReferralCount >= 5 && (
                          <div className="mt-2">
                            <small className="text-success">
                              <strong>Keep referring!</strong> You'll earn another free month for every 5 paid referrals.
                            </small>
                          </div>
                        )}
                      </div>
                      
                      {referralStats.referredUsers && referralStats.referredUsers.length > 0 && (
                        <div>
                          <p className="mb-2"><strong>Your Referrals:</strong></p>
                          <ul className="list-group">
                            {referralStats.referredUsers.map((user, index) => (
                              <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                {user.firstName} {user.lastName}
                                <Badge bg={user.isPaid ? "success" : "warning"}>
                                  {user.status}
                                </Badge>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </Card.Body>
                </Card>

                <Card>
                  <Card.Body>
                    <div className='cardInnerDiv'>
                      <h4>Delete Account</h4>
                      <p>What happens when you delete your account? All your account information will be deleted from the database, and any saved resumes you have will be lost. Any outstanding subscription plans you are signed up for will be cancelled immediately, and the service will no longer be accessible to you.</p>
                      <p><strong>This action cannot be reversed.</strong></p>
                      <div>
                      <Button 
                        variant='danger' 
                        onClick={handleDeleteAccount}>
                          Delete
                      </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </div>
        </div>
        <Footer />
    </>
  )
}
