import axios from 'axios';
// Function to fetch data from Facebook
export async function fetchFacebookData() {
  const url = `https://graph.facebook.com/v12.0/me?fields=name,followers&access_token=${process.env.FACEBOOK_API_KEY}`;
  const response = await axios.get(url);
  const insightsUrl = `https://graph.facebook.com/v12.0/me/insights?metric=page_impressions,page_engaged_users&access_token=${process.env.FACEBOOK_API_KEY}`;
  const insightsResponse = await axios.get(insightsUrl);
  const dailyMetrics = insightsResponse.data.data || [];
  const pageviews = dailyMetrics.find(metric => metric.name === 'page_impressions')?.values[0]?.value || 0;
  const previousPageviews = dailyMetrics.find(metric => metric.name === 'page_impressions')?.values[1]?.value || 0;
  const likes = dailyMetrics.find(metric => metric.name === 'page_engaged_users')?.values[0]?.value || 0;
  const previousLikes = dailyMetrics.find(metric => metric.name === 'page_engaged_users')?.values[1]?.value || 0;
  const currentFollowers = response.data.followers || 0;
  const previousFollowers = 0; // Replace with a stored value or fallback
  const today = currentFollowers - previousFollowers;

  return {
    username: response.data.name,
    followers: currentFollowers || 0,
    today, // Example for "Today" metric
    daily: {
      pageviews,
      likes,
      pageviewsChange: previousPageviews
        ? ((pageviews - previousPageviews) / previousPageviews) * 100
        : 0,
      likesChange: previousLikes
        ? ((likes - previousLikes) / previousLikes) * 100
        : 0,
    },
  };
}

// Function to fetch data from Twitter
 export async function fetchTwitterData() {
  const url = `https://api.twitter.com/2/users/by/username/${process.env.TWITTER_USERNAME}?user.fields=public_metrics`;
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${process.env.TWITTER_API_KEY}` },
  });

  // Fetch recent tweets for daily metrics
  const tweetsUrl = `https://api.twitter.com/2/users/${response.data.data.id}/tweets?tweet.fields=public_metrics`;
  const tweetsResponse = await axios.get(tweetsUrl, {
    headers: { Authorization: `Bearer ${process.env.TWITTER_API_KEY}` },
  });

  const recentTweets = tweetsResponse.data.data || [];
  const dailyLikes = recentTweets.reduce((sum, tweet) => sum + (tweet.public_metrics.like_count || 0), 0);
  const previousLikes = recentTweets.length > 1 ? recentTweets[1].public_metrics.like_count || 0 : 0;
  const dailyRetweets = recentTweets.reduce((sum, tweet) => sum + (tweet.public_metrics.retweet_count || 0), 0);
  const previousRetweets = recentTweets.length > 1 ? recentTweets[1].public_metrics.retweet_count || 0 : 0;
  const currentFollowers = response.data.data.public_metrics.followers_count || 0;
  const previousFollowers = 0; // Replace with a stored value or fallback
  const today = currentFollowers - previousFollowers;


  return {
    handle: response.data.data.username, // Fetch the username dynamically
    followers: currentFollowers || 0,
    today,
    daily: {
      likes: dailyLikes,
      retweets: dailyRetweets,
      likesChange: previousLikes
        ? ((dailyLikes - previousLikes) / previousLikes) * 100
        : 0,
      retweetsChange: previousRetweets
        ? ((dailyRetweets - previousRetweets) / previousRetweets) * 100
        : 0,
    },
  };
}

// Function to fetch data from Instagram
export async function fetchInstagramData() {
  const url = `https://graph.instagram.com/me?fields=username,followers_count&access_token=${process.env.INSTAGRAM_API_KEY}`;
  const response = await axios.get(url);

  // Fetch insights for daily metrics (if available)
  const insightsUrl = `https://graph.instagram.com/me/insights?metric=impressions,reach&access_token=${process.env.INSTAGRAM_API_KEY}`;
  const insightsResponse = await axios.get(insightsUrl);
  const dailyMetrics = insightsResponse.data.data || [];
  const likes = dailyMetrics.find(metric => metric.name === 'impressions')?.values[0]?.value || 0;
  const previousLikes = dailyMetrics.find(metric => metric.name === 'impressions')?.values[1]?.value || 0;
  const profileviews = dailyMetrics.find(metric => metric.name === 'reach')?.values[0]?.value || 0;
  const previousProfileviews = dailyMetrics.find(metric => metric.name === 'reach')?.values[1]?.value || 0;
  const currentFollowers = response.data.followers_count || 0;
  const previousFollowers = 0; // Replace with a stored value or fallback
  const today = currentFollowers - previousFollowers;

  return {
    username: response.data.username, // Fetch the username dynamically
    followers: currentFollowers || 0,
    today,
    daily: {
      likes,
      profileviews,
      likesChange: previousLikes
        ? ((likes - previousLikes) / previousLikes) * 100
        : 0,
      profileviewsChange: previousProfileviews
        ? ((profileviews - previousProfileviews) / previousProfileviews) * 100
        : 0,
    },
  };
}

// Function to fetch data from YouTube
export async function fetchYouTubeData() {
  const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&forUsername=${process.env.YOUTUBE_USERNAME}&key=${process.env.YOUTUBE_API_KEY}`;
  const response = await axios.get(url);
  const channel = response.data.items[0];

  // Fetch recent videos for daily metrics
  const videosUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channel.id}&order=date&maxResults=5&key=${process.env.YOUTUBE_API_KEY}`;
  const videosResponse = await axios.get(videosUrl);
  const videoIds = videosResponse.data.items.map(video => video.id.videoId).join(',');
  const videoStatsUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}&key=${process.env.YOUTUBE_API_KEY}`;
  const videoStatsResponse = await axios.get(videoStatsUrl);
  const videoStats = videoStatsResponse.data.items || [];
  const dailyLikes = videoStats.reduce((sum, video) => sum + (video.statistics.likeCount || 0), 0);
  const previousLikes = videoStats.length > 1 ? videoStats[1].statistics.likeCount || 0 : 0;
  const dailyViews = videoStats.reduce((sum, video) => sum + (video.statistics.viewCount || 0), 0);
  const previousViews = videoStats.length > 1 ? videoStats[1].statistics.viewCount || 0 : 0;
  const currentSubscribers = channel.statistics.subscriberCount || 0;
  const previousSubscribers = 0; // Replace with a stored value or fallback
  const today = currentSubscribers - previousSubscribers;

  return {
    username: channel.snippet.title, // Fetch the channel title (username)
    subscribers: currentSubscribers || 0,
    today,
    daily: {
      likes: dailyLikes,
      totalviews: dailyViews,
      likesChange: previousLikes
        ? ((dailyLikes - previousLikes) / previousLikes) * 100
        : 0,
      totalviewsChange: previousViews
        ? ((dailyViews - previousViews) / previousViews) * 100
        : 0,
    },
  };
}



