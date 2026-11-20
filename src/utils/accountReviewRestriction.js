export const isAccountUnderReview = userData =>
  userData?.isFlaggedForAbuse === true ||
  userData?.isFlaggedForAbuse === 'true';

const sanitizeAccountReviewReason = reason => {
  if (typeof reason !== 'string') {
    return '';
  }

  return reason
    .replace(/flag customer account for review\.?/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[.,;:]$/, '');
};

export const getAccountReviewReasons = userData => {
  const abuseReasons = Array.isArray(userData?.abuseReasons)
    ? userData.abuseReasons
    : [];
  const activeFlagReasons = Array.isArray(userData?.activeAbuseFlags)
    ? userData.activeAbuseFlags
        .map(flag => flag?.reason)
        .filter(reason => typeof reason === 'string' && reason.trim())
    : [];

  return [
    ...new Set(
      [...abuseReasons, ...activeFlagReasons]
        .map(sanitizeAccountReviewReason)
        .filter(Boolean),
    ),
  ];
};

export const getAccountReviewMessage = userData => {
  const reasons = getAccountReviewReasons(userData);

  if (!reasons.length) {
    return 'New bookings are temporarily paused while Nail Warz reviews your account. Please contact Nail Warz support for assistance.';
  }

  return [
    'New bookings are temporarily paused while Nail Warz reviews your account.',
    '',
    'Reason:',
    ...reasons.map(reason => `- ${reason}`),
    '',
    'Please contact Nail Warz support if you need help with this review.',
  ].join('\n');
};
